// For authenticating users!

import { Request, Response, NextFunction } from "express";
import { sendEmailToUser } from "../services/auth";

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  // Your code here boss :)
  const { email } = req.body;

  /**
   *
   *   Send email to user.
   *
   *   Create OTP record.
   *
   * When verifying, check if user exists. If not, create new account.
   *
   *
   * */

  //   Check if User already exists.
  // If so, send them the OTP and do nothing else
  // If not, create an account for them and then send

  const data = await sendEmailToUser(email);

  return res.json({ message: "OTP Email sent successfully !", data });
}

export function verifyOtp(req: Request, res: Response, next: NextFunction) {
  /**
   * Get OTP
   * 
   * If OTP is accurate, authenticate user.
   * 
   * If OTP is not accurate, then send error email back
   * 
   * If user is first time user, create account for them
   * 
   * If they are an existing user, then do nothing
   */

  return res.json({ message: "Works!" });
}

export function deleteUserAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Your code here boss :)
  return res.json({ message: "Works!" });
}
