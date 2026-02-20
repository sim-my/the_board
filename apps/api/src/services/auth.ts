import { Resend } from "resend";
import { generateOTP } from "../utils";

const resend = new Resend("re_LsDDN7y6_HRBXYCZjmFUqMCes4BMXrRf2");

export const sendEmailToUser = async (email: string, message?: string) => {
  const otp = generateOTP();

  const { data } = await resend.emails.send({
    from: "Emmanuel from TheBoard <hello@jointheboard.space>",
    to: email,
    replyTo: "send@jointheboard.space",
    template: {
      id: "identity-verification-otp",
      variables: {
        OTP: otp,
      },
    },
  });

  console.log("Email response => ", data);

  console.log(`Emaill ${email} with customer HTML content has been sent.`);
  return data;
};
