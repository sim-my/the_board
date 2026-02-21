// For authenticating users!

import { Request, Response, NextFunction } from "express";
import { sendEmailToUser } from "../services/auth";
import { generateJWT, generateOTP } from "../utils";
import { db } from "../db/connection";
import { eq, and } from "drizzle-orm";
import { oneTimePassword, user } from "../db/schema";
import { addMinutes, format } from "date-fns";

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

  const otp = generateOTP();

  const data = await sendEmailToUser(email, otp);

  //   Save OTP in DB...

  // Get the current time
  const now = new Date();

  // Define the number of minutes to add
  const minutesToAdd = 3;

  // Add minutes to the current time
  const futureTime = addMinutes(now, minutesToAdd);
  // Get the current time

  const createdOtp = await db
    .insert(oneTimePassword)
    .values({ email, code: otp, expiresAt: futureTime.toISOString() })
    .returning();

  return res.json({
    error: false,
    message: "OTP Email sent successfully !",
    data,
  });
}

export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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

  const { otp, email } = req.body;

  if (!otp) {
    return res.json({ error: true, message: "OTP does not exist!" });
  }

  if (!email) {
    return res.json({ error: true, message: "Email is required!" });
  }

  //   find existing otp
  const currentOtp = await db
    .selectDistinct()
    .from(oneTimePassword)
    .where(and(eq(oneTimePassword.email, email), eq(oneTimePassword.code, otp)))
    .limit(1);

  if (!currentOtp[0]) {
    return res.json({ error: true, message: "OTP does not match!" });
  } else {
    let isNewUser = false;
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    //   Generate and send OTP
    const token = await generateJWT({
      username: email,
      role: "user",
    });

    if (currentUser.length == 0) {
      // This user does not exist, create them
      const createdUser = await db.insert(user).values({ email }).returning();
      isNewUser = true;

    //   return res.cookie("access_token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //   });

      return res.json({ error: false, token, isNewUser, createdUser });
    }

    return res.json({ error: false, token, isNewUser });
  }
}

export function deleteUserAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Your code here boss :)
  return res.json({ message: "Works!" });
}
