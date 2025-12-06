import { db } from '../config/database';
import { RowDataPacket } from 'mysql2';

export const InsuranceRepo = {
  async getPlanByName(name: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM insurance_plans WHERE plan_name LIKE ? LIMIT 1`,
      [`%${name}%`]
    );
    return rows[0];
  },

  async getRatesByPlanId(planId: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM insurance_rates WHERE plan_id = ? LIMIT 1`,
      [planId]
    );
    return rows[0];
  },

  async getPolicyByPolicyId(policyId: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT p.*, pl.plan_name 
       FROM customer_policies p 
       JOIN insurance_plans pl ON p.plan_id = pl.plan_id 
       WHERE p.policy_id = ?`,
      [policyId]
    );
    return rows[0];
  },

  async searchKnowledgeBase(query: string) {
    
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT question, answer FROM knowledge_base 
       WHERE question LIKE ? OR answer LIKE ? 
       LIMIT 3`,
      [`%${query}%`, `%${query}%`]
    );
    
    if (rows.length === 0) return "No specific documents found in the database.";
    
    return rows.map(r => `Q: ${r.question}\nA: ${r.answer}`).join("\n---\n");
  },

  async getPlansByCategory(category: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT plan_name, coverage_amount, features 
       FROM insurance_plans 
       WHERE category = ?`,
      [category]
    );
    return JSON.stringify(rows); 
  }
};