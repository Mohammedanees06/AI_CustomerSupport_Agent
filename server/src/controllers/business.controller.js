import Business from "../models/Business.model.js";

/** CREATE BUSINESS
 * One user creates one business */


export const createBusiness = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { name } = req.body;
    const ownerId = req.user._id; 

    if (!name) {
      return res.status(400).json({ message: "Business name is required" });
    }

    const existingBusiness = await Business.findOne({ owner: ownerId });
    if (existingBusiness) {
      return res.status(400).json({ message: "User already has a business" });
    }

    const business = await Business.create({ name, owner: ownerId });
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


/**
 * UPDATE BUSINESS
 */
export const updateBusiness = async (req, res) => {
  try {
    const { name, widgetColor, widgetTitle, welcomeMessage } = req.body;

    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { name, widgetColor, widgetTitle, welcomeMessage },
      { new: true }
    );

    if (!business) return res.status(404).json({ message: "Business not found" });

    res.json(business);
  } catch (err) {
    console.error("Update business error:", err);
    res.status(500).json({ message: "Failed to update business" });
  }
};

/**
 * DELETE BUSINESS
 */
export const deleteBusiness = async (req, res) => {
  try {
    await Business.findOneAndDelete({ owner: req.user._id });
    res.json({ message: "Business deleted" });
  } catch (err) {
    console.error("Delete business error:", err);
    res.status(500).json({ message: "Failed to delete business" });
  }
};