import { base } from "../services/base.js";
import db from "../config/db.js";
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
      })
    }

    const decoded = baseService.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        s: 0,
        m: "Invalid token",
        errorCode: "TOKEN_INVALID",
        data: null,
      });
    }
    
    if (decoded.expired) {
      return res.status(401).json({
        s: 0,
        m: "Token has expired. Please refresh your token.",
        errorCode: "TOKEN_EXPIRED",
        data: null,
      });
    }
    const [userResult] = await db.query(
      "SELECT u.id, u.email, u.name, u.is_verifide FROM users u INNER JOIN user_auth ua ON u.id = ua.user_id WHERE ua.access_token = ? AND u.id = ?",
      [token, decoded.userId]
    );
    
    if (!userResult || userResult.length === 0) {
      return res.status(401).json({
        s: 0,
        m: "Token not found or user does not exist",
        errorCode: "TOKEN_NOT_FOUND",
        data: null,
      });
    }
    const user = userResult[0];
    if (user.is_verifide !== 1) {
      return res.status(403).json({
        s: 0,
        m: "Email not verified",
        errorCode: "EMAIL_NOT_VERIFIED",
        data: null,
      })
    }
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: user.name,
    }
    next()
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      s: 0,
      m: "Authentication failed",
      errorCode: "UNAUTHORIZED",
      data: null,
    });
  }
}