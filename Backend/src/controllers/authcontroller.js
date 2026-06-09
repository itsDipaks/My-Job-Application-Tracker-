import db from "../config/db.js";
import { base } from "../services/base.js";
class authController extends base {
  constructor() {
    super()
  }
  login = async (req, res) => {
    let reqdata = req.body;
    if (!reqdata?.email) return this.validationError(res, "Email is required");
    if (!reqdata?.password)
      return this.validationError(res, "Password is required");
    try {
      let datares = await db.query("select * from users where email=?", [
        reqdata?.email,
      ]);
      if (!datares[0]?.length > 0)
        return res
          .status(404)
          .json({ s: 0, m: "User not exist! !", data: null });
      let user = datares[0][0];
      if (
        user?.is_verifide == 1 &&
        (user?.google_id !== null) & (user?.password == null)
      )
        return res
          .status(400)
          .json({
            s: 0,
            m: "The Email is associate with the google login you want to set the password ?",
          })
      let ispasswordvalid = await this.verifiyPassword(
        reqdata?.password,
        user?.password_hash,
      );
      if (!ispasswordvalid)
        return res
          .status(400)
          .json({ s: 0, m: "Invalid crdentials.", data: null });
      if (user?.is_verifide == 0) {
        let Newotp = this.GanerateEmailOtp();
        let sendotpagain = await this.sendOTPEmail(reqdata?.email, Newotp);
        if (sendotpagain?.response !== null) {
          let otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
          await db.query(
            "UPDATE users SET otp=?,otp_expires_at=?,updated_at=Now() WHERE email=?",
            [Newotp, otpExpiresAt, user?.email],
          );
          return res.status(200).json({
            res,
            m: `Email not verified, Otp Sent to ${reqdata?.email}`,
          });
        } else {
          return res.status(401).json({
            res,
            m: `Otp Not setted `,
          });
        }
      }
      let dataresponse = {
        ...user,
      }
      return this.sucessResponse(res, "Login successful", dataresponse);
    } catch (err) {
      console.log(err, "error ");
    }
  };
  signup = async (req, res) => {
    let reqdata = req.body;
    if (!reqdata?.email) return this.validationError(res, "Email is required");
    if (!reqdata?.password)
      return this.validationError(res, "Password is required !");
    if (!reqdata.name) return this.validationError(res, "Name is required !");
    try {
      let response = await db.query("select * from users where email=?", [
        reqdata?.email,
      ])

      if (response[0].length > 0)
        return this.errorResponse(
          res,
          "An account with this email already exists",
          "GOOGLE_ASSOCIATE_ACCOUNT"
        );
      let newpassword = await this.hashedPassword(reqdata?.password);

      let ganaratedOtp = this.GanerateEmailOtp();
      let otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      console.log("befor calling insert user");

      let [result, err] = await db.query(
        "INSERT INTO users ( name, email, password) VALUES (?, ?, ?)",
        [
          reqdata?.name,
          reqdata?.email,
          newpassword,
        ]);
      if (err) {
        return this.serverError(res, "Failed to create account. Please try again.");
      }
      const userId = result.insertId
      let Authres = await db.query(
        "INSERT INTO user_auth ( user_id, otp, otp_expires_at) VALUES (?, ?, ?)",
        [
          userId,
          ganaratedOtp,
          otpExpiresAt,
        ])
      if (err) {
        return this.serverError(res, "Failed to set OTP. Please try again.");
      }
      let sendEmail = await this.sendOTPEmail(reqdata?.email, ganaratedOtp);
      if (!sendEmail?.accepted) {
        return this.serverError(
          res,
          "Account created but failed to send verification email. Please request a new OTP.",
        )
      }
      return this.successResponse(
        res,
        "Account Created, Email verification pending!",
        {
          name: reqdata?.name,
          email: reqdata?.email,
          is_verified: 0,
          requiresVerification: true,
        },
        201,
      )
    } catch (err) {
      console.log(err, "error from the server");
    }
  }
  verifiy_email = async (req, res) => {
    let reqBody = req.body;
    try {
      let isexist = await db.query("select * from users WHERE email=?", [
        reqBody?.email,
      ]);
      if (isexist[0].length < 0)
        return res.status(404).json({ s: 0, m: "User not exist!", data: null });
      let usersdata = isexist[0][0];
      let otpStoredExpiry = new Date(usersdata?.otp_expires_at)
      let currentTime = new Date();
      try {
        let userRes = await db.query("SELECT * FROM users WHERE email=?", [
          reqBody?.email,
        ]);
        if (!userRes[0]?.length) {
          return res.status(404).json({ s: 0, m: "User not exist!", data: null });
        }
        let user = userRes[0][0];
        let authRes = await db.query(
          "SELECT * FROM user_auth WHERE user_id=? ORDER BY created_at DESC, id DESC LIMIT 1",
          [user.id],
        );
        if (!authRes[0]?.length) {
          return res.status(404).json({ s: 0, m: "OTP record not found", data: null });
        }
        let authRow = authRes[0][0];
        let otpStoredExpiry = new Date(authRow?.otp_expires_at);
        let currentTime = new Date();
        if (currentTime > otpStoredExpiry) {
          await db.query(
            "UPDATE user_auth SET otp=null, otp_expires_at=null WHERE id=?",
            [authRow.id],
          );
          return res.status(403).json({ s: 0, m: "Otp expired", data: null });
        }


        // 4) verify otp
        if (reqBody?.otp == authRow?.otp) {
          let AccessToken = await this.ganerateAccessToken(user.email);
          let RefreshToken = await this.generateRefreshToken(authRow.user_id);

          console.log(RefreshToken, " RefreshToken");
          console.log(AccessToken, "AccessToken ");
          await db.query(
            "UPDATE users SET is_verifide=1 WHERE id=?",
            [AccessToken, RefreshToken, authRow.user_id],
          );
          await db.query(
            "UPDATE user_auth SET otp=null, otp_expires_at=null ,access_token=?, refresh_token=? WHERE user_id=?",
            [AccessToken, RefreshToken, authRow.user_id],
          );

          let safeData = {
            id: user.id,
            name: user.name,
            email: user.email,
            is_verified: 1,
            access_token: AccessToken,
            refresh_token: RefreshToken,
          };
          return res.status(200).json({ s: 1, m: "Otp Verified Successfully!", data: safeData });
        } else {
          await db.query(
            "UPDATE user_auth SET otp=null, otp_expires_at=null WHERE user_id=?",
            [authRow.user_id],
          );
          return this.errorResponse(res, "Invalid Otp!", "INVALID_OTP", 400);
        }
      } catch (err) {
        console.log(err, "ERROR From api");
        return this.serverError(res);
      }

      let userdata = data[0][0];
      let authRes = await db.query("select * from user_auth where user_id=? ", [userdata.id]);
      if (userdata?.is_verified == 1) {
        return this.errorResponse(
          res,
          "Email is already verified",
          "ALREADY_VERIFIED",
          400,
        )
      }

      // let ganerateNewotp = this.GanerateEmailOtp()

      // let otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      // await db.query("UPDATE users SET otp=?,otp_expires_at=? WHERE email=?", [
      //   ganerateNewotp,
      //   otpExpiresAt,
      //   userdata?.email,
      // ]);
      // let sendEmail = await this.sendOTPEmail(reqData?.email, ganerateNewotp);
      // if (!sendEmail?.accepted) {
      //   return this.serverError(res, "Please requeslst a new OTP.");
      // }
      // return this.successResponse(res, "Otp sent successfully", {
      //   email: userdata?.email,
      //   expiresIn: "10 minutes",
      // });
    } catch (err) {
      console.error("Resend OTP error:", err);
      return this.serverError(res);
    }
  }
  resend_reset_password_otp = async (req, res) => {
    let reqData = req.body;
    if (!reqData?.email) {
      return this.validationError(res, "Email is required");
    }
    try {
      let data = await db.query("SELECT * FROM users WHERE email=?", [
        reqData?.email,
      ]);
      if (!data[0]?.length) {
        return this.successResponse(
          res,
          "If this email exists, a password reset OTP has been sent.",
          null,
        );
      }
      let userdata = data[0][0];
      if (!userdata?.password_hash && userdata?.google_id) {
        return this.errorResponse(
          res,
          "This account was created with Google. Use 'Set Password' instead.",
          "NO_PASSWORD_SET",
          400,
        );
      }
      let resetOtp = this.GanerateEmailOtp();
      let otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await db.query(
        "UPDATE users SET otp=?, otp_expires_at=?, updated_at=NOW() WHERE email=?",
        [resetOtp, otpExpiresAt, userdata?.email],
      );
      let sendEmail = await this.sendPasswordResetOTP(
        userdata?.email,
        resetOtp,
      );
      if (!sendEmail?.accepted) {
        return this.serverError(res, "Failed to send OTP. Please try again.");
      }
      return this.successResponse(
        res,
        "Password reset OTP sent successfully!",
        {
          email: userdata?.email,
          expiresIn: "10 minutes",
        },
      );
    } catch (err) {
      console.error("Resend password reset OTP error:", err);
      return this.serverError(res);
    }
  }
  set_password = async () => {
    let reqData = req.body;
    try {
      let userdata = await db.query("select * from users where google_id=?", [
        reqData?.google_id,
      ]);
      if (!googletoken[0]?.length)
        return this.notFoundError(res, "User Not found.");
      let User = userdata[0][0];
      let hashedPassword = await this.hashedPassword(reqData?.password);
      await db.query("UPDATE users SET password_hash=? WHERE google_id=?", [
        hashedPassword,
        reqData?.google_id,
      ]);
      return this.successResponse(res, "Password linking sucessfully.");
    } catch (err) {
      console.error("Resend OTP error:", err);
      return this.serverError(res);
    }
  }
  social_login = async (req, res) => {
    let reqData = req.body;
    try {
      const googleUser = {
        email: req.body.email,
        name: req.body.name,
        google_id: req.body.google_id,
      };

      if (!googleUser.email || !googleUser.google_id) {
        return this.validationError(res, "Invalid Google authentication data");
      }

      let isexist = await db.query("select * from users where email=?", [
        reqData?.email,
      ]);

      // USER EXISTS - Login flow
      if (isexist[0]?.length > 0) {
        let existingUser = isexist[0][0];

        // Generate tokens for existing user
        let AccessToken = await this.ganerateAccessToken(
          existingUser?.id,
          existingUser?.email,
        );
        let RefreshToken = this.generateRefreshToken(existingUser?.id);

        // Update user with google_id if not already set
        await db.query(
          "UPDATE users SET google_id=?, is_verifide=1, name=?, access_token=?, refresh_token=?, updated_at=NOW() WHERE email=?",
          [
            googleUser.google_id,
            googleUser.name,
            AccessToken,
            RefreshToken,
            googleUser.email,
          ],
        );

        return this.successResponse(res, "Sign in successfully!", {
          name: googleUser.name,
          email: googleUser.email,
          is_verified: 1,
          access_token: AccessToken,
          refresh_token: RefreshToken,
          account_linked: true,
        });
      }
      // USER DOESN'T EXIST
      else {
        // Generate tokens for new user (we'll get the ID after insert)
        let tempToken = await this.ganerateAccessToken(
          googleUser.google_id,
          googleUser.email,
        );
        let tempRefreshToken = this.generateRefreshToken(googleUser.google_id);

        // Create new user with Google authentication
        await db.query(
          "INSERT INTO users (name, email, google_id, is_verifide, access_token, refresh_token, created_at) VALUES (?, ?, ?, 1, ?, ?, NOW())",
          [
            googleUser.name,
            googleUser.email,
            googleUser.google_id,
            tempToken,
            tempRefreshToken,
          ],
        );

        return this.successResponse(
          res,
          "Account created and signed in successfully!",
          {
            name: googleUser.name,
            email: googleUser.email,
            is_verified: 1,
            access_token: tempToken,
            refresh_token: tempRefreshToken,
            new_account: true,
          },
          201,
        );
      }
    } catch (err) {
      console.error("Social login error:", err);
      return this.serverError(res, "Server error during social login");
    }
  }
}
const authcontroller = new authController();
export default authcontroller;


