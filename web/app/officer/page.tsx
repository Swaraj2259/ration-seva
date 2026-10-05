"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ServiceRequest, REQUEST_TYPES } from "@/lib/types";

export default function OfficerDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("OPEN");

  const loadQueue = () => {
    setLoading(true);
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Sort oldest first (FIFO statutory queue requirement)
          const sorted = [...data.data].sort(
            (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          );
          setRequests(sorted);
        }
      })
      .catch((err) => console.error("Error loading queue:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const openRequests = requests.filter(
    (r) => !["Approved", "Rejected", "Card Issued", "Closed"].includes(r.status)
  );
  const breachedCount = openRequests.filter((r) => r.slaBreached).length;
  const approvedCount = requests.filter((r) => ["Approved", "Card Issued"].includes(r.status)).length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  const filtered = requests.filter((r) => {
    if (filterType !== "ALL" && r.type !== filterType) return false;
    if (filterStatus === "OPEN") {
      return !["Approved", "Rejected", "Card Issued", "Closed"].includes(r.status);
    }
    if (filterStatus === "BREACHED") return r.slaBreached;
    if (filterStatus === "CLOSED") {
      return ["Approved", "Rejected", "Card Issued", "Closed"].includes(r.status);
    }
    return true;
  });

  const getTypeName = (type: string) => {
    return REQUEST_TYPES.find((t) => t.id === type)?.name || type;
  };

  const calculateAge = (dateStr: string) => {
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      {/* Officer Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Officer Console</span>
          <h1 style={{ margin: "4px 0" }}>Statutory Adjudication Work Queue</h1>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            Supply Inspector Desk · Haveli Circle · District Supply Office
          </p>
        </div>

        <button onClick={loadQueue} className="btn btn-outline btn-sm">
          🔄 Refresh Live Queue
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: "28px" }}>
        <div className="panel" style={{ borderLeft: "4px solid var(--primary)" }}>
          <span className="form-help">Pending Adjudication</span>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-mono)", fontWeight: 700, margin: "4px 0" }}>
            {openRequests.length}
          </div>
          <span className="badge badge-default">FIFO Oldest-First</span>
        </div>

        <div className="panel" style={{ borderLeft: "4px solid var(--destructive)" }}>
          <span className="form-help">SLA Breached (&gt;15 Days)</span>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--destructive)", margin: "4px 0" }}>
            {breachedCount}
          </div>
          <span className="badge badge-danger">Immediate Priority</span>
        </div>

        <div className="panel" style={{ borderLeft: "4px solid #235928" }}>
          <span className="form-help">Approved Applications</span>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#235928", margin: "4px 0" }}>
            {approvedCount}
          </div>
          <span className="badge badge-success">Disposed Successfully</span>
        </div>

        <div className="panel" style={{ borderLeft: "4px solid var(--ring)" }}>
          <span className="form-help">Rejected / Returned</span>
          <div style={{ fontSize: "2rem", fontFamily: "var(--font-mono)", fontWeight: 700, margin: "4px 0" }}>
            {rejectedCount}
          </div>
          <span className="badge badge-warning">Remarks Mandated</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="panel" style={{ padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="form-help">Filter Queue:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
            style={{ width: "auto", padding: "6px 12px", fontSize: "0.85rem" }}
          >
            <option value="OPEN">Pending Adjudication ({openRequests.length})</option>
            <option value="BREACHED">SLA Breached Only ({breachedCount})</option>
            <option value="ALL">All Dossiers ({requests.length})</option>
            <option value="CLOSED">Disposed / Closed</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="form-help">Service Stream:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select"
            style={{ width: "auto", padding: "6px 12px", fontSize: "0.85rem" }}
          >
            <option value="ALL">All 5 Service Streams</option>
            {REQUEST_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="panel" style={{ padding: "0", overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "var(--muted-foreground)" }}>
            Fetching officer adjudication queue...
          </p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎉</div>
            <h3>Queue Clean</h3>
            <p style={{ color: "var(--muted-foreground)" }}>
              No applications match the current filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-container" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Priority / Age</th>
                  <th>Request ID</th>
                  <th>Service Stream</th>
                  <th>Applicant Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => {
                  const age = calculateAge(req.submittedAt);
                  return (
                    <tr
                      key={req.id}
                      style={{
                        background: req.slaBreached ? "rgba(181, 74, 53, 0.05)" : undefined,
                      }}
                    >
                      <td>
                        {req.slaBreached ? (
                          <span className="badge badge-danger">
                            ⚠ {age} Days (BREACH)
                          </span>
                        ) : (
                          <span className="badge badge-default">
                            {age} Day(s) old
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
                          {req.id}
                        </strong>
                      </td>
                      <td>
                        <strong>{getTypeName(req.type)}</strong>
                      </td>
                      <td>
                        <div>{req.applicantName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                          +91 {req.mobile}
                        </div>
                      </td>
                      <td>
                        <span className={req.category.startsWith("PHH") ? "badge badge-success" : "badge badge-warning"}>
                          {req.category}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-default">{req.status}</span>
                      </td>
                      <td>
                        <Link href={`/officer/${req.id}`} className="btn btn-primary btn-sm">
                          Review &amp; Decide &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
