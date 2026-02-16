import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Bookmark manager with Google sign-in and real-time sync",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
