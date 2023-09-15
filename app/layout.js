import "./globals.css";

export const metadata = {
  title: "NHL 95",
  description: "League website for the NHL 95",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
