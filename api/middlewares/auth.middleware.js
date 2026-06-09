import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const isUser = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

