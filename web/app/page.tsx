"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface StatsData {
  monthlyVolumeBaseline: number;
  monthlyMisplacedFilesBaseline: number;
  digitalMisplacedFiles: number;
  totalRegistered: number;
  pendingInQueue: number;
  approvedCount: number;
  rejectedCount: number;
  slaBreachedCount: number;
  activeRuleVersion: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.error("Failed to load live stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="panel" style={{ padding: "40px 32px", marginBottom: "32px", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span className="badge badge-primary">National Food Security (NFSA)</span>
          <span className="badge badge-default">District Supply Office</span>
          <span className="badge badge-success">Platform Online</span>
        </div>

        <h1 style={{ fontSize: "2.5rem", maxWidth: "800px" }}>
          RationSeva: Online Citizen Services &amp; Adjudication Portal
        </h1>

        <p style={{ fontSize: "1.15rem", maxWidth: "780px", color: "var(--foreground)", opacity: 0.9 }}>
          A digital-first e-governance platform for the District Supply Office, handling ~4,000 monthly ration card
          service requests. Completely eliminates misplaced physical dossiers, reduces citizen office footfall, and
          enforces statutory 15-day SLA compliance with automated SMS notifications.
        </p>

        <div style={{ display: "flex", gap: "14px", marginTop: "24px", flexWrap: "wrap" }}>
          <Link href="/citizen/apply" className="btn btn-primary btn-lg">
            Apply for Ration Card Services →
          </Link>
          <Link href="/citizen/track" className="btn btn-secondary btn-lg">
            Track Application Status
          </Link>
          <Link href="/officer" className="btn btn-outline btn-lg">
            Officer Adjudication Queue
          </Link>
        </div>
      </section>

      {/* 5 Service Streams */}
      <section style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
          <h2>Available Service Streams</h2>
          <span style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
            Regulated under the National Food Security Act (NFSA) &amp; State Policy
          </span>
        </div>

        <div className="grid grid-cols-3">
          <div className="panel interactive">
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🌾</div>
            <h3 style={{ marginTop: 0 }}>New Ration Card</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              Issue new household ration card for priority (PHH &le; ₹1,00,000) or non-priority households.
            </p>
            <div style={{ marginTop: "14px" }}>
              <span className="form-help" style={{ display: "block", marginBottom: "6px" }}>
                Mandatory: Residence proof, Aadhaar, Income cert
              </span>
              <Link href="/citizen/apply?type=NEW_CARD" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                Apply for New Card →
              </Link>
            </div>
          </div>

          <div className="panel interactive">
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>➕</div>
            <h3 style={{ marginTop: 0 }}>Add Family Member</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              Add newborn child or newly married spouse to an existing ration card (limit 15 members).
            </p>
            <div style={{ marginTop: "14px" }}>
              <span className="form-help" style={{ display: "block", marginBottom: "6px" }}>
                Mandatory: Birth/Marriage cert, Member Aadhaar
              </span>
              <Link href="/citizen/apply?type=ADD_MEMBER" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                Add Member →
              </Link>
            </div>
          </div>

          <div className="panel interactive">
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>➖</div>
            <h3 style={{ marginTop: 0 }}>Remove Family Member</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              Remove deceased or migrated family member while preserving minimum 1 active member.
            </p>
            <div style={{ marginTop: "14px" }}>
              <span className="form-help" style={{ display: "block", marginBottom: "6px" }}>
                Mandatory: Death cert / Marriage cert / Migration NOC
              </span>
              <Link href="/citizen/apply?type=REMOVE_MEMBER" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                Remove Member →
              </Link>
            </div>
          </div>

          <div className="panel interactive">
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>🏠</div>
            <h3 style={{ marginTop: 0 }}>Change Residence Address</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              Update domestic address within the district and reallocate Fair Price Shop (FPS).
            </p>
            <div style={{ marginTop: "14px" }}>
              <span className="form-help" style={{ display: "block", marginBottom: "6px" }}>
                Mandatory: Electricity bill / Registered lease deed
              </span>
              <Link href="/citizen/apply?type=ADDRESS_CHANGE" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                Change Address →
              </Link>
            </div>
          </div>

          <div className="panel interactive">
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>📄</div>
            <h3 style={{ marginTop: 0 }}>Duplicate Ration Card</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              Request duplicate physical/digital credential in case of loss, theft, or mutilation.
            </p>
            <div style={{ marginTop: "14px" }}>
              <span className="form-help" style={{ display: "block", marginBottom: "6px" }}>
                Mandatory: Police loss dairy extract or damaged card
              </span>
              <Link href="/citizen/apply?type=DUPLICATE" className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                Request Duplicate →
              </Link>
            </div>
          </div>

          <div className="panel interactive" style={{ background: "var(--muted)", borderColor: "var(--ring)" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>⚖️</div>
            <h3 style={{ marginTop: 0 }}>Policy &amp; Rule Engine</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
              State Government Orders (GO) change income thresholds and quota parameters without code redeployment.
            </p>
            <div style={{ marginTop: "14px" }}>
              <span className="form-help" style={{ display: "block", marginBottom: "6px" }}>
                Active Version: {stats?.activeRuleVersion || "v1.0"} (Rule Engine)
              </span>
              <Link href="/admin/rules" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                Manage Policy Rules →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Architecture Highlights */}
      <section className="panel" style={{ background: "var(--card)", marginTop: "24px" }}>
        <h3 style={{ marginTop: 0, fontFamily: "var(--font-sans)" }}>
          🏛️ Enterprise E-Governance Architecture &amp; System Capabilities
        </h3>

        <div className="grid grid-cols-3" style={{ marginTop: "16px" }}>
          <div>
            <strong>Decoupled Microservices:</strong>
            <p style={{ fontSize: "0.88rem", margin: "4px 0", color: "var(--muted-foreground)" }}>
              High-cohesion microservices isolating Citizen Intake from Officer Adjudication via asynchronous Pub/Sub message queues for 24/7 intake uptime.
            </p>
          </div>

          <div>
            <strong>Dynamic Rule Engine:</strong>
            <p style={{ fontSize: "0.88rem", margin: "4px 0", color: "var(--muted-foreground)" }}>
              Zero-downtime policy engine allowing state Food &amp; Civil Supplies departments to deploy updated income cutoffs and quotas with zero code redeployment.
            </p>
          </div>

          <div>
            <strong>Immutable Digital Audit:</strong>
            <p style={{ fontSize: "0.88rem", margin: "4px 0", color: "var(--muted-foreground)" }}>
              100% auditable digital dossiers with S3 document storage, automated SLA tracking, and real-time telecom SMS dispatches for complete transparency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
