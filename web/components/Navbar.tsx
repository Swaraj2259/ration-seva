"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("citizen");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem("rs_role") || "citizen";
    setRole(savedRole);

    const savedTheme = localStorage.getItem("rs_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("rs_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("rs_theme", "light");
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("rs_role", newRole);
    if (newRole === "officer") router.push("/officer");
    else if (newRole === "admin") router.push("/admin/rules");
    else router.push("/citizen");
  };

  if (!mounted) {
    return (
      <header className="site-header">
        <div className="gov-ribbon" />
        <div className="site-header-inner">
          <div className="brand-wrapper">
            <div className="brand-emblem">🌾</div>
            <div className="brand-text">
              <h1>RationSeva</h1>
              <span>District Supply Office</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="gov-ribbon" />
      <div className="site-header-inner">
        <Link href="/" className="brand-wrapper">
          <div className="brand-emblem">🌾</div>
          <div className="brand-text">
            <h1>RationSeva</h1>
            <span>District Supply Office · e-PDS</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Overview
          </Link>
          <Link href="/citizen/track" className={`nav-link ${pathname.startsWith("/citizen/track") ? "active" : ""}`}>
            Track Status
          </Link>

          {role === "citizen" && (
            <>
              <Link href="/citizen" className={`nav-link ${pathname === "/citizen" ? "active" : ""}`}>
                My Applications
              </Link>
              <Link href="/citizen/apply" className={`nav-link ${pathname.startsWith("/citizen/apply") ? "active" : ""}`}>
                Apply Online
              </Link>
            </>
          )}

          {role === "officer" && (
            <Link href="/officer" className={`nav-link ${pathname.startsWith("/officer") ? "active" : ""}`}>
              Officer Queue
            </Link>
          )}

          {role === "admin" && (
            <Link href="/admin/rules" className={`nav-link ${pathname.startsWith("/admin") ? "active" : ""}`}>
              Rule Engine
            </Link>
          )}

          <Link href="/docs" className={`nav-link ${pathname === "/docs" ? "active" : ""}`}>
            Project Docs
          </Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Role selector dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Role:</span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="form-select"
              style={{
                padding: "4px 8px",
                fontSize: "0.82rem",
                width: "auto",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
              }}
            >
              <option value="citizen">Citizen (Beneficiary)</option>
              <option value="officer">Supply Officer</option>
              <option value="admin">Policy Admin</option>
            </select>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            title="Toggle theme"
            style={{ padding: "4px 8px", minWidth: "36px" }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Quick Login button if citizen needs auth */}
          <Link href="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
