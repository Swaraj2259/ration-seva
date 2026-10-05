"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ServiceRequest, REQUEST_TYPES } from "@/lib/types";

export default function CitizenDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState("9876543210");

  useEffect(() => {
    const savedMobile = localStorage.getItem("rs_mobile") || "9876543210";
    setMobile(savedMobile);

    fetch(`/api/requests?role=citizen&mobile=${savedMobile}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRequests(data.data);
      })
      .catch((err) => console.error("Error fetching requests:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
      case "Card Issued":
        return <span className="badge badge-success">✔ {status}</span>;
      case "Rejected":
        return <span className="badge badge-danger">✖ {status}</span>;
      case "Clarification Required":
        return <span className="badge badge-warning">⚠ {status}</span>;
      default:
        return <span className="badge badge-primary">⏳ {status}</span>;
    }
  };

  const getTypeName = (type: string) => {
    return REQUEST_TYPES.find((t) => t.id === type)?.name || type;
  };

  return (
    <div>
      {/* Citizen Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Citizen Beneficiary Portal</span>
          <h1 style={{ margin: "4px 0" }}>Household Ration Dossier</h1>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            Beneficiary: <strong>Sunita Ramesh Patil</strong> · Card No: <strong>MH-PN-1023</strong> · Category: <strong>PHH (Priority)</strong>
          </p>
        </div>

        <Link href="/citizen/apply" className="btn btn-primary btn-lg">
          + New Service Request
        </Link>
      </div>

      {/* Household Overview Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: "32px" }}>
        <div className="panel">
          <span className="form-help">Current Card Status</span>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, margin: "6px 0", color: "#235928" }}>
            Active (PHH)
          </div>
          <span className="form-help">Monthly Quota: 25 kg Foodgrains</span>
        </div>

        <div className="panel">
          <span className="form-help">Registered Members</span>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, margin: "6px 0", fontFamily: "var(--font-mono)" }}>
            4 / 15 Max
          </div>
          <span className="form-help">Head: Sunita Patil</span>
        </div>

        <div className="panel">
          <span className="form-help">Allocated Fair Price Shop</span>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, margin: "6px 0" }}>
            FPS Shop No. 142
          </div>
          <span className="form-help">Haveli Circle, District Pune</span>
        </div>

        <div className="panel">
          <span className="form-help">Active Applications</span>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, margin: "6px 0", fontFamily: "var(--font-mono)" }}>
            {requests.length} Total
          </div>
          <span className="form-help">Tracked digitally via SMS</span>
        </div>
      </div>

      {/* Requests Table */}
      <div className="panel" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Service Requests History</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
            Real-time status synced with District Supply Office
          </span>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "var(--muted-foreground)" }}>
            Loading your service requests...
          </p>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📂</div>
            <h3>No Service Requests Found</h3>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "420px", margin: "0 auto 20px" }}>
              You have not submitted any service requests yet. Click below to submit an application.
            </p>
            <Link href="/citizen/apply" className="btn btn-primary">
              Submit Your First Request →
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Service Stream</th>
                  <th>Submitted Date</th>
                  <th>Rule Version</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
                        {req.id}
                      </strong>
                    </td>
                    <td>
                      <strong>{getTypeName(req.type)}</strong>
                    </td>
                    <td>
                      {new Date(req.submittedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span className="badge badge-default">{req.ruleVersion}</span>
                    </td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td>
                      <Link href={`/citizen/track?id=${req.id}`} className="btn btn-outline btn-sm">
                        Track Dossier →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
