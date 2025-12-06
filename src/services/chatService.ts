import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { chatTools } from '../ai/tools';
import { ChatRepo } from '../repositories/chatRepo';
import { InsuranceRepo } from '../repositories/insuranceRepo';
import { PricingService } from './pricingService';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
  tools: [{ functionDeclarations: chatTools }]
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