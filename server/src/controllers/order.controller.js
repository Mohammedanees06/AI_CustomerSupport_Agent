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


/**
 * Get all orders for a business
 */
export const getOrders = async (req, res) => {
  try {
    const { businessId } = req.params;
    const orders = await Order.find({ business: businessId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * Update order
 */
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, totalAmount, customerEmail } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, trackingNumber, totalAmount, customerEmail },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
};

/**
 * Delete order
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};