import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 🔥 FIXED: Agar token me "Bearer " laga hai, toh use split karke asli token nikal lo
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Ab bina "Bearer " ke ekdum clean token verify hoga
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "YOUR_JWT_SECRET_KEY" // Fallback back-up key check
    );

    req.user = decoded;
    next();

  } catch (error) {
    console.error("JWT Verification Detail Error:", error.message);
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;