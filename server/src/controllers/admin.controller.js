import User from "../models/User.js";
import Business from "../models/Business.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/Message.model.js";
import Ticket from "../models/Ticket.model.js";

/**
 * GET ALL BUSINESSES
 * Route: GET /api/admin/businesses
 */
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });

    const enriched = await Promise.all(
      businesses.map(async (biz) => {
        const owner = await User.findById(biz.owner).select("name email role");

        const totalConversations = await Conversation.countDocuments({ businessId: biz._id });
        const totalMessages = await Message.countDocuments({
          conversation: {
            $in: await Conversation.find({ businessId: biz._id }).distinct("_id"),
          },
        });
        const totalTickets = await Ticket.countDocuments({ business: biz._id });
        const openTickets = await Ticket.countDocuments({ business: biz._id, status: "open" });

        return {
          ...biz.toObject(),
          owner: owner || null,
          stats: {
            totalConversations,
            totalMessages,
            totalTickets,
            openTickets,
          },
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error("Admin getAllBusinesses error:", error);
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
};

/**
 * GET PLATFORM ANALYTICS
 * Route: GET /api/admin/analytics
 */
export const getPlatformAnalytics = async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments();
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });

    // Messages per day for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messagesPerDay = await Message.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalBusinesses,
      totalUsers,
      totalConversations,
      totalMessages,
      totalTickets,
      openTickets,
      resolvedTickets,
      messagesPerDay,
    });
  } catch (error) {
    console.error("Admin getPlatformAnalytics error:", error);
    res.status(500).json({ message: "Failed to fetch platform analytics" });
  }
};

/**
 * SUSPEND BUSINESS
 * Route: PATCH /api/admin/business/:id/suspend
 */
export const suspendBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    );

    if (!business) return res.status(404).json({ message: "Business not found" });

    res.json({ message: "Business suspended", business });
  } catch (error) {
    res.status(500).json({ message: "Failed to suspend business" });
  }
};

/**
 * ACTIVATE BUSINESS
 * Route: PATCH /api/admin/business/:id/activate
 */
export const activateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!business) return res.status(404).json({ message: "Business not found" });

    res.json({ message: "Business activated", business });
  } catch (error) {
    res.status(500).json({ message: "Failed to activate business" });
  }
};