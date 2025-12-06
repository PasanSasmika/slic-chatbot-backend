import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { chatTools } from '../ai/tools';
import { ChatRepo } from '../repositories/chatRepo';
import { InsuranceRepo } from '../repositories/insuranceRepo';
import { PricingService } from './pricingService';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", 
  tools: [{ functionDeclarations: chatTools }],

  systemInstruction: `
    You are 'CoverChat AI', the official virtual assistant for Sri Lanka Insurance Corporation (SLIC).
    
    YOUR RESPONSIBILITIES:
    1. Help customers choose the right insurance plan (Motor, Health, Life).
    2. Calculate premiums accurately using the 'calculate_motor_premium' tool. Do not guess numbers.
    3. Check policy statuses using the 'check_policy_status' tool.
    4. Provide official answers from the Knowledge Base.

    RULES:
    - If the user asks for a quote, YOU MUST ask for the required details (e.g., Vehicle Value) first.
    - Always answer in a professional, empathetic tone.
    - Currency is always 'LKR' (Sri Lankan Rupees).
    - If you cannot find the answer in the tools, say: "I apologize, but I don't have that specific information. Please contact our 24/7 hotline at 011-2355555."
    - Do not invent policy features that are not provided by the tools.
  `
});

export const ChatService = {
  async processUserMessage(userMessage: string, sessionId: string) {
    
    const history = await ChatRepo.getHistory(sessionId);

    const chat = model.startChat({
      history: history 
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const call = response.functionCalls();

    let finalResponseText = "";

    if (call && call.length > 0) {
      const functionCall = call[0];
      const { name, args } = functionCall;
      
      const safeArgs = args as any;

      let toolResult;
      console.log(`🛠️ Executing Tool: ${name}`);

      try {
        if (name === 'search_knowledge_base') {
           toolResult = await InsuranceRepo.searchKnowledgeBase(safeArgs.query);
        } 
        else if (name === 'compare_plans') {
           toolResult = await InsuranceRepo.getPlansByCategory(safeArgs.category);
        }
        else if (name === 'calculate_motor_premium') {
           toolResult = await PricingService.calculateMotorPremium(
             Number(safeArgs.vehicleValue), 
             String(safeArgs.vehicleType)
           );
        }
        else if (name === 'check_policy_status') {
           toolResult = await InsuranceRepo.getPolicyByPolicyId(String(safeArgs.policyId));
        }

        const finalResult = await chat.sendMessage([
          {
            functionResponse: {
              name: name,
              response: { result: toolResult }
            }
          }
        ]);
        finalResponseText = finalResult.response.text();

      } catch (err) {
        console.error("Tool Error:", err);
        finalResponseText = "I encountered a system error while fetching that data.";
      }
    } else {
      finalResponseText = response.text();
    }

    await ChatRepo.saveMessage(sessionId, 'user', userMessage);
    await ChatRepo.saveMessage(sessionId, 'model', finalResponseText);

    return finalResponseText;
  }
};