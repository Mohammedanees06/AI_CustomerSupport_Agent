import Business from "../models/Business.model.js";

/**
 * CREATE BUSINESS
 * One user creates one business
 */
export const createBusiness = async (req, res) => {
  try {
    console.log("createBusiness called. req.user:", req.user);

    // 1. FIXED: Check for 'userId' instead of '_id'
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { name } = req.body;
    
    // 2. FIXED: Extract the correct property
    const ownerId = req.user.userId; 

    if (!name) {
      return res.status(400).json({ message: "Business name is required" });
    }

    const existingBusiness = await Business.findOne({ owner: ownerId });
    if (existingBusiness) {
      return res.status(400).json({ message: "User already has a business" });
    }

    const business = await Business.create({
      name,
      owner: ownerId 
    });

    res.status(201).json(business);
  } catch (error) {
    console.error("Create business error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET LOGGED-IN USER BUSINESS
 */
export const getMyBusiness = async (req, res) => {
  try {
    const userId = req.user._id;

    const business = await Business.findOne({ owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
