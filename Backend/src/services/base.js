import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { services } from "./services.js";
export class base extends services {
  constructor() {
    super();
  }
  sucessResponse = (res, m, data) => {
    return res.status(200).json({
      s: 1,
      m: m,
      data: data,
    });
  }
  hashedPassword = async (password) => {
    return await bcrypt.hashSync(password, 10);
  }
  verifiyPassword = async (password, hashedPassword) => {
    return await bcrypt.compareSync(password, hashedPassword);
  }
  ganerateAccessToken = async (userId, email) => {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
  };
  generateRefreshToken = (userId) => {
    return jwt.sign({ userId, type: "refresh" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
  verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  };
  errorResponse = (res, m) => {
    return res.status(400).json({ s: 0, m: m, data: null });
  };
}

