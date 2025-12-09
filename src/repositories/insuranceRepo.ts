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
    const keywords = query.split(" ").filter(w => w.length > 3);
    
    if (keywords.length === 0) return "Please provide more details.";

    const conditions = keywords.map(() => `question LIKE ? OR answer LIKE ?`).join(' OR ');
    const values = keywords.flatMap(k => [`%${k}%`, `%${k}%`]);

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT question, answer FROM knowledge_base WHERE ${conditions} LIMIT 5`,
      values
    );

    if (rows.length === 0) return null;
    
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
  },


  async getClaimStatus(policyId: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT claim_type, status, remarks, DATE_FORMAT(submitted_date, '%Y-%m-%d') as date 
       FROM claims 
       WHERE policy_id = ? 
       ORDER BY submitted_date DESC LIMIT 1`,
      [policyId]
    );
    
    if (rows.length === 0) return "No claim records found for this policy ID.";
    
    const r = rows[0];
    return `Claim Type: ${r.claim_type}\nStatus: ${r.status.toUpperCase()}\nSubmitted: ${r.date}\nRemarks: ${r.remarks}`;
  },

  // NEW: Get Web Links
  async getWebLink(linkType: string) {
    // Searches for 'brochure', 'pay', 'portal' etc.
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT description, url FROM web_links 
       WHERE link_type LIKE ? OR description LIKE ? 
       LIMIT 1`,
      [`%${linkType}%`, `%${linkType}%`]
    );

    if (rows.length === 0) return null;
    return rows[0];
  },


  async getCustomerPortfolio(nic: string) {
    // 1. Find Customer
    const [custRows] = await db.execute<RowDataPacket[]>(
      `SELECT customer_id, full_name, mobile FROM customers WHERE nic = ?`,
      [nic]
    );

    if (custRows.length === 0) return null;
    const customer = custRows[0];

    // 2. Find Their Active Policies
    const [policyRows] = await db.execute<RowDataPacket[]>(
      `SELECT p.policy_id, pl.plan_name, p.status, p.end_date 
       FROM customer_policies p
       JOIN insurance_plans pl ON p.plan_id = pl.plan_id
       WHERE p.customer_id = ?`,
      [customer.customer_id]
    );

    // 3. Format the Portfolio for AI
    const policies = policyRows.length > 0 
      ? policyRows.map(p => `- ${p.plan_name} (${p.policy_id}): ${p.status.toUpperCase()}, Expires: ${p.end_date}`).join('\n')
      : "No active policies.";

    return `Customer Identified: ${customer.full_name}\nMobile: ${customer.mobile}\n\nPortfolio:\n${policies}`;
  }

};