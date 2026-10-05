"use client";

import { useEffect, useState } from "react";
import { RuleVersion, EligibilityRule, REQUEST_TYPES } from "@/lib/types";

export default function RulesAdminPage() {
  const [activeVersion, setActiveVersion] = useState<string>("v1.0");
  const [activeRules, setActiveRules] = useState<RuleVersion | null>(null);
  const [history, setHistory] = useState<RuleVersion[]>([]);
  const [loading, setLoading] = useState(true);

  // Draft editing state
  const [draftRules, setDraftRules] = useState<EligibilityRule[]>([]);
  const [newVersionTag, setNewVersionTag] = useState("v1.1");
  const [effectiveFromDate, setEffectiveFromDate] = useState(
    new Date(Date.now() + 15 * 864e5).toISOString().slice(0, 10)
  );
  const [goRef, setGoRef] = useState("GO-MS-12/2027/FCS");
  const [summaryNote, setSummaryNote] = useState("Raising priority household (PHH) annual income limit from ₹1,00,000 to ₹1,20,000 as per state cabinet revision.");
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRules = () => {
    setLoading(true);
    fetch("/api/rules")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActiveVersion(data.activeVersion);
          setActiveRules(data.activeRules);
          setHistory(data.history);
          setDraftRules(data.activeRules.rules.map((r: any) => ({ ...r })));

          // Auto calculate next version tag
          const [maj, min] = data.activeVersion.slice(1).split(".").map(Number);
          setNewVersionTag(`v${maj}.${min + 1}`);
        }
      })
      .catch((err) => console.error("Error fetching rules:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleRuleFieldChange = (index: number, field: keyof EligibilityRule, value: any) => {
    setDraftRules((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handlePublishNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (!goRef.trim() || !summaryNote.trim()) {
      setErrorMessage("Government Order Reference and Policy Summary are mandatory for the formal change log.");
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        version: newVersionTag,
        effectiveFrom: effectiveFromDate,
        publishedBy: "State Food & Civil Supplies Dept",
        governmentOrderRef: goRef,
        summary: summaryNote,
        rules: draftRules,
      };

      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish rule version.");

      setStatusMessage(`✔ Successfully published ${data.data.version}. Active for all applications evaluated on or after ${effectiveFromDate}.`);
      fetchRules();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const getTypeName = (type: string) => {
    return REQUEST_TYPES.find((t) => t.id === type)?.name || type;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Change Management &amp; Policy Hub</span>
        <h1 style={{ margin: "4px 0" }}>Statutory Eligibility Rules Engine</h1>
        <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
          Data-driven policy engine accommodating state government order (GO) modifications without code alterations (Exposure Rank #2: P=0.5, I=7).
        </p>
      </div>

      {/* Active Version Ribbon */}
      <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="form-help">Current Enforced Policy Version</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
              <span style={{ fontSize: "1.8rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--primary)" }}>
                {activeVersion}
              </span>
              <span className="badge badge-success">Enforced Live</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
              Effective From: <strong>{activeRules?.effectiveFrom}</strong> · Legal Ref: <strong>{activeRules?.governmentOrderRef}</strong>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="form-help">System Agility Standard (NFR-06)</span>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Zero Downtime · &le; 1 Working Day Cutover
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="badge badge-success" style={{ display: "block", padding: "14px", marginBottom: "24px", fontSize: "0.9rem" }}>
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="badge badge-danger" style={{ display: "block", padding: "14px", marginBottom: "24px", fontSize: "0.9rem" }}>
          ⚠ {errorMessage}
        </div>
      )}

      {/* Draft Rules Configuration Table */}
      <div className="panel" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Editable Rule Parameters by Service Stream</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
            Values edited here apply to the new version release below
          </span>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "30px", color: "var(--muted-foreground)" }}>Loading statutory rules...</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Stream</th>
                  <th>PHH Income Ceiling (₹)</th>
                  <th>Min Family Members</th>
                  <th>Max Family Members</th>
                  <th>Required Document Proofs</th>
                </tr>
              </thead>
              <tbody>
                {draftRules.map((rule, idx) => (
                  <tr key={rule.type}>
                    <td>
                      <strong>{getTypeName(rule.type)}</strong>
                    </td>
                    <td>
                      <input
                        type="number"
                        step={5000}
                        value={rule.incomeLimit}
                        onChange={(e) => handleRuleFieldChange(idx, "incomeLimit", Number(e.target.value))}
                        className="form-input"
                        style={{ width: "130px", fontFamily: "var(--font-mono)" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={rule.minMembers}
                        onChange={(e) => handleRuleFieldChange(idx, "minMembers", Number(e.target.value))}
                        className="form-input"
                        style={{ width: "70px", fontFamily: "var(--font-mono)" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={rule.maxMembers}
                        onChange={(e) => handleRuleFieldChange(idx, "maxMembers", Number(e.target.value))}
                        className="form-input"
                        style={{ width: "70px", fontFamily: "var(--font-mono)" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={rule.requiredDocs.join(", ")}
                        onChange={(e) =>
                          handleRuleFieldChange(
                            idx,
                            "requiredDocs",
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                        className="form-input"
                        style={{ minWidth: "220px", fontSize: "0.85rem" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish Form (Change Management 6-Step Implementation) */}
      <div className="panel" style={{ background: "var(--muted)", marginBottom: "36px" }}>
        <h3 style={{ marginTop: 0 }}>Publish New Policy Version (6-Step Change Control)</h3>
        <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "20px" }}>
          Step 6: Implement &amp; Verify. Saves a new immutable rule version record in the database. Pre-existing applications remain evaluated under their submission-date version.
        </p>

        <form onSubmit={handlePublishNewVersion}>
          <div className="grid grid-cols-3">
            <div className="form-group">
              <label className="form-label">New Version Tag *</label>
              <input
                type="text"
                value={newVersionTag}
                onChange={(e) => setNewVersionTag(e.target.value)}
                className="form-input"
                style={{ fontFamily: "var(--font-mono)" }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Statutory Government Order (GO) *</label>
              <input
                type="text"
                value={goRef}
                onChange={(e) => setGoRef(e.target.value)}
                className="form-input"
                placeholder="GO-MS-12/2027/FCS"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Effective From Date *</label>
              <input
                type="date"
                value={effectiveFromDate}
                onChange={(e) => setEffectiveFromDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Policy Revision Rationale &amp; Change Summary *</label>
            <textarea
              rows={2}
              value={summaryNote}
              onChange={(e) => setSummaryNote(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
            <button
              type="button"
              onClick={fetchRules}
              className="btn btn-outline"
            >
              Reset Draft
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="btn btn-primary btn-lg"
            >
              {isPublishing ? "Publishing Rule Version..." : "✔ Publish &amp; Activate New Rule Version"}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Rule Version Log */}
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Statutory Policy Version Audit Log</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
          Full historical ledger of policy changes maintained under Section 4 of IEEE 830 auditability standards.
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Effective Date</th>
                <th>Government Order Ref</th>
                <th>Published By</th>
                <th>Summary &amp; Rationale</th>
              </tr>
            </thead>
            <tbody>
              {history.map((ver) => (
                <tr key={ver.version}>
                  <td>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
                      {ver.version}
                    </strong>
                    {ver.version === activeVersion && (
                      <span className="badge badge-success" style={{ marginLeft: "6px" }}>Active</span>
                    )}
                  </td>
                  <td>{ver.effectiveFrom}</td>
                  <td>
                    <span className="badge badge-default">{ver.governmentOrderRef}</span>
                  </td>
                  <td>{ver.publishedBy}</td>
                  <td style={{ fontSize: "0.88rem" }}>{ver.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
