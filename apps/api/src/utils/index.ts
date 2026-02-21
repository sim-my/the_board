import { SignJWT } from "jose";

// Function to generate OTP
export function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP;
}

export async function generateJWT(userObject: {
  username: string;
  role: string;
}) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT(userObject)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);

  return token;
}
