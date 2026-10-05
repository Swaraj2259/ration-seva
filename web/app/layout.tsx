import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RationSeva – District Supply Office Services Portal",
  description: "Official online services portal for ration card issuance, member updates, address modifications, and status tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
        <footer className="site-footer">
          <div className="footer-links">
            <a href="/">Overview</a>
            <a href="/citizen/track">Track Application</a>
            <a href="/citizen/apply">Apply for Services</a>
            <a href="/officer">Officer Queue</a>
            <a href="/admin/rules">Rule Engine</a>
            <a href="/docs">Project Documents</a>
          </div>
          <p style={{ margin: "6px 0" }}>
            District Supply Office · Food, Civil Supplies & Consumer Protection Department · Government of Maharashtra
          </p>
          <p style={{ fontSize: "0.8rem", margin: 0, opacity: 0.85 }}>
            Enterprise Public Distribution System (e-PDS) · High-Availability Microservices Architecture
          </p>
        </footer>
      </body>
    </html>
  );
}
