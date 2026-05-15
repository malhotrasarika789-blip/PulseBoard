import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "YOUR_JWT_SECRET_KEY" 
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
