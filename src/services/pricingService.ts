import { InsuranceRepo } from '../repositories/insuranceRepo';

export const PricingService = {
  
  async calculateMotorPremium(vehicleValue: number, vehicleType: string) {
    const rateData = await InsuranceRepo.getRatesByPlanId(1); 
    
    if (!rateData) throw new Error("Pricing data not available");

    const typeFactors = typeof rateData.vehicle_type_factor === 'string' 
      ? JSON.parse(rateData.vehicle_type_factor) 
      : rateData.vehicle_type_factor;

    const multiplier = typeFactors[vehicleType.toLowerCase()] || 1.0;
    
    const finalRate = rateData.base_rate * multiplier;
    const premium = (vehicleValue * finalRate) / 100;

    return {
      vehicle_value: vehicleValue,
      applied_rate: finalRate,
      annual_premium: Math.ceil(premium), 
      currency: "LKR"
    };
  },


  async calculateHealthPremium(age: number, planName: string) {
    const plan = await InsuranceRepo.getPlanByName(planName);
    if (!plan) throw new Error(`Plan ${planName} not found`);

    const rateData = await InsuranceRepo.getRatesByPlanId(plan.plan_id);
    const ageFactors = typeof rateData.age_factor === 'string'
      ? JSON.parse(rateData.age_factor)
      : rateData.age_factor;

    let ageMultiplier = 1.0;
    for (const range in ageFactors) {
      const [min, max] = range.split('-').map(Number);
      if (age >= min && age <= max) {
        ageMultiplier = ageFactors[range];
        break;
      }
    }

    const basePremium = rateData.base_rate; 
    const finalPremium = basePremium * ageMultiplier;

    return {
      plan: plan.plan_name,
      age: age,
      multiplier: ageMultiplier,
      total_premium: finalPremium
    };
  }
};