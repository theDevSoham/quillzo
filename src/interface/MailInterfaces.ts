interface BaseMailOptions {
  email: string;
  subject: string;
}

interface MessageMailOptions extends BaseMailOptions {
  message: string;
  html?: never; // Ensure `html` is not used when `message` is present
}

interface HtmlMailOptions extends BaseMailOptions {
  html: string;
  message?: never; // Ensure `message` is not used when `html` is present
}

export type MailOptions = MessageMailOptions | HtmlMailOptions;
