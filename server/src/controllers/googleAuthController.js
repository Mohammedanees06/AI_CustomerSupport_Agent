import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  if (!req.user) {
    return res.status(401).json({ message: "Google authentication failed" });
  }

  const token = jwt.sign(
    {
      userId: req.user._id,
      role: req.user.role || "business"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const clientUrl =
    process.env.CLIENT_URL || "http://localhost:5173";

  res.redirect(
    `${clientUrl}/auth/google/success?token=${token}`
  );
};