import axios from "axios";

interface EmailValidationResponseType {
  email: string;
  user: string;
  tag: string;
  domain: string;
  smtp_check: boolean;
  mx_found: boolean;
  did_you_mean: string;
  role: boolean;
  disposable: boolean;
  score: number;
  state: "deliverable" | "undeliverable";
  reason: "valid_mailbox" | "invalid_mailbox";
  free: boolean;
  format_valid: boolean;
  catch_all: any;
}

const emailVerification = async (email: string): Promise<boolean> => {
  try {
    const resp = await axios.get<EmailValidationResponseType>(
      `https://api.emailvalidation.io/v1/info?apikey=${process.env.EMAIL_VALIDATION_API_KEY}&email=${email}`
    );

    console.log("Email verification results: ", resp);

    return resp.data.state === "deliverable";
  } catch (error) {
    console.error("Error verifying email: ", error);
    return false;
  }
};

export default emailVerification;
