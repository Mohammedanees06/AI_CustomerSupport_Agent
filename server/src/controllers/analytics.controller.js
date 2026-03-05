import Analytics from "../models/Analytics.model.js";
import Conversation from "../models/conversation.model.js";
import Ticket from "../models/Ticket.model.js";
import Message from "../models/Message.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Core metrics
    const analytics = await Analytics.findOne({ business: businessId });

    // Live counts
    const totalConversations = await Conversation.countDocuments({ businessId });
    const openTickets = await Ticket.countDocuments({ business: businessId, status: "open" });
    const resolvedTickets = await Ticket.countDocuments({ business: businessId, status: "resolved" });

    // AI resolution rate
    const totalTickets = (analytics?.totalTicketsCreated || 0);
    const totalResponses = (analytics?.totalAIResponses || 0);
    const resolutionRate = totalResponses > 0
      ? Math.round(((totalResponses - totalTickets) / totalResponses) * 100)
      : 0;

    res.json({
      totalMessages: analytics?.totalMessages || 0,
      totalAIResponses: analytics?.totalAIResponses || 0,
      totalOrderLookups: analytics?.totalOrderLookups || 0,
      totalTicketsCreated: analytics?.totalTicketsCreated || 0,
      totalConversations,
      openTickets,
      resolvedTickets,
      resolutionRate,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};