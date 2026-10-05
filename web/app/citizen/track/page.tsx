"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ServiceRequest, REQUEST_TYPES } from "@/lib/types";

const LIFECYCLE_STAGES = [
  "Submitted",
  "Under Verification",
  "Pending Approval",
  "Approved",
  "Card Issued",
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDossier = (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setError("");
    setLoading(true);

    fetch(`/api/requests/${idToSearch.trim()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error || "Dossier not found.");
        setRequest(data.data);
      })
      .catch((err) => {
        setError(err.message);
        setRequest(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      fetchDossier(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDossier(searchId);
  };

  const getTypeName = (type: string) => {
    return REQUEST_TYPES.find((t) => t.id === type)?.name || type;
  };

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

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1>Public Status Tracking &amp; Audit Trail</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Track the live administrative progression of your ration card service request in compliance with the Right to Public Services Act (RTS).
        </p>
      </div>

      {/* Search Input Panel */}
      <div className="panel" style={{ padding: "24px", marginBottom: "28px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            placeholder="Enter Request ID (e.g., RS-2026-000101)"
            className="form-input"
            style={{ flex: 1, minWidth: "260px", fontFamily: "var(--font-mono)" }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Searching..." : "Track Application →"}
          </button>
        </form>

        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span className="form-help">Quick Samples:</span>
          {["RS-2026-000101", "RS-2026-000102", "RS-2026-000103", "RS-2026-000105"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSearchId(id);
                fetchDossier(id);
              }}
              className="btn btn-outline btn-sm"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", padding: "2px 8px" }}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="badge badge-danger" style={{ display: "block", padding: "14px", marginBottom: "24px", fontSize: "0.9rem" }}>
          ⚠ {error}
        </div>
      )}

      {/* Request Details View */}
      {request && (
        <div style={{ animation: "slideIn 0.3s ease" }}>
          <div className="panel" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
              <div>
                <span className="badge badge-default" style={{ marginBottom: "4px" }}>
                  {getTypeName(request.type)}
                </span>
                <h2 style={{ margin: "4px 0", fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
                  {request.id}
                </h2>
                <div style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
                  Applicant: <strong>{request.applicantName}</strong> · Mobile: +91 {request.mobile}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: "6px" }}>{getStatusBadge(request.status)}</div>
                <span className="form-help">
                  Rule Version: <strong>{request.ruleVersion}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3" style={{ marginTop: "18px" }}>
              <div>
                <span className="form-help">Ration Card Reference</span>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{request.rationCardNo}</div>
              </div>
              <div>
                <span className="form-help">Household Category</span>
                <div>
                  <span className={request.category.startsWith("PHH") ? "badge badge-success" : "badge badge-warning"}>
                    {request.category}
                  </span>
                </div>
              </div>
              <div>
                <span className="form-help">SLA Compliance Window</span>
                <div>
                  {request.slaBreached ? (
                    <span className="badge badge-danger">⚠ SLA Breached (&gt;15 Days)</span>
                  ) : (
                    <span className="badge badge-success">✔ Within Statutory 15d SLA</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Statutory Administrative Timeline</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.88rem", marginBottom: "24px" }}>
              Immutable chronological record of decisions and file movements logged under IEEE 830 auditability standards.
            </p>

            <ul className="timeline-list">
              {request.history.map((item, idx) => {
                const isLatest = idx === request.history.length - 1;
                return (
                  <li
                    key={idx}
                    className={`timeline-item ${isLatest ? "active" : "completed"}`}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                      <strong style={{ fontSize: "1rem", color: isLatest ? "var(--primary)" : "var(--foreground)" }}>
                        {item.status}
                      </strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                        {new Date(item.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "4px 0" }}>
                      Action by: <strong>{item.actor}</strong> ({item.actorRole})
                    </div>

                    {item.remarks && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "10px 14px",
                          background: "var(--muted)",
                          borderLeft: "3px solid var(--primary)",
                          borderRadius: "var(--radius)",
                          fontSize: "0.88rem",
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{item.remarks}&rdquo;
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="panel">Loading tracking console...</div>}>
      <TrackContent />
    </Suspense>
  );
}
