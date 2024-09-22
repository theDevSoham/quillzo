import type { Metadata } from "next";
import "./globals.css";
import RecoilContextProvider from "@/lib/RecoilContextProvider";
import SessionWrapper from "@/lib/SessionWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { playpenSans } from "../fonts/fonts";
import NavBar from "@/components/custom/NavBar";

export const metadata: Metadata = {
  title: "Quillzo",
  description: "The next gen blog app leveraging web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playpenSans.className} antialiased container mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          <SessionWrapper>
            <RecoilContextProvider>
              <NavBar />
              {children}
            </RecoilContextProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
