import Ticket from "../models/Ticket.model.js";

// Create ticket manually (Admin use)
export const createTicket = async (req, res) => {
  try {
    const { businessId, customerMessage, priority } = req.body;

    if (!businessId || !customerMessage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ticket = await Ticket.create({
      business: businessId,
      customerMessage,
      priority,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Ticket creation failed" });
  }
};

// Get all tickets for a business
export const getTickets = async (req, res) => {
  try {
    const { businessId } = req.params;

    const tickets = await Ticket.find({ business: businessId }).sort({
      createdAt: -1,
    });

    res.json(tickets);
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// ✅ Update ticket status / priority
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, priority } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { ...(status && { status }), ...(priority && { priority }) },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};