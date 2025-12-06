import { FunctionDeclaration, SchemaType } from '@google/generative-ai';

// Tool 1: Calculate Motor Premium
export const calculateMotorTool: FunctionDeclaration = {
  name: "calculate_motor_premium",
  description: "Calculates the insurance premium for a vehicle based on its value and type.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      vehicleValue: {
        type: SchemaType.NUMBER,
        description: "The market value of the vehicle in LKR."
      },
      vehicleType: {
        type: SchemaType.STRING,
        description: "The type of vehicle (e.g., car, van, bike, suv)."
      }
    },
    required: ["vehicleValue", "vehicleType"]
  }
};

// Tool 2: Check Policy Status
export const checkPolicyStatusTool: FunctionDeclaration = {
  name: "check_policy_status",
  description: "Checks the status, renewal date, and active state of an existing insurance policy.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      policyId: {
        type: SchemaType.STRING,
        description: "The policy number (e.g., P-0001)."
      }
    },
    required: ["policyId"]
  }
};

export const searchKnowledgeTool: FunctionDeclaration = {
  name: "search_knowledge_base",
  description: "Searches for general information about policies, exclusions, claims, or contact info.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: { type: SchemaType.STRING, description: "The search keyword (e.g., 'claim process', 'exclusions')." }
    },
    required: ["query"]
  }
};

// Tool 4: Compare Plans
export const comparePlansTool: FunctionDeclaration = {
  name: "compare_plans",
  description: "Fetches details of two or more insurance plans to compare benefits.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      category: { type: SchemaType.STRING, description: "The category to compare (e.g., motor, health)." }
    },
    required: ["category"]
  }
};

// Export all tools
export const chatTools = [calculateMotorTool, checkPolicyStatusTool, searchKnowledgeTool, comparePlansTool];