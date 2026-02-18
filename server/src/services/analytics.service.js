import Analytics from "../models/Analytics.model.js";

/**
 * Ensure analytics document exists for business
 */
export const ensureAnalytics = async (businessId) => {
  let analytics = await Analytics.findOne({ business: businessId });

  if (!analytics) {
    analytics = await Analytics.create({ business: businessId });
  }

  return analytics;
};

/**
 * Increment specific field safely
 */
export const incrementMetric = async (businessId, field) => {
  await ensureAnalytics(businessId);

  await Analytics.updateOne(
    { business: businessId },
    { $inc: { [field]: 1 } }
  );
};
