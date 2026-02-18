import Order from "../models/Order.model.js";

/**
 * Create Order (Admin / Test use)
 */
export const createOrder = async (req, res) => {
  try {
    const { businessId, orderNumber, customerEmail, status, trackingNumber, totalAmount } = req.body;

    const order = await Order.create({
      business: businessId,
      orderNumber,
      customerEmail,
      status,
      trackingNumber,
      totalAmount
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/**
 * Get order by orderNumber
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const { businessId, orderNumber } = req.params;

    const order = await Order.findOne({
      business: businessId,
      orderNumber
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};
