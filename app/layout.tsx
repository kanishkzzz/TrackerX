import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskNest — Make space for what matters",
  description:
    "Gather your to-dos, choose what matters first, and move through your day one good step at a time with TaskNest.",
  icons: {
    icon: "/iconicicon.jpg",
    shortcut: "/iconicicon.jpg",
    apple: "/iconicicon.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
