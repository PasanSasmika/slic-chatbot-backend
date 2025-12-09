import { FunctionDeclaration, SchemaType } from '@google/generative-ai';


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

export const checkClaimTool: FunctionDeclaration = {
  name: "check_claim_status",
  description: "Checks the current status of an insurance claim using the Policy ID.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      policyId: { 
        type: SchemaType.STRING, 
        description: "The policy number provided by the user (e.g., P-0001)." 
      }
    },
    required: ["policyId"]
  }
};

// 2. Tool for Links
export const getLinkTool: FunctionDeclaration = {
  name: "get_web_link",
  description: "Retrieves official URLs for brochures, online payments, portals, or WhatsApp support.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      keyword: { 
        type: SchemaType.STRING, 
        description: "The type of link needed (e.g., 'brochure', 'payment', 'renewal', 'contact')." 
      }
    },
    required: ["keyword"]
  }
};


export const identifyCustomerTool: FunctionDeclaration = {
  name: "verify_customer_identity",
  description: "Verifies a customer's identity using their NIC (National ID Card) to retrieve policy details.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      nic: { 
        type: SchemaType.STRING, 
        description: "The National Identity Card number provided by the user (e.g., 931234567V)." 
      }
    },
    required: ["nic"]
  }
};
export const chatTools = [calculateMotorTool, checkPolicyStatusTool, searchKnowledgeTool, comparePlansTool,checkClaimTool,getLinkTool,identifyCustomerTool];