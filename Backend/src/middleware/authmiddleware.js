import { base } from "../services/base.js";
const baseService = new base();
export const authmiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        s: 0,
        m: "Authorization token required",
        errorCode: "UNAUTHORIZED",
        data: null,
      })
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        s: 0,
        m: "Invalid token format",
        errorCode: "UNAUTHORIZED",
        data: null,
      });
    }
    const decoded = baseService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        s: 0,
        m: "Invalid or expired token",
        errorCode: "UNAUTHORIZED",
        data: null,
      });
    }
    req.user = decoded;
    
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      s: 0,
      m: "Authentication failed",
      errorCode: "SERVER_ERROR",
      data: null,
    });
  }
};
