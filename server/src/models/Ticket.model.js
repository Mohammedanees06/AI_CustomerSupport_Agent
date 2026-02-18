import mongoose from "mongoose";

/**
 *  WHY DO WE NEED A TICKET SYSTEM?
 *
 * Even though we have AI, AI is not 100% perfect.
 * Sometimes:
 * - AI doesn't understand the question
 * - Business data is missing
 * - Customer wants human support
 *
 * In those cases:
 *  We automatically create a ticket
 *  Human support team handles it
 *
 * This makes the system production-ready.
 */

const TicketSchema = new mongoose.Schema(
  {
    /**
     * Which business does this ticket belong to?
     * 
     * Because this is a multi-tenant SaaS system.
     * Many businesses use the same platform.
     * We must separate their tickets.
     */
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },

    /**
     *  What did the customer ask?
     * 
     * We store the original message
     * so humans can see the exact problem.
     */
    customerMessage: {
      type: String,
      required: true
    },

    /**
     * Ticket Status
     * 
     * open → newly created
     * in-progress → someone is working on it
     * resolved → issue solved
     * 
     * This helps track workflow.
     */
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open"
    },

    /**
     * Priority Level
     * 
     * high → refund issue / payment failure
     * medium → order delay
     * low → general inquiry
     * 
     * Helps businesses respond faster to urgent cases.
     */
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    /**
     * Assigned Staff Member
     * 
     * When a human agent picks up the ticket,
     * we store which user is handling it.
     */
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export default mongoose.model("Ticket", TicketSchema);
