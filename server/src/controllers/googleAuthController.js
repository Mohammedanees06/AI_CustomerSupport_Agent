import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  res.redirect(`${clientUrl}/auth/google/success?token=${token}`);
};
