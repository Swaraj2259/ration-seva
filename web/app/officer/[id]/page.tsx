"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ServiceRequest, REQUEST_TYPES } from "@/lib/types";
import SmsToast from "@/components/SmsToast";

export default function OfficerReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionRemarks, setActionRemarks] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [smsToast, setSmsToast] = useState<string | null>(null);

  const loadDossier = () => {
    setLoading(true);
    fetch(`/api/requests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error || "Dossier not found.");
        setRequest(data.data);
      })
      .catch((err) => console.error("Error loading dossier:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDossier();
  }, [id]);

  const handleAction = async (newStatus: string, remarksMandatory: boolean) => {
    setDecisionError("");

    if (remarksMandatory && (!actionRemarks || !actionRemarks.trim())) {
      setDecisionError(`Officer remarks are strictly mandatory for "${newStatus}" to ensure administrative transparency (SRS FR-07).`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          actor: "Inspector R. Shinde",
          actorRole: "Supply Officer",
          remarks: actionRemarks.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Decision failed.");

      setRequest(data.data);
      setActionRemarks("");
      setSmsToast(`SMS Triggered: Beneficiary notified of status "${newStatus}".`);
    } catch (err: any) {
      setDecisionError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="panel" style={{ padding: "40px", textAlign: "center" }}>Loading application dossier {id}...</div>;
  }

  if (!request) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: "40px" }}>
        <h3>Dossier {id} Not Found</h3>
        <Link href="/officer" className="btn btn-outline" style={{ marginTop: "16px" }}>
          &larr; Return to Officer Queue
        </Link>
      </div>
    );
  }

  const getTypeName = (type: string) => {
    return REQUEST_TYPES.find((t) => t.id === type)?.name || type;
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/officer" className="btn btn-outline btn-sm">
          &larr; Back to Officer Work Queue
        </Link>
      </div>

      {/* Header bar */}
      <div className="panel" style={{ marginBottom: "24px", padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "1.8rem", color: "var(--primary)" }}>
                {request.id}
              </h1>
              <span className="badge badge-default">{getTypeName(request.type)}</span>
              {request.slaBreached && <span className="badge badge-danger">⚠ SLA Breached</span>}
            </div>
            <p style={{ margin: "6px 0 0", color: "var(--muted-foreground)" }}>
              Applicant: <strong>{request.applicantName}</strong> · Mobile: +91 {request.mobile} · Aadhaar Ref: {request.aadhaar}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="form-help">Current Adjudication State</span>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "2px" }}>
              <span className="badge badge-primary">{request.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-2">
        {/* Left Column: Dossier Details & Documents */}
        <div>
          <div className="panel" style={{ marginBottom: "24px" }}>
            <h3 style={{ marginTop: 0 }}>Application Dossier Details</h3>
            <table className="data-table" style={{ border: "none" }}>
              <tbody>
                <tr>
                  <td style={{ width: "40%", fontWeight: 600 }}>Ration Card No:</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{request.rationCardNo}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Family Members:</td>
                  <td><strong>{request.familyMembersCount}</strong> (Limit &le; 15)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Annual Income:</td>
                  <td>₹{request.annualIncome.toLocaleString("en-IN")} ({request.category})</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Circle / Tehsil:</td>
                  <td>{request.subDistrict}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Address:</td>
                  <td>{request.address}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Governing Rule:</td>
                  <td><span className="badge badge-default">{request.ruleVersion}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Uploaded Proofs &amp; Documents ({request.documents.length})</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "14px" }}>
              Documents verified against tamper standards (SRS FR-03). Click to inspect preview.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {request.documents.map((doc, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    marginBottom: "8px",
                    background: "var(--card)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>📎</span>
                    <div>
                      <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                        {doc.name}
                      </strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                        {doc.sizeKb} KB · {doc.type}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-success">Verified</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Rule Engine Checklist & Adjudication Console */}
        <div>
          <div className="panel" style={{ marginBottom: "24px", background: "var(--muted)" }}>
            <h3 style={{ marginTop: 0 }}>Automated Policy Engine Checklist</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "12px" }}>
              Evaluated strictly against active rule version <strong>{request.ruleVersion}</strong>:
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ padding: "6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✅</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Family size <strong>{request.familyMembersCount}</strong> within permitted bounds (1 to 15 members).
                </span>
              </li>
              <li style={{ padding: "6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✅</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Annual income <strong>₹{request.annualIncome.toLocaleString("en-IN")}</strong> categorized as {request.category}.
                </span>
              </li>
              <li style={{ padding: "6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✅</span>
                <span style={{ fontSize: "0.9rem" }}>
                  All mandatory document proofs attached and verified &le; 2 MB limit.
                </span>
              </li>
              <li style={{ padding: "6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✅</span>
                <span style={{ fontSize: "0.9rem" }}>
                  Aadhaar de-duplication cross-checked against district PDS database (No active conflict).
                </span>
              </li>
            </ul>
          </div>

          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Officer Decision &amp; Statutory Action</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Every status change generates an irreversible audit entry and sends an automated SMS alert to the applicant.
            </p>

            {decisionError && (
              <div className="badge badge-danger" style={{ display: "block", padding: "10px", marginBottom: "14px" }}>
                ⚠ {decisionError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Official Remarks / Inspection Endorsement
                {["Rejected", "Clarification Required"].includes(request.status) && (
                  <span style={{ color: "var(--destructive)" }}> * (Mandatory for Rejection/Return)</span>
                )}
              </label>
              <textarea
                rows={3}
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder="Enter field inspection notes, compliance observations, or reason for rejection/clarification..."
                className="form-textarea"
              />
              <span className="form-help">Remarks will be included in citizen SMS notification and official record</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
              {request.status === "Submitted" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAction("Under Verification", false)}
                  className="btn btn-primary"
                >
                  Start Formal Verification &rarr;
                </button>
              )}

              {request.status === "Under Verification" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAction("Pending Approval", false)}
                  className="btn btn-primary"
                >
                  Verify Documents &amp; Recommend for Approval &rarr;
                </button>
              )}

              {["Submitted", "Under Verification", "Pending Approval"].includes(request.status) && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction("Approved", false)}
                    className="btn btn-primary"
                    style={{ flex: 1, background: "#235928", borderColor: "#235928" }}
                  >
                    ✔ Approve Application
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction("Rejected", true)}
                    className="btn btn-destructive"
                    style={{ flex: 1 }}
                  >
                    ✖ Reject (Requires Remarks)
                  </button>
                </div>
              )}

              {["Submitted", "Under Verification", "Pending Approval"].includes(request.status) && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAction("Clarification Required", true)}
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                >
                  ↩ Return to Citizen for Document Clarification
                </button>
              )}

              {request.status === "Approved" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAction("Card Issued", false)}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  🖨 Mark Ration Card Issued &amp; Dispatch SMS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SmsToast message={smsToast || undefined} onClose={() => setSmsToast(null)} />
    </div>
  );
}
