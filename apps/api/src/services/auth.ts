import { Resend } from "resend";
import { generateOTP } from "../utils";

if (!process.env.RESEND_KEY) {
	throw new Error("RESEND_KEY is required!")
}

const resend = new Resend(process.env.RESEND_KEY);

export const sendEmailToUser = async (email: string, message?: string) => {


  const { data } = await resend.emails.send({
    from: "Emmanuel from TheBoard <hello@jointheboard.space>",
    to: email,
    replyTo: "send@jointheboard.space",
    template: {
      id: "identity-verification-otp",
      variables: {
        OTP: message!,
      },
    },
  });

  console.log("Email response => ", data);

  console.log(`Emaill ${email} with customer HTML content has been sent.`);
  return data;
};
