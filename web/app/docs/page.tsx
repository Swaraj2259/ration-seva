"use client";

import { useState } from "react";
import Image from "next/image";

type TabKey = "srs" | "sow" | "uml" | "risks" | "qa" | "downloads";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("srs");

  // Tab 1: SRS & MoSCoW states
  const [moscowFilter, setMoscowFilter] = useState<"all" | "must" | "should" | "could" | "wont">("all");
  const [srsViewMode, setSrsViewMode] = useState<"cards" | "table">("cards");
  const [activePersona, setActivePersona] = useState<number>(0);

  // Tab 2: CPM & Float Simulator states
  const [taskCDuration, setTaskCDuration] = useState<number>(14);

  // Tab 3: System Design (HLD) & UML states
  const [activeArchComponent, setActiveArchComponent] = useState<string>("queue");
  const [activeUmlDiagram, setActiveUmlDiagram] = useState<"usecase" | "class" | "sequence" | "activity" | "state" | "aws">("sequence");

  // Tab 4: Risk Matrix & Change Management states
  const [selectedRiskPin, setSelectedRiskPin] = useState<number | null>(1);
  const [riskSimProb, setRiskSimProb] = useState<number>(0.6);
  const [riskSimImpact, setRiskSimImpact] = useState<number>(6);
  const [activeChangeStep, setActiveChangeStep] = useState<number>(1);

  // Tab 5: QA, BVA Sandbox & DRE Calculator states
  const [bvaMemberCount, setBvaMemberCount] = useState<number>(1);
  const [bvaIncome, setBvaIncome] = useState<number>(150000);
  const [drePreRelease, setDrePreRelease] = useState<number>(54);
  const [drePostRelease, setDrePostRelease] = useState<number>(6);

  const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: "srs", label: "1. SRS & MoSCoW", icon: "📋" },
    { key: "sow", label: "2. SOW & CPM Simulator", icon: "⏱️" },
    { key: "uml", label: "3. System Design (HLD) & UML", icon: "☁️" },
    { key: "risks", label: "4. Risk Matrix & Change Flow", icon: "🛡️" },
    { key: "qa", label: "5. QA Sandbox & DRE Lab", icon: "🧪" },
    { key: "downloads", label: "6. Formal .docx Papers", icon: "📥" },
  ];

  // Functional Requirements Data
  const functionalRequirements = [
    {
      id: "FR-01",
      title: "Role-Based Mobile OTP Authentication",
      statement: "Citizens and district staff shall authenticate using a 10-digit mobile number + 6-digit OTP, routed to role-specific views (Citizen, Officer, Admin).",
      moscow: "must",
      actor: "Citizen & Staff",
      useCase: "UC1 (Login OTP)",
      testTrace: "TC-01, TC-02",
      whyImportant: "Guarantees digital identity without requiring complex passwords, directly addressing staff skill gaps.",
    },
    {
      id: "FR-02",
      title: "Five Service Stream Application Intake",
      statement: "Portal shall accept online service requests for New Ration Card, Add Member, Delete Member, Address Change, and Duplicate Card with stream-specific data capture.",
      moscow: "must",
      actor: "Citizen",
      useCase: "UC2 (Submit Request)",
      testTrace: "TC-03",
      whyImportant: "Replaces physical paper visits for all 4,000 monthly requests, halting file loss at intake.",
    },
    {
      id: "FR-03",
      title: "Document Upload with Strict Type & Size Enforcing",
      statement: "System shall enforce document upload in PDF/JPG format, maximum 2 MB per file, with mandatory document checklists per service stream.",
      moscow: "must",
      actor: "Citizen",
      useCase: "UC3 (Upload Proofs)",
      testTrace: "TC-04, TC-05",
      whyImportant: "Mitigates fake documents risk and prevents malformed files from clogging server storage.",
    },
    {
      id: "FR-04",
      title: "Automated Pre-Submission Rule Evaluation",
      statement: "System shall automatically evaluate active eligibility rules (income ceilings, family quota 1–15, Aadhaar de-duplication) before submission.",
      moscow: "must",
      actor: "Rule Engine",
      useCase: "UC10 (Check Eligibility)",
      testTrace: "TC-06 to TC-12",
      whyImportant: "Eliminates human clerk errors and stops invalid applications before they enter officer review.",
    },
    {
      id: "FR-05",
      title: "Unique Alphanumeric Tracking ID Dispatch",
      statement: "System shall generate a unique tracking ID (RS-YYYY-NNNNNN) with immediate on-screen confirmation and SMS dispatch.",
      moscow: "must",
      actor: "System",
      useCase: "UC2 (Submit Request)",
      testTrace: "TC-13",
      whyImportant: "Provides immutable receipt to the citizen, eliminating the need to physically ask clerks for status.",
    },
    {
      id: "FR-06",
      title: "Self-Service Real-Time Status Tracking",
      statement: "Citizen shall track application status via Request ID, displaying a chronological timeline with acting officers, stage dates, and remarks.",
      moscow: "must",
      actor: "Citizen",
      useCase: "UC4 (Track Status)",
      testTrace: "TC-14",
      whyImportant: "Eliminates counter footfall; transparency deters officer corruption and reduces physical office visits.",
    },
    {
      id: "FR-07",
      title: "FIFO Officer Adjudication Queue with Remarks Enforcing",
      statement: "Officer shall review applications via a FIFO queue (oldest first) and execute decisions (Approve, Reject, Return); written remarks are mandatory for Rejection/Return.",
      moscow: "must",
      actor: "Supply Officer",
      useCase: "UC5, UC6 (Adjudication)",
      testTrace: "TC-15, TC-16",
      whyImportant: "Enforces fair turnaround and provides actionable legal feedback if an application is returned.",
    },
    {
      id: "FR-08",
      title: "Automated SMS Alert Notifications",
      statement: "System shall dispatch automated SMS alerts on all status transitions: Submitted, Under Verification, Returned, Approved, Rejected, Card Issued.",
      moscow: "must",
      actor: "SMS Worker",
      useCase: "UC9 (Send SMS Alert)",
      testTrace: "TC-17",
      whyImportant: "Bridges digital divide for citizens without computers or internet access.",
    },
    {
      id: "FR-09",
      title: "Dynamic Eligibility Rule Management",
      statement: "Administrator shall publish new eligibility rule versions (income limits, required documents) with effective dates without requiring code redeployment.",
      moscow: "must",
      actor: "Policy Admin",
      useCase: "UC7 (Manage Rules)",
      testTrace: "TC-18",
      whyImportant: "Directly solves the 'State rule changes within the year' risk without needing software maintenance releases.",
    },
    {
      id: "FR-10",
      title: "Operational MIS Analytics & SLA Breach Reports",
      statement: "System shall generate operational MIS reports: intake by service stream, disposal rates, pending > 15-day SLA breaches, and officer performance.",
      moscow: "should",
      actor: "District Collector",
      useCase: "UC8 (Generate Reports)",
      testTrace: "TC-19",
      whyImportant: "Ensures supervisory accountability under the State Public Services Guarantee Act.",
    },
    {
      id: "FR-11",
      title: "Digitally Signed PDF Certificate Download",
      statement: "Citizen shall download a digitally signed PDF receipt and official ration card approval letter.",
      moscow: "could",
      actor: "Citizen",
      useCase: "UC4 (Track Status)",
      testTrace: "TC-20",
      whyImportant: "High convenience for bank/subsidized gas KYC, though SMS receipt already provides legal proof.",
    },
    {
      id: "FR-DEF-01",
      title: "Fair-Price Shop (FPS) Biometric e-PoS Weighing Integration",
      statement: "System shall interface with physical electronic Point of Sale (e-PoS) biometric weighing scales at fair price ration shops.",
      moscow: "wont",
      actor: "FPS Dealer",
      useCase: "UC-P2-01 (Fair Price Distribution)",
      testTrace: "TC-P2-01",
      whyImportant: "Managed by the State Central PDS server. Deferred to Phase 2 to de-risk the 44-day portal critical path.",
    },
    {
      id: "FR-DEF-02",
      title: "Online Payment Gateway for Nominal Service Fees",
      statement: "Portal shall process digital payments via UPI, net banking, or debit card for duplicate card replacement charges.",
      moscow: "wont",
      actor: "Citizen",
      useCase: "UC-P2-02 (Pay Fees)",
      testTrace: "TC-P2-02",
      whyImportant: "Citizen charter services are free or cash-at-delivery. Deferred to Phase 2 to avoid banking gateway compliance delays.",
    },
    {
      id: "FR-DEF-03",
      title: "Native Android and iOS Mobile Applications",
      statement: "District shall publish native standalone apps on Google Play Store and Apple App Store for ration card management.",
      moscow: "wont",
      actor: "Mobile User",
      useCase: "UC-P2-03 (Native Mobile)",
      testTrace: "TC-P2-03",
      whyImportant: "Responsive progressive web portal accessible on mobile browsers fully suffices for Phase 1 MVP.",
    },
  ];

  // Filtered requirements: 'all' displays the 11 core functional requirements (9 Must, 1 Should, 1 Could)
  const filteredFR = moscowFilter === "all"
    ? functionalRequirements.filter((fr) => fr.moscow !== "wont")
    : functionalRequirements.filter((fr) => fr.moscow === moscowFilter);

  // Personas for Requirements Elicitation
  const personas = [
    {
      name: "Ramesh Kumar",
      role: "Citizen Beneficiary (Rural Daily Wage Farmer)",
      avatar: "🌾",
      quote: "I traveled 22 km and lost three days of daily wage just to ask if my newborn daughter was added to my BPL ration card. The clerk said the file was lost in the rack.",
      painPoint: "Repeated physical visits, lost daily earnings, zero transparency, 120 files lost monthly.",
      systemSolution: "FR-02 (Online intake), FR-05 (Instant Tracking ID), FR-08 (Automated SMS updates). Zero office visits needed.",
    },
    {
      name: "Sunita Devi",
      role: "Supply Office Senior Clerk",
      avatar: "👩‍💼",
      quote: "Every morning 200 citizens surround my desk. We handle 4,000 files a month; dossiers get stacked on floors. If a file gets misplaced, we spend hours searching.",
      painPoint: "Paper docket avalanche, misfiling blame, manual register bookkeeping, anxiety over complicated computer software.",
      systemSolution: "FR-07 (FIFO work queue with large high-contrast buttons), NFR-03 (<= 90 second workflow with <= 2 hours training).",
    },
    {
      name: "Rajesh Sharma",
      role: "District Supply Officer (Adjudicating Authority)",
      avatar: "👮",
      quote: "The Public Services Guarantee Act mandates a 15-day disposal turnaround. But by the time a paper file climbs through clerk tables to my desk, 12 days have elapsed.",
      painPoint: "SLA compliance failure, lack of verified proofs, fear of approving fake income certificates without audit trails.",
      systemSolution: "FR-04 (Rule engine verification), FR-07 (One-click decision modal with mandatory remarks), NFR-02 (100% audit log).",
    },
    {
      name: "Dr. K. Verma, IAS",
      role: "State Civil Supplies Department Secretary",
      avatar: "🏛️",
      quote: "The State Cabinet revises BPL income thresholds and subsidy limits twice a year. We cannot wait 6 months for a software vendor contract to amend the code.",
      painPoint: "Legislative volatility, state policy changes within the year, vendor lock-in.",
      systemSolution: "FR-09 (Dynamic JSON rule configuration engine with G.O. reference tracking; instant live reload without server rebuild).",
    },
  ];

  // BVA Member Count evaluation
  const getBvaMemberResult = (count: number) => {
    if (count < 1) {
      return { category: "Below Minimum (Invalid)", status: "REJECT", message: "Error: Minimum 1 family member required.", badge: "badge-danger" };
    } else if (count === 1) {
      return { category: "Minimum Boundary (Valid)", status: "ACCEPT", message: "Valid: Single-member household accepted.", badge: "badge-success" };
    } else if (count === 2) {
      return { category: "Min + 1 (Valid)", status: "ACCEPT", message: "Valid: Two-member household accepted.", badge: "badge-success" };
    } else if (count > 2 && count < 14) {
      return { category: "Nominal Range (Valid)", status: "ACCEPT", message: `Valid: Standard household (${count} members).`, badge: "badge-success" };
    } else if (count === 14) {
      return { category: "Max - 1 (Valid)", status: "ACCEPT", message: "Valid: High-density household (14 members).", badge: "badge-success" };
    } else if (count === 15) {
      return { category: "Maximum Boundary (Valid)", status: "ACCEPT", message: "Valid: Maximum statutory limit (15 members).", badge: "badge-success" };
    } else {
      return { category: "Above Maximum (Invalid)", status: "REJECT", message: `Error: Exceeds maximum 15 members limit (${count}). Requires special DSO authorization.`, badge: "badge-danger" };
    }
  };

  // BVA Income evaluation
  const getBvaIncomeResult = (incomeVal: number) => {
    if (incomeVal < 0) {
      return { category: "Below Min (Negative - Invalid)", status: "REJECT", scheme: "Invalid", badge: "badge-danger" };
    } else if (incomeVal <= 100000) {
      return { category: "Antyodaya Anna Yojana (AAY / Poorest of Poor)", status: "ACCEPT", scheme: "AAY (35 kg grain/mo)", badge: "badge-success" };
    } else if (incomeVal <= 250000) {
      return { category: "Priority Household (PHH / BPL)", status: "ACCEPT", scheme: "PHH (5 kg/member)", badge: "badge-success" };
    } else if (incomeVal <= 1000000) {
      return { category: "Non-Priority Household (NPHH / APL)", status: "ACCEPT", scheme: "NPHH (Subsidized)", badge: "badge-primary" };
    } else {
      return { category: "Above Upper Ceiling (Invalid / Ineligible)", status: "REJECT", scheme: "Exempt / Taxpayer Ineligible", badge: "badge-danger" };
    }
  };

  const bvaMemberResult = getBvaMemberResult(bvaMemberCount);
  const bvaIncomeResult = getBvaIncomeResult(bvaIncome);

  // Dynamic DRE Calculation
  const calculatedDre = drePreRelease + drePostRelease > 0
    ? ((drePreRelease / (drePreRelease + drePostRelease)) * 100).toFixed(1)
    : "0.0";
  const isDrePassing = parseFloat(calculatedDre) >= 85.0;

  // Float Simulation
  const earlyFinishTaskC = 6 + taskCDuration;
  const taskCFloatRemaining = 25 - taskCDuration;
  const projectTotalDays = taskCDuration > 25 ? 44 + (taskCDuration - 25) : 44;

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
      {/* Top Banner & Title Bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
          <span className="badge badge-primary">Public Distribution System (e-PDS)</span>
          <span className="badge badge-default">District Supply Office</span>
          <span className="badge badge-success">IEEE 830 / ISO 25010</span>
        </div>

        <h1 style={{ margin: "6px 0 8px", fontSize: "2.3rem", letterSpacing: "-0.02em" }}>
          RationSeva Engineering Blueprint &amp; System Specifications
        </h1>
        <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "1.05rem" }}>
          Comprehensive architectural specifications covering Requirements Engineering (SRS), Critical Path Method (CPM) Scheduling, 5-Tier System Architecture, UML Package, Risk Analysis, and Quality Assurance.
        </p>
      </div>

      {/* Executive Scope & Key Metrics Bar */}
      <div className="grid grid-cols-4" style={{ gap: "14px", marginBottom: "28px" }}>
        <div className="panel" style={{ padding: "14px 18px", background: "var(--card)", textAlign: "center", borderTop: "3px solid var(--primary)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Monthly Intake Volume</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--foreground)" }}>4,000</div>
          <div style={{ fontSize: "0.78rem", color: "var(--primary)" }}>Citizen Requests / Month</div>
        </div>
        <div className="panel" style={{ padding: "14px 18px", background: "var(--card)", textAlign: "center", borderTop: "3px solid var(--destructive)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Misplaced Files Saved</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--destructive)" }}>120 &rarr; 0</div>
          <div style={{ fontSize: "0.78rem", color: "var(--foreground)" }}>3% Baseline &rarr; 100% Digital</div>
        </div>
        <div className="panel" style={{ padding: "14px 18px", background: "var(--card)", textAlign: "center", borderTop: "3px solid green" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Critical Path &amp; Float</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "green" }}>44d / +11d</div>
          <div style={{ fontSize: "0.78rem", color: "var(--primary)" }}>Task C Float = 11 Days</div>
        </div>
        <div className="panel" style={{ padding: "14px 18px", background: "var(--card)", textAlign: "center", borderTop: "3px solid var(--primary)" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Defect Removal (DRE)</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>90.0%</div>
          <div style={{ fontSize: "0.78rem", color: "var(--foreground)" }}>Statutory Target &ge; 85%</div>
        </div>
      </div>

      {/* Tab Navigation Ribbon */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "8px",
          marginBottom: "28px",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`btn ${isActive ? "btn-primary" : "btn-outline"} btn-sm`}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: isActive ? 700 : 500,
                padding: "8px 16px",
                fontSize: "0.9rem",
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REQUIREMENTS (SRS) & MoSCoW */}
      {/* ========================================================================= */}
      {activeTab === "srs" && (
        <div style={{ animation: "slideIn 0.25s ease" }}>
          {/* Header Panel */}
          <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "6px" }}>IEEE 830-1998 Standard</span>
            <h2 style={{ marginTop: 0 }}>Software Requirements Specification (SRS) &amp; MoSCoW Prioritization</h2>
            <p style={{ color: "var(--foreground)", opacity: 0.9 }}>
              Requirements elicited through structured interviews with 15 citizens, 6 supply office clerks, 2 inspection officers,
              and circular analysis from the State Food &amp; Civil Supplies Department. All non-functional requirements are paired with
              strictly measurable numeric acceptance criteria (no ambiguous statements like &ldquo;the system shall be fast&rdquo;).
            </p>
          </div>

          {/* Stakeholder Elicitation Personas */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-default" style={{ marginBottom: "4px" }}>Requirements Elicitation Evidence</span>
                <h3 style={{ margin: 0 }}>Stakeholder Interview Profiles &amp; Problem Translation</h3>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Click a persona to inspect how field interviews formed the SRS</span>
            </div>

            {/* Persona Switcher Buttons */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {personas.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePersona(idx)}
                  className={`btn ${activePersona === idx ? "btn-primary" : "btn-outline"} btn-sm`}
                  style={{ fontSize: "0.85rem" }}
                >
                  <span>{p.avatar}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Active Persona Spotlight Card */}
            <div
              className="panel"
              style={{
                background: "var(--muted)",
                borderLeft: "4px solid var(--ring)",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "2.2rem" }}>{personas[activePersona].avatar}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.15rem" }}>{personas[activePersona].name}</h4>
                  <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                    {personas[activePersona].role}
                  </span>
                </div>
              </div>

              <blockquote style={{ margin: "0 0 14px", fontStyle: "italic", fontSize: "0.95rem", color: "var(--foreground)", borderLeft: "3px solid var(--primary)", paddingLeft: "12px" }}>
                &ldquo;{personas[activePersona].quote}&rdquo;
              </blockquote>

              <div className="grid grid-cols-2" style={{ gap: "16px", marginTop: "12px" }}>
                <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                  <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", color: "var(--destructive)" }}>Identified District Bottleneck:</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>{personas[activePersona].painPoint}</p>
                </div>
                <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                  <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", color: "green" }}>RationSeva Engineering Solution:</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>{personas[activePersona].systemSolution}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive MoSCoW Filter & View Switcher */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ margin: 0 }}>11 Functional Requirements (FR-01 to FR-11)</h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                  Filter by MoSCoW priority or toggle between visual card view and dense traceability table.
                </p>
              </div>

              {/* View Mode Toggle */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setSrsViewMode("cards")}
                  className={`btn ${srsViewMode === "cards" ? "btn-primary" : "btn-outline"} btn-sm`}
                >
                  🗂️ Cards View
                </button>
                <button
                  onClick={() => setSrsViewMode("table")}
                  className={`btn ${srsViewMode === "table" ? "btn-primary" : "btn-outline"} btn-sm`}
                >
                  📊 Table View
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              <button
                onClick={() => setMoscowFilter("all")}
                className={`btn ${moscowFilter === "all" ? "btn-primary" : "btn-outline"} btn-sm`}
              >
                All Requirements (11)
              </button>
              <button
                onClick={() => setMoscowFilter("must")}
                className={`btn ${moscowFilter === "must" ? "btn-primary" : "btn-outline"} btn-sm`}
              >
                🔴 MUST HAVE (9)
              </button>
              <button
                onClick={() => setMoscowFilter("should")}
                className={`btn ${moscowFilter === "should" ? "btn-primary" : "btn-outline"} btn-sm`}
              >
                🟡 SHOULD HAVE (1)
              </button>
              <button
                onClick={() => setMoscowFilter("could")}
                className={`btn ${moscowFilter === "could" ? "btn-primary" : "btn-outline"} btn-sm`}
              >
                🔵 COULD HAVE (1)
              </button>
              <button
                onClick={() => setMoscowFilter("wont")}
                className={`btn ${moscowFilter === "wont" ? "btn-primary" : "btn-outline"} btn-sm`}
              >
                ⚪ WON&rsquo;T HAVE (Phase 2 &bull; 3)
              </button>
            </div>

            {/* CARDS VIEW */}
            {srsViewMode === "cards" && (
              <div className="grid grid-cols-2" style={{ gap: "16px" }}>
                {filteredFR.map((fr) => (
                  <div
                    key={fr.id}
                    className="panel interactive"
                    style={{
                      borderTop: fr.moscow === "must" ? "3px solid var(--primary)" : "3px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span className="mono" style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--primary)" }}>
                          {fr.id}
                        </span>
                        <span className={`badge ${fr.moscow === "must" ? "badge-primary" : "badge-default"}`}>
                          {fr.moscow.toUpperCase()}
                        </span>
                      </div>
                      <h4 style={{ margin: "0 0 8px", fontSize: "1.05rem" }}>{fr.title}</h4>
                      <p style={{ margin: "0 0 12px", fontSize: "0.88rem", color: "var(--foreground)", opacity: 0.9 }}>
                        {fr.statement}
                      </p>
                      <div style={{ background: "var(--muted)", padding: "8px 10px", borderRadius: "4px", fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "12px" }}>
                        <strong>Engineering Rationale:</strong> {fr.whyImportant}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "8px", fontSize: "0.78rem" }}>
                      <span className="mono" style={{ color: "var(--muted-foreground)" }}>Actor: {fr.actor}</span>
                      <span className="badge badge-default mono">{fr.testTrace}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABLE VIEW */}
            {srsViewMode === "table" && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Requirement Title &amp; Statement</th>
                      <th>MoSCoW</th>
                      <th>Mapped Actor &amp; Use Case</th>
                      <th>Test Traceability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFR.map((fr) => (
                      <tr key={fr.id}>
                        <td><strong className="mono">{fr.id}</strong></td>
                        <td>
                          <strong>{fr.title}</strong>
                          <div style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                            {fr.statement}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${fr.moscow === "must" ? "badge-primary" : "badge-default"}`}>
                            {fr.moscow.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.85rem" }}>{fr.actor}</div>
                          <div className="mono" style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{fr.useCase}</div>
                        </td>
                        <td><span className="mono">{fr.testTrace}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Visual NFR Scorecards */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <h3 style={{ marginTop: 0 }}>6 Measurable Non-Functional Requirements (NFRs)</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Every NFR includes a strict numeric acceptance criterion to comply with ISO/IEC 25010 (no ambiguous statements like &ldquo;the system shall be fast&rdquo;):
            </p>

            <div className="grid grid-cols-3" style={{ gap: "16px" }}>
              {/* NFR 1: Availability */}
              <div className="panel" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>NFR-01: Availability</span>
                <h4 style={{ margin: "0 0 6px" }}>99.5% Uptime</h4>
                <div style={{ height: "6px", background: "var(--muted)", borderRadius: "3px", margin: "10px 0" }}>
                  <div style={{ width: "99.5%", height: "100%", background: "green", borderRadius: "3px" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
                  Maximum permissible unplanned downtime: &le; <strong>3.6 hours / month</strong>. Scheduled maintenance confined to 11 PM – 5 AM.
                </p>
                <span className="badge badge-default" style={{ fontSize: "0.72rem" }}>Metric: CloudWatch Uptime Ping</span>
              </div>

              {/* NFR 2: Auditability */}
              <div className="panel" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>NFR-02: Auditability</span>
                <h4 style={{ margin: "0 0 6px" }}>100% Immutable Trail</h4>
                <div style={{ height: "6px", background: "var(--muted)", borderRadius: "3px", margin: "10px 0" }}>
                  <div style={{ width: "100%", height: "100%", background: "var(--primary)", borderRadius: "3px" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
                  Every status change and officer remark is cryptographically hash-chained and retained for &ge; <strong>7 years</strong>. Zero gaps allowed.
                </p>
                <span className="badge badge-default" style={{ fontSize: "0.72rem" }}>Metric: 50-Dossier Sample Audit</span>
              </div>

              {/* NFR 3: Usability */}
              <div className="panel" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>NFR-03: Staff Usability</span>
                <h4 style={{ margin: "0 0 6px" }}>&le; 90 Sec Adjudication</h4>
                <div style={{ height: "6px", background: "var(--muted)", borderRadius: "3px", margin: "10px 0" }}>
                  <div style={{ width: "85%", height: "100%", background: "var(--ring)", borderRadius: "3px" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
                  Staff with low computer skills can review and decide a dossier in &le; 90 seconds after &le; <strong>2 hours training</strong> (SUS Score &ge; 70).
                </p>
                <span className="badge badge-default" style={{ fontSize: "0.72rem" }}>Metric: 10-Clerk UAT Trial</span>
              </div>

              {/* NFR 4: Citizen Usability */}
              <div className="panel" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>NFR-04: Citizen Usability</span>
                <h4 style={{ margin: "0 0 6px" }}>&le; 3 Clicks Tracking</h4>
                <div style={{ height: "6px", background: "var(--muted)", borderRadius: "3px", margin: "10px 0" }}>
                  <div style={{ width: "90%", height: "100%", background: "var(--primary)", borderRadius: "3px" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
                  Status lookup reachable in &le; 3 clicks from homepage. Mobile wizard completed in &le; 10 minutes with auto-saving draft.
                </p>
                <span className="badge badge-default" style={{ fontSize: "0.72rem" }}>Metric: 20-Citizen Trial</span>
              </div>

              {/* NFR 5: Performance */}
              <div className="panel" style={{ borderLeft: "4px solid var(--ring)" }}>
                <span className="badge badge-default" style={{ marginBottom: "6px" }}>NFR-05: Performance</span>
                <h4 style={{ margin: "0 0 6px" }}>&le; 1.8s Page Load</h4>
                <div style={{ height: "6px", background: "var(--muted)", borderRadius: "3px", margin: "10px 0" }}>
                  <div style={{ width: "75%", height: "100%", background: "var(--foreground)", borderRadius: "3px" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
                  95% of pages load in &le; 1.8s under 200 concurrent users. API response &le; 800ms. 95% of SMS delivered within 60 seconds.
                </p>
                <span className="badge badge-default" style={{ fontSize: "0.72rem" }}>Metric: JMeter &amp; SMS Gateway Logs</span>
              </div>

              {/* NFR 6: Modifiability */}
              <div className="panel" style={{ borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>NFR-06: Modifiability</span>
                <h4 style={{ margin: "0 0 6px" }}>&le; 1 Day Policy Update</h4>
                <div style={{ height: "6px", background: "var(--muted)", borderRadius: "3px", margin: "10px 0" }}>
                  <div style={{ width: "100%", height: "100%", background: "green", borderRadius: "3px" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 6px" }}>
                  State Government Orders (GOs) go live in &le; 24 hours via Admin JSON Rule Engine with <strong>zero code redeployment</strong>.
                </p>
                <span className="badge badge-default" style={{ fontSize: "0.72rem" }}>Metric: Timestamp Audit of GOs</span>
              </div>
            </div>
          </div>

          {/* MoSCoW Prioritization Summary Card */}
          <div className="panel" style={{ background: "var(--muted)", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "4px" }}>Requirements Defense Summary</span>
                <h3 style={{ margin: 0 }}>MoSCoW Prioritization Breakdown (9 Must, 1 Should, 1 Could)</h3>
              </div>
              <span className="badge badge-default mono">11 Functional Requirements Total</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Formal categorization of all 11 elicited functional requirements, justifying why core operations are non-negotiable while secondary reporting and cert downloads are prioritized:
            </p>

            <div className="grid grid-cols-4" style={{ gap: "14px" }}>
              <div className="panel" style={{ background: "var(--card)", borderTop: "3px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>🔴 MUST HAVE (9)</span>
                <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>FR-01 to FR-09</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: "1.5" }}>
                  Core public service delivery backbone: Mobile login, 5 service streams, doc upload, rule engine, tracking ID, self-service tracking, FIFO officer approval, SMS alerts, dynamic state rule management.
                </p>
              </div>

              <div className="panel" style={{ background: "var(--card)", borderTop: "3px solid var(--border)" }}>
                <span className="badge badge-default" style={{ marginBottom: "6px" }}>🟡 SHOULD HAVE (1)</span>
                <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>FR-10</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: "1.5" }}>
                  Operational MIS reporting and pending &gt; 15-day SLA breach analytics for supervisory oversight by the District Collector.
                </p>
              </div>

              <div className="panel" style={{ background: "var(--card)", borderTop: "3px solid var(--border)" }}>
                <span className="badge badge-default" style={{ marginBottom: "6px" }}>🔵 COULD HAVE (1)</span>
                <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>FR-11</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: "1.5" }}>
                  Digitally signed downloadable PDF receipt &amp; certificate. High convenience, though SMS confirmation already serves as legal proof.
                </p>
              </div>

              <div className="panel" style={{ background: "var(--card)", borderTop: "3px solid var(--border)" }}>
                <span className="badge badge-default" style={{ marginBottom: "6px" }}>⚪ WON&rsquo;T HAVE (3)</span>
                <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>Deferred to Phase 2</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: 0, lineHeight: "1.5" }}>
                  Fair-price shop biometric e-PoS weighing scale integration, online payment gateway (services are free), and native app store apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SOW & SCHEDULING (CRITICAL PATH) */}
      {/* ========================================================================= */}
      {activeTab === "sow" && (
        <div style={{ animation: "slideIn 0.25s ease" }}>
          {/* Header Panel */}
          <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Statement of Work &amp; CPM Project Plan</span>
            <h2 style={{ marginTop: 0 }}>Critical Path Analysis &amp; The Concept of Float Days</h2>
            <p style={{ color: "var(--foreground)", opacity: 0.9 }}>
              The project is scheduled using the <strong>Critical Path Method (CPM)</strong>. The project has a fixed duration of
              <strong> 44 Working Days</strong> from inception to production go-live.
            </p>
          </div>

          {/* Interactive CPM Float Simulator */}
          <div className="panel" style={{ marginBottom: "28px", border: "2px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "4px" }}>Interactive Schedule Simulation</span>
                <h3 style={{ margin: 0 }}>Live CPM Schedule &amp; Task C Float Simulator</h3>
              </div>
              <span className="badge badge-default mono">Formula: Float = LS - ES = LF - EF</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Drag the slider below to simulate: <em>&ldquo;What happens if Task C (Application Portal) gets delayed?&rdquo;</em> Watch how float days absorb the delay without changing the 44-day go-live date until the 11-day buffer is exhausted!
            </p>

            {/* Slider Control */}
            <div style={{ background: "var(--muted)", padding: "18px", borderRadius: "4px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  Task C Duration: <span className="mono" style={{ color: "var(--primary)", fontSize: "1.2rem" }}>{taskCDuration} Days</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 400, color: "var(--muted-foreground)", marginLeft: "8px" }}>
                    (Baseline: 14 days)
                  </span>
                </label>
                <button
                  onClick={() => setTaskCDuration(14)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: "0.75rem" }}
                >
                  Reset to Baseline (14d)
                </button>
              </div>

              <input
                type="range"
                min="10"
                max="30"
                value={taskCDuration}
                onChange={(e) => setTaskCDuration(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
                <span>10 Days (Fast)</span>
                <span>14 Days (Baseline)</span>
                <span>20 Days</span>
                <span>25 Days (Float Exhausted)</span>
                <span>30 Days (Critical Slip)</span>
              </div>
            </div>

            {/* Dynamic Results Display */}
            <div className="grid grid-cols-3" style={{ gap: "16px", marginBottom: "16px" }}>
              <div className="panel" style={{ padding: "14px", background: "var(--card)" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Task C Early Finish (EF)</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  Day {earlyFinishTaskC}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>Starts Day 6 + {taskCDuration}d</div>
              </div>

              <div className="panel" style={{ padding: "14px", background: "var(--card)" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Remaining Float Days</div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: taskCFloatRemaining >= 0 ? "green" : "var(--destructive)",
                  }}
                >
                  {taskCFloatRemaining >= 0 ? `${taskCFloatRemaining} Days Buffer` : `${Math.abs(taskCFloatRemaining)} Days Overdue`}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>Late Finish (31) - EF ({earlyFinishTaskC})</div>
              </div>

              <div className="panel" style={{ padding: "14px", background: "var(--card)" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Total Project Go-Live</div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: projectTotalDays === 44 ? "var(--primary)" : "var(--destructive)",
                  }}
                >
                  {projectTotalDays} Working Days
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                  {projectTotalDays === 44 ? "Critical Path UNTOUCHED (44d)" : `DELAYED BY +${projectTotalDays - 44} DAYS`}
                </div>
              </div>
            </div>

            {/* Status Callout Banner */}
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px",
                background:
                  taskCDuration <= 25
                    ? "rgba(42, 102, 46, 0.08)"
                    : "rgba(181, 74, 53, 0.08)",
                border:
                  taskCDuration <= 25
                    ? "1px solid rgba(42, 102, 46, 0.3)"
                    : "1px solid rgba(181, 74, 53, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.4rem" }}>{taskCDuration <= 25 ? "✅" : "⚠️"}</span>
              <p style={{ margin: 0, fontSize: "0.88rem" }}>
                {taskCDuration < 25 && (
                  <span>
                    <strong>Within Float Buffer:</strong> Even though Task C takes {taskCDuration} days, Testing (Task F) cannot start until Day 31 because Task E (SMS Workflow) takes until Day 31. The project finishes exactly on <strong>Day 44</strong>!
                  </span>
                )}
                {taskCDuration === 25 && (
                  <span>
                    <strong>Float Fully Consumed (Float = 0):</strong> Task C now completes exactly on Day 31! It has become a <em>co-critical task</em>. Any further 1-day delay will slip the whole project.
                  </span>
                )}
                {taskCDuration > 25 && (
                  <span style={{ color: "var(--destructive)" }}>
                    <strong>CRITICAL PATH COMPROMISED:</strong> Task C took {taskCDuration} days, exceeding the 25-day ceiling by {taskCDuration - 25} days! Testing is now delayed to Day {6 + taskCDuration}, slipping the final deadline to <strong>{projectTotalDays} days</strong>!
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Side-by-Side Visual CPM Flowchart */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <h3 style={{ marginTop: 0 }}>Visual CPM Network Flow &amp; Parallel Track Comparison</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Visualizing the two parallel paths originating from Requirements Engineering (Task A):
            </p>

            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              {/* Branch 1: Critical Path */}
              <div
                className="panel"
                style={{
                  border: "2px solid var(--destructive)",
                  background: "rgba(181, 74, 53, 0.03)",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span className="badge badge-danger">CRITICAL PATH (Zero Float)</span>
                  <span className="mono" style={{ fontWeight: 700, color: "var(--destructive)" }}>44 Days</span>
                </div>
                <h4 style={{ margin: "0 0 10px", color: "var(--destructive)" }}>Sequence: A &rarr; B &rarr; D &rarr; E &rarr; F &rarr; G</h4>
                
                <ol style={{ fontSize: "0.85rem", paddingLeft: "18px", margin: "0 0 12px", lineHeight: "1.7" }}>
                  <li><strong>A: Requirements (6d)</strong> &mdash; Days 0 to 6</li>
                  <li><strong>B: Service Rules (8d)</strong> &mdash; Days 6 to 14</li>
                  <li><strong>D: Officer Workflow (12d)</strong> &mdash; Days 14 to 26</li>
                  <li><strong>E: Status &amp; SMS (5d)</strong> &mdash; Days 26 to 31</li>
                  <li><strong>F: System Testing (8d)</strong> &mdash; Days 31 to 39</li>
                  <li><strong>G: Staff Training (5d)</strong> &mdash; Days 39 to 44</li>
                </ol>

                <div style={{ background: "var(--muted)", padding: "8px 12px", borderRadius: "4px", fontSize: "0.8rem" }}>
                  <strong>Engineering Note:</strong> Zero slack on every activity (Slack = 0). Any 1-day delay slips the final go-live date.
                </div>
              </div>

              {/* Branch 2: Non-Critical Path */}
              <div
                className="panel"
                style={{
                  border: "2px solid green",
                  background: "rgba(42, 102, 46, 0.03)",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span className="badge badge-success">PARALLEL TRACK (11 Days Float)</span>
                  <span className="mono" style={{ fontWeight: 700, color: "green" }}>Float = 11d</span>
                </div>
                <h4 style={{ margin: "0 0 10px", color: "green" }}>Sequence: A &rarr; C (Portal) &rarr; Join F at Day 31</h4>

                <ol style={{ fontSize: "0.85rem", paddingLeft: "18px", margin: "0 0 12px", lineHeight: "1.7" }}>
                  <li><strong>A: Requirements (6d)</strong> &mdash; Days 0 to 6</li>
                  <li><strong>C: Application Portal (14d)</strong> &mdash; Days 6 to 20</li>
                  <li><em>Idle Buffer / Slack Period (11d)</em> &mdash; Days 20 to 31</li>
                  <li><strong>F: Joins Testing with Track 1</strong> &mdash; Starts Day 31</li>
                  <li><strong>Resource Leveling:</strong> Developer 2 finishes on Day 20 and is reassigned to assist Tasks D &amp; E on Days 21–31.</li>
                </ol>

                <div style={{ background: "var(--muted)", padding: "8px 12px", borderRadius: "4px", fontSize: "0.8rem" }}>
                  <strong>Resource Leveling Benefit:</strong> Absorbs potential developer leaves and de-risks the approval workflow.
                </div>
              </div>
            </div>
          </div>

          {/* Full CPM Calculation Table */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <h3 style={{ marginTop: 0 }}>Complete Forward &amp; Backward Pass Schedule Table</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Name</th>
                    <th>Duration</th>
                    <th>Predecessors</th>
                    <th>Early Start (ES)</th>
                    <th>Early Finish (EF)</th>
                    <th>Late Start (LS)</th>
                    <th>Late Finish (LF)</th>
                    <th>Total Float</th>
                    <th>Critical?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "rgba(181, 74, 53, 0.05)" }}>
                    <td><strong className="mono">A</strong></td>
                    <td>Requirements Elicitation</td>
                    <td>6 days</td>
                    <td>None</td>
                    <td><span className="mono">0</span></td>
                    <td><span className="mono">6</span></td>
                    <td><span className="mono">0</span></td>
                    <td><span className="mono">6</span></td>
                    <td><strong className="mono">0</strong></td>
                    <td><span className="badge badge-danger">CRITICAL</span></td>
                  </tr>
                  <tr style={{ background: "rgba(181, 74, 53, 0.05)" }}>
                    <td><strong className="mono">B</strong></td>
                    <td>Service Rules for 5 Request Types</td>
                    <td>8 days</td>
                    <td>A</td>
                    <td><span className="mono">6</span></td>
                    <td><span className="mono">14</span></td>
                    <td><span className="mono">6</span></td>
                    <td><span className="mono">14</span></td>
                    <td><strong className="mono">0</strong></td>
                    <td><span className="badge badge-danger">CRITICAL</span></td>
                  </tr>
                  <tr style={{ background: "rgba(42, 102, 46, 0.05)" }}>
                    <td><strong className="mono">C</strong></td>
                    <td>Application Portal (Intake)</td>
                    <td>14 days</td>
                    <td>A</td>
                    <td><span className="mono">6</span></td>
                    <td><span className="mono">20</span></td>
                    <td><span className="mono">17</span></td>
                    <td><span className="mono">31</span></td>
                    <td><strong className="mono" style={{ color: "green", fontSize: "1.05rem" }}>11 days</strong></td>
                    <td><span className="badge badge-success">NON-CRITICAL</span></td>
                  </tr>
                  <tr style={{ background: "rgba(181, 74, 53, 0.05)" }}>
                    <td><strong className="mono">D</strong></td>
                    <td>Officer Approval Workflow</td>
                    <td>12 days</td>
                    <td>B</td>
                    <td><span className="mono">14</span></td>
                    <td><span className="mono">26</span></td>
                    <td><span className="mono">14</span></td>
                    <td><span className="mono">26</span></td>
                    <td><strong className="mono">0</strong></td>
                    <td><span className="badge badge-danger">CRITICAL</span></td>
                  </tr>
                  <tr style={{ background: "rgba(181, 74, 53, 0.05)" }}>
                    <td><strong className="mono">E</strong></td>
                    <td>Status Tracking &amp; SMS Alerts</td>
                    <td>5 days</td>
                    <td>D</td>
                    <td><span className="mono">26</span></td>
                    <td><span className="mono">31</span></td>
                    <td><span className="mono">26</span></td>
                    <td><span className="mono">31</span></td>
                    <td><strong className="mono">0</strong></td>
                    <td><span className="badge badge-danger">CRITICAL</span></td>
                  </tr>
                  <tr style={{ background: "rgba(181, 74, 53, 0.05)" }}>
                    <td><strong className="mono">F</strong></td>
                    <td>Testing &amp; Quality Assurance</td>
                    <td>8 days</td>
                    <td>C, E</td>
                    <td><span className="mono">31</span></td>
                    <td><span className="mono">39</span></td>
                    <td><span className="mono">31</span></td>
                    <td><span className="mono">39</span></td>
                    <td><strong className="mono">0</strong></td>
                    <td><span className="badge badge-danger">CRITICAL</span></td>
                  </tr>
                  <tr style={{ background: "rgba(181, 74, 53, 0.05)" }}>
                    <td><strong className="mono">G</strong></td>
                    <td>Staff Training (Clerks &amp; Officers)</td>
                    <td>5 days</td>
                    <td>F</td>
                    <td><span className="mono">39</span></td>
                    <td><span className="mono">44</span></td>
                    <td><span className="mono">39</span></td>
                    <td><span className="mono">44</span></td>
                    <td><strong className="mono">0</strong></td>
                    <td><span className="badge badge-danger">CRITICAL</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Embedded High-Res Diagrams */}
          <div className="grid grid-cols-2" style={{ gap: "20px" }}>
            <div className="panel">
              <h4 style={{ marginTop: 0 }}>CPM Network Activity-on-Node Diagram</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                Critical chain highlighted in bold red. Parallel branch C showing ES=6, EF=20, LS=17, LF=31.
              </p>
              <div style={{ border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
                <Image
                  src="/diagrams/network.png"
                  alt="RationSeva CPM Network Diagram"
                  width={900}
                  height={500}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>

            <div className="panel">
              <h4 style={{ marginTop: 0 }}>Gantt Chart with Zero-Duration Milestones</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                44 working days timeline with Milestones M1 to M4 as diamond checkpoints.
              </p>
              <div style={{ border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
                <Image
                  src="/diagrams/gantt.png"
                  alt="RationSeva Gantt Chart"
                  width={900}
                  height={500}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HIGH-LEVEL DESIGN (HLD) ARCHITECTURE & UML PACKAGE */}
      {/* ========================================================================= */}
      {activeTab === "uml" && (
        <div style={{ animation: "slideIn 0.25s ease" }}>
          {/* Header Panel */}
          <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "6px" }}>High-Level System Design (HLD)</span>
            <h2 style={{ marginTop: 0 }}>High-Level System Design (HLD) Architecture &amp; UML Package</h2>
            <p style={{ color: "var(--foreground)", opacity: 0.9 }}>
              Clean 5-tier system design architecture built on core industry building blocks (CDN / CloudFront, Load Balancer / Reverse Proxy, Microservices, Pub/Sub Queue, S3 Object Storage, Relational Database, and Redis Cache) for high availability, zero misplaced files, and production-grade fault tolerance.
            </p>
          </div>

          {/* Featured HLD Architecture Diagram Card */}
          <div className="panel" style={{ marginBottom: "28px", border: "2px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "4px" }}>System Architecture Diagram</span>
                <h3 style={{ margin: 0 }}>Figure: RationSeva High-Level Design (HLD) Architecture</h3>
              </div>
              <span className="badge badge-default mono">5-Tier Decoupled System Design</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Visualizes the end-to-end data flow: Clients &rarr; CDN (CloudFront) &amp; Load Balancer / Reverse Proxy &rarr; Backend Application Services &rarr; Pub/Sub / Message Queue &rarr; S3 Object Storage, Relational Database &amp; Redis Cache:
            </p>

            {/* Widescreen HLD Diagram Image */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden", background: "#fffcf5", padding: "16px", textAlign: "center" }}>
              <Image
                src="/diagrams/aws_architecture.png"
                alt="RationSeva High-Level Design Architecture"
                width={1568}
                height={874}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "4px" }}
              />
            </div>

            {/* Diagram Flow Explanation */}
            <div className="grid grid-cols-4" style={{ gap: "10px", marginTop: "16px", fontSize: "0.82rem" }}>
              <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px" }}>
                <strong>1. Ingress Flow:</strong> CDN &amp; Load Balancer / Reverse Proxy distribute citizen and officer traffic securely with SSL/TLS termination.
              </div>
              <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px" }}>
                <strong>2. Validation:</strong> Intake Service validates boundary rules ($1 \le m \le 15$) &amp; uploads PDF/JPG proofs directly to S3 Object Storage.
              </div>
              <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px" }}>
                <strong>3. Pub/Sub Queue:</strong> Decouples citizen intake from officer review; requests buffer safely without data loss.
              </div>
              <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px" }}>
                <strong>4. Storage &amp; Cache:</strong> Relational DB handles dossiers &amp; audit logs, Redis caches active rules, and SMS gateway notifies citizens.
              </div>
            </div>
          </div>

          {/* Interactive 5-Tier Architecture Explorer */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-default" style={{ marginBottom: "4px" }}>Architectural Layer Breakdown</span>
                <h3 style={{ margin: 0 }}>5-Tier Architecture Component Explorer</h3>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Click an architectural layer to inspect its design role</span>
            </div>

            {/* Layer Selection Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {[
                { id: "clients", label: "1. Clients (Mobile & Web)", icon: "📱" },
                { id: "gateway", label: "2. CDN & Load Balancer / Proxy", icon: "⚖️" },
                { id: "services", label: "3. Backend Services (Intake, Rules, Approval)", icon: "⚙️" },
                { id: "queue", label: "4. Pub/Sub / Message Queue", icon: "📬" },
                { id: "storage", label: "5. S3 Storage, Relational DB & Redis", icon: "💾" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveArchComponent(c.id)}
                  className={`btn ${activeArchComponent === c.id ? "btn-primary" : "btn-outline"} btn-sm`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Layer Inspection Card */}
            <div className="panel" style={{ background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "20px" }}>
              {activeArchComponent === "clients" && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>📱 Tier 1: Clients (Mobile &amp; Web Presentation Layer)</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                    Provides tailored responsive user interfaces for the three distinct stakeholder groups:
                  </p>
                  <div className="grid grid-cols-3" style={{ gap: "12px", fontSize: "0.85rem" }}>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Citizen (Mobile &amp; Web):</strong> Responsive portal for submitting 5 service streams, uploading document proofs (&le; 2 MB), and tracking status with request ID in &le; 3 clicks.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>District Officer &amp; Clerk Desk:</strong> High-efficiency workstation for adjudicating dossiers in strict FIFO order with mandatory written remarks on returns or rejections.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Policy Admin Console:</strong> Administrative interface for state directors to update eligibility income slabs and quota rules with immediate activation.
                    </div>
                  </div>
                </div>
              )}

              {activeArchComponent === "gateway" && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>⚖️ Tier 2: CDN (CloudFront) &amp; Load Balancer / Reverse Proxy</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                    Edge delivery and ingress layer ensuring low-latency asset delivery and secure, balanced backend routing:
                  </p>
                  <div className="grid grid-cols-3" style={{ gap: "12px", fontSize: "0.85rem" }}>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>CDN (CloudFront):</strong> Geographically distributed content delivery network that caches static web assets (HTML/CSS/JS, icons) close to users, cutting load times to &lt; 1 second.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Load Balancer:</strong> Distributes incoming HTTP/HTTPS traffic across multiple backend server instances to prevent bottlenecks during peak daytime intake hours.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Reverse Proxy &amp; SSL:</strong> Terminates SSL/TLS encryption, conceals backend internal IP topology, and enforces rate-limiting against abusive request spam.
                    </div>
                  </div>
                </div>
              )}

              {activeArchComponent === "services" && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>⚙️ Tier 3: Core Backend Application Services (High-Cohesion Microservices)</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                    Autonomous, stateless backend microservices partitioned strictly by business domain:
                  </p>
                  <div className="grid grid-cols-3" style={{ gap: "12px", fontSize: "0.85rem" }}>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Intake &amp; Validation Service:</strong> Handles citizen form submissions, boundary checks (1 &le; members &le; 15), verifies proof formats, and uploads files to S3 Object Storage.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Eligibility Rule Engine:</strong> Evaluates household eligibility against versioned state policy criteria cached in Redis; isolated so rule updates require zero code recoding.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Officer Approval Service:</strong> Manages district officer queues, enforces the 15-day SLA deadline, and records digitally timestamped approval/rejection remarks.
                    </div>
                  </div>
                </div>
              )}

              {(activeArchComponent === "queue" || activeArchComponent === "eventbridge") && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>📬 Tier 4: Pub/Sub / Message Queue (Core Decoupling Engine)</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                    <strong>Architectural Decoupling Rationale:</strong> Citizen Intake and Officer Approval are strictly decoupled using an asynchronous message queue:
                  </p>
                  <div className="grid grid-cols-3" style={{ gap: "12px", fontSize: "0.85rem" }}>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Pub/Sub Message Queue:</strong> Citizen Intake publishes submission events to the queue and acknowledges the citizen in &lt; 2 seconds without waiting for officer systems.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>FIFO Buffering:</strong> Orders applications strictly first-in-first-out under the Public Services Guarantee Act, smoothing out daytime traffic surges.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Notification Worker &amp; SMS:</strong> Consumes status change events asynchronously to dispatch SMS alerts via Telecom Gateway without blocking user requests.
                    </div>
                  </div>
                </div>
              )}

              {(activeArchComponent === "storage" || activeArchComponent === "rds" || activeArchComponent === "s3" || activeArchComponent === "redis") && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>💾 Tier 5: Storage &amp; Caching (S3, Relational Database &amp; Redis)</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                    Tri-partitioned storage tier engineered for ACID consistency, document durability, and microsecond caching:
                  </p>
                  <div className="grid grid-cols-3" style={{ gap: "12px", fontSize: "0.85rem" }}>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>S3 Object Storage:</strong> Secure storage for PDF and JPG proofs (&le; 2 MB). <strong>Permanently eliminates the 120 misplaced physical paper files/month baseline!</strong>
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Relational Database (PostgreSQL):</strong> ACID-compliant relational store for ration cards, citizen dossiers, family member rosters, and a 100% append-only immutable audit log.
                    </div>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px" }}>
                      <strong>Redis Cache:</strong> In-memory key-value cache storing active eligibility rules (sub-5ms rule checks) and 5-minute OTP sessions, offloading read load from the database.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Architectural Justification Cards */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <h3 style={{ marginTop: 0 }}>Architectural Quality Attributes &amp; Design Justification</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Key design principles addressing high-volume public sector intake constraints:
            </p>

            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              <div className="panel" style={{ background: "var(--card)", borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Software Modularity</span>
                <h4 style={{ margin: "0 0 8px" }}>Loose Coupling: Citizen Intake vs. Officer Approval</h4>
                <p style={{ fontSize: "0.88rem", lineHeight: "1.6", color: "var(--foreground)", margin: "0 0 10px" }}>
                  Intake and Officer Approval do not invoke each other via synchronous HTTP requests. Intake writes to PostgreSQL, uploads documents to S3 Object Storage, and fires a message into the Pub/Sub message queue.
                </p>
                <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem" }}>
                  <strong>Key Benefit:</strong> If the officer workflow is experiencing peak backlog or temporary maintenance, citizen application intake operates at 100% availability.
                </div>
              </div>

              <div className="panel" style={{ background: "var(--card)", borderLeft: "4px solid var(--ring)" }}>
                <span className="badge badge-default" style={{ marginBottom: "6px" }}>Single Responsibility</span>
                <h4 style={{ margin: "0 0 8px" }}>High Cohesion: Dedicated Functional Services</h4>
                <p style={{ fontSize: "0.88rem", lineHeight: "1.6", color: "var(--foreground)", margin: "0 0 10px" }}>
                  Each microservice is tightly focused on a single business concern: Intake handles only data capture; Rule Engine handles only eligibility logic; Approval handles only adjudication and remarks.
                </p>
                <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem" }}>
                  <strong>Key Benefit:</strong> State policy rule updates touch ONLY the Rule Engine schema without requiring re-testing or modifying the citizen intake forms.
                </div>
              </div>

              <div className="panel" style={{ background: "var(--card)", borderLeft: "4px solid green" }}>
                <span className="badge badge-success" style={{ marginBottom: "6px" }}>Root Cause Resolution</span>
                <h4 style={{ margin: "0 0 8px" }}>Zero Misplaced Files: Digital Dossier Immutability</h4>
                <p style={{ fontSize: "0.88rem", lineHeight: "1.6", color: "var(--foreground)", margin: "0 0 10px" }}>
                  Physical paper folders (where 3% of 4,000 monthly intake = 120 files were misplaced in office racks) are completely replaced by encrypted S3 object storage indexed by unique alphanumeric IDs (<code className="mono">RS-YYYY-NNNNNN</code>).
                </p>
                <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem" }}>
                  <strong>Key Benefit:</strong> 1,440 lost files saved every year; digital dossiers are immediately searchable and 100% auditable.
                </div>
              </div>

              <div className="panel" style={{ background: "var(--card)", borderLeft: "4px solid var(--primary)" }}>
                <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Adaptability</span>
                <h4 style={{ margin: "0 0 8px" }}>Zero-Downtime State Eligibility Updates</h4>
                <p style={{ fontSize: "0.88rem", lineHeight: "1.6", color: "var(--foreground)", margin: "0 0 10px" }}>
                  Rule parameters (income cutoffs, family size limits, required documents) are stored as JSON configuration records in PostgreSQL and cached in Redis, not hardcoded in server code.
                </p>
                <div style={{ background: "var(--muted)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem" }}>
                  <strong>Key Benefit:</strong> When the state cabinet issues a new Government Order, the admin publishes version <code className="mono">v2.0</code> via UI with zero code redeployment.
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Transformation: Legacy vs RationSeva Cloud */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <h3 style={{ marginTop: 0 }}>System Transformation: Legacy District Office vs. RationSeva Cloud</h3>
            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              <div className="panel" style={{ borderLeft: "4px solid var(--destructive)", background: "rgba(181, 74, 53, 0.03)" }}>
                <span className="badge badge-danger" style={{ marginBottom: "6px" }}>Before: Manual Physical Office</span>
                <h4 style={{ margin: "0 0 10px", color: "var(--destructive)" }}>Paper Registers &amp; Physical Visits</h4>
                <ul style={{ fontSize: "0.88rem", paddingLeft: "18px", margin: 0, lineHeight: "1.8" }}>
                  <li><strong>120 misplaced dossiers/month</strong> (3% of 4,000 monthly intake lost in racks).</li>
                  <li>Applicants travel 15–30 km multiple times for simple status checks.</li>
                  <li>Average disposal turnaround: <strong>25–35 days</strong> (chronic Public Service Act breach).</li>
                  <li>No audit trail of which clerk or officer held a pending file.</li>
                  <li>Manual eligibility checks prone to fraud, fake documents, and human bias.</li>
                </ul>
              </div>

              <div className="panel" style={{ borderLeft: "4px solid green", background: "rgba(42, 102, 46, 0.03)" }}>
                <span className="badge badge-success" style={{ marginBottom: "6px" }}>After: RationSeva Cloud HLD</span>
                <h4 style={{ margin: "0 0 10px", color: "green" }}>24/7 Digital Portal &amp; Event-Driven Workflow</h4>
                <ul style={{ fontSize: "0.88rem", paddingLeft: "18px", margin: 0, lineHeight: "1.8" }}>
                  <li><strong>Zero misplaced files:</strong> 100% digital dossiers encrypted in S3 Object Storage.</li>
                  <li>Instant SMS alerts on every stage &mdash; zero unnecessary travel for citizens.</li>
                  <li>Turnaround compressed to <strong>&le; 7 working days</strong> with automated SLA breach alerts.</li>
                  <li>100% immutable audit log with officer ID, IP address, and decision remarks.</li>
                  <li>Automated pre-submission BVA boundary validator stops fraud instantly.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UML Diagram Gallery */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-default" style={{ marginBottom: "4px" }}>Object-Oriented Software Design</span>
                <h3 style={{ margin: 0 }}>UML Design Package &amp; Diagram Showcase</h3>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Select a diagram to view the visual model and design rationale</span>
            </div>

            {/* Diagram Switcher Tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {[
                { id: "sequence", label: "Sequence Diagram (Add Member)", file: "/diagrams/sequence.png" },
                { id: "aws", label: "System Design (HLD) Architecture", file: "/diagrams/aws_architecture.png" },
                { id: "usecase", label: "Use Case Diagram", file: "/diagrams/usecase.png" },
                { id: "class", label: "Class Diagram", file: "/diagrams/class.png" },
                { id: "activity", label: "Activity Diagram (Adjudication)", file: "/diagrams/activity.png" },
                { id: "state", label: "State Machine (Request Lifecycle)", file: "/diagrams/state.png" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveUmlDiagram(d.id as any)}
                  className={`btn ${activeUmlDiagram === d.id ? "btn-primary" : "btn-outline"} btn-sm`}
                  style={{ fontSize: "0.85rem" }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Diagram Viewer */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden", background: "#fff", padding: "12px" }}>
              {activeUmlDiagram === "sequence" && (
                <div>
                  <div style={{ marginBottom: "8px", fontSize: "0.88rem", color: "var(--muted-foreground)" }}>
                    <strong>Sequence Diagram: 'Request Adding a Member to a Ration Card'</strong> &mdash; Traces synchronous boundary validation, asynchronous S3 document dispatch, EventBridge event publishing, and automated SMS worker dispatch.
                  </div>
                  <Image src="/diagrams/sequence.png" alt="Sequence Diagram" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
              {activeUmlDiagram === "aws" && (
                <div>
                  <div style={{ marginBottom: "8px", fontSize: "0.88rem", color: "var(--muted-foreground)" }}>
                    <strong>High-Level System Design (HLD) Architecture Diagram</strong> &mdash; 5-tier decoupled flow: Clients (Mobile &amp; Web) &rarr; CDN (CloudFront) &amp; Load Balancer / Reverse Proxy &rarr; Backend Application Services (Intake, Rule Engine, Approval) &rarr; Pub/Sub Queue &amp; SMS Gateway &rarr; S3 Object Storage, Relational DB (PostgreSQL), and Redis Cache.
                  </div>
                  <Image src="/diagrams/aws_architecture.png" alt="High-Level Design Architecture" width={1568} height={874} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
              {activeUmlDiagram === "usecase" && (
                <div>
                  <div style={{ marginBottom: "8px", fontSize: "0.88rem", color: "var(--muted-foreground)" }}>
                    <strong>Use Case Diagram</strong> &mdash; Actors (Citizen, Supply Clerk, Inspecting Officer, Policy Admin) with include/extend relationships for verification and SMS alerts.
                  </div>
                  <Image src="/diagrams/usecase.png" alt="Use Case Diagram" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
              {activeUmlDiagram === "class" && (
                <div>
                  <div style={{ marginBottom: "8px", fontSize: "0.88rem", color: "var(--muted-foreground)" }}>
                    <strong>Class Diagram</strong> &mdash; Domain entities (Citizen, RationCard, FamilyMember, ServiceRequest, DocumentProof, EligibilityRule, AuditEntry) with associations and navigability.
                  </div>
                  <Image src="/diagrams/class.png" alt="Class Diagram" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
              {activeUmlDiagram === "activity" && (
                <div>
                  <div style={{ marginBottom: "8px", fontSize: "0.88rem", color: "var(--muted-foreground)" }}>
                    <strong>Activity Diagram</strong> &mdash; Officer adjudication swimlane workflow covering document inspection, rule check, decision branch, and mandatory remarks capturing.
                  </div>
                  <Image src="/diagrams/activity.png" alt="Activity Diagram" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
              {activeUmlDiagram === "state" && (
                <div>
                  <div style={{ marginBottom: "8px", fontSize: "0.88rem", color: "var(--muted-foreground)" }}>
                    <strong>State Machine Diagram</strong> &mdash; Complete 7-state lifecycle: Draft &rarr; Submitted &rarr; Under Verification &rarr; Returned (with re-submission path) &rarr; Approved &rarr; Rejected &rarr; Card Issued.
                  </div>
                  <Image src="/diagrams/state.png" alt="State Machine Diagram" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RISKS & CHANGE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "risks" && (
        <div style={{ animation: "slideIn 0.25s ease" }}>
          {/* Header Panel */}
          <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Risk Management &amp; Change Control</span>
            <h2 style={{ marginTop: 0 }}>Risk Exposure Ranking Matrix &amp; 6-Step Rule Change Procedure</h2>
            <p style={{ color: "var(--foreground)", opacity: 0.9 }}>
              Formal risk management based on mathematical exposure (Probability &times; Impact) and post-go-live change control for adapting
              to State Government Orders (GOs) within the year without software recoding.
            </p>
          </div>

          {/* Interactive 2D Risk Exposure Matrix Grid */}
          <div className="panel" style={{ marginBottom: "28px", border: "2px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "4px" }}>Interactive 2D Heatmap Grid</span>
                <h3 style={{ margin: 0 }}>Risk Exposure Heatmap &amp; RMMM Response Plan</h3>
              </div>
              <span className="badge badge-default mono">Formula: Exposure = P &times; I</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Click any of the 4 operational risks below to highlight its quadrant position and view its concrete Risk Mitigation, Monitoring, and Management (RMMM) response plan:
            </p>

            {/* Risk Selection Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {[
                { id: 1, name: "1. Staff skill gaps", p: 0.6, i: 6, exp: 3.6, color: "var(--destructive)" },
                { id: 2, name: "2. Rule changes by state", p: 0.5, i: 7, exp: 3.5, color: "var(--destructive)" },
                { id: 3, name: "3. Fake documents", p: 0.3, i: 7, exp: 2.1, color: "var(--ring)" },
                { id: 4, name: "4. Server downtime", p: 0.2, i: 6, exp: 1.2, color: "green" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRiskPin(r.id)}
                  className={`btn ${selectedRiskPin === r.id ? "btn-primary" : "btn-outline"} btn-sm`}
                  style={{ fontSize: "0.85rem" }}
                >
                  <span>{r.name}</span>
                  <span className="badge badge-default mono" style={{ marginLeft: "4px" }}>Exp: {r.exp}</span>
                </button>
              ))}
            </div>

            {/* 2D Heatmap Visualization + RMMM Inspector */}
            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              {/* Left Column: Visual 2D Risk Heatmap */}
              <div className="panel" style={{ background: "var(--card)", padding: "18px" }}>
                <h4 style={{ margin: "0 0 12px", fontSize: "1rem" }}>Visual 2D Probability vs. Impact Coordinate Plane</h4>

                <div
                  style={{
                    position: "relative",
                    height: "260px",
                    background: "linear-gradient(135deg, rgba(42, 102, 46, 0.08) 0%, rgba(212, 200, 170, 0.25) 50%, rgba(181, 74, 53, 0.15) 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Top-right: High Risk */}
                  <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "0.75rem", fontWeight: 700, color: "var(--destructive)" }}>
                    HIGH EXPOSURE ZONE (Red)
                  </div>
                  {/* Bottom-left: Low Risk */}
                  <div style={{ position: "absolute", bottom: "10px", left: "12px", fontSize: "0.75rem", fontWeight: 700, color: "green" }}>
                    LOW EXPOSURE ZONE (Green)
                  </div>

                  {/* Risk Pin 1: Staff skill gaps (P=0.6, I=6) */}
                  <div
                    onClick={() => setSelectedRiskPin(1)}
                    style={{
                      position: "absolute",
                      left: "58%",
                      bottom: "58%",
                      transform: "translate(-50%, 50%)",
                      cursor: "pointer",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      background: selectedRiskPin === 1 ? "var(--destructive)" : "var(--card)",
                      color: selectedRiskPin === 1 ? "#fff" : "var(--destructive)",
                      border: "2px solid var(--destructive)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      transition: "all 0.15s ease",
                      zIndex: selectedRiskPin === 1 ? 10 : 2,
                    }}
                  >
                    🥇 Staff Gaps (3.6)
                  </div>

                  {/* Risk Pin 2: Rule changes (P=0.5, I=7) */}
                  <div
                    onClick={() => setSelectedRiskPin(2)}
                    style={{
                      position: "absolute",
                      left: "68%",
                      bottom: "48%",
                      transform: "translate(-50%, 50%)",
                      cursor: "pointer",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      background: selectedRiskPin === 2 ? "var(--destructive)" : "var(--card)",
                      color: selectedRiskPin === 2 ? "#fff" : "var(--destructive)",
                      border: "2px solid var(--destructive)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      transition: "all 0.15s ease",
                      zIndex: selectedRiskPin === 2 ? 10 : 2,
                    }}
                  >
                    🥈 Rule Changes (3.5)
                  </div>

                  {/* Risk Pin 3: Fake documents (P=0.3, I=7) */}
                  <div
                    onClick={() => setSelectedRiskPin(3)}
                    style={{
                      position: "absolute",
                      left: "68%",
                      bottom: "28%",
                      transform: "translate(-50%, 50%)",
                      cursor: "pointer",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      background: selectedRiskPin === 3 ? "var(--primary)" : "var(--card)",
                      color: selectedRiskPin === 3 ? "#fff" : "var(--primary)",
                      border: "2px solid var(--primary)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      transition: "all 0.15s ease",
                      zIndex: selectedRiskPin === 3 ? 10 : 2,
                    }}
                  >
                    🥉 Fake Docs (2.1)
                  </div>

                  {/* Risk Pin 4: Server downtime (P=0.2, I=6) */}
                  <div
                    onClick={() => setSelectedRiskPin(4)}
                    style={{
                      position: "absolute",
                      left: "58%",
                      bottom: "18%",
                      transform: "translate(-50%, 50%)",
                      cursor: "pointer",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      background: selectedRiskPin === 4 ? "green" : "var(--card)",
                      color: selectedRiskPin === 4 ? "#fff" : "green",
                      border: "2px solid green",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      transition: "all 0.15s ease",
                      zIndex: selectedRiskPin === 4 ? 10 : 2,
                    }}
                  >
                    #4 Downtime (1.2)
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                  <span>Impact &rarr; (Low = 1, High = 10)</span>
                  <span>Probability &uarr; (0.0 to 1.0)</span>
                </div>
              </div>

              {/* Right Column: RMMM Plan for Selected Risk */}
              <div className="panel" style={{ background: "var(--muted)", padding: "18px", borderLeft: "4px solid var(--primary)" }}>
                {selectedRiskPin === 1 && (
                  <div>
                    <span className="badge badge-danger" style={{ marginBottom: "6px" }}>Rank 1 &bull; Exposure = 3.6 (P=0.6, I=6)</span>
                    <h4 style={{ margin: "0 0 8px" }}>Staff Skill Gaps (Supply Office Clerks)</h4>
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                      <strong>Root Cause:</strong> Senior supply office clerks are accustomed to physical paper registers and possess limited computer skills.
                    </p>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", marginBottom: "10px" }}>
                      <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", color: "var(--primary)" }}>Mitigation &amp; Monitoring (RMMM):</strong>
                      <ul style={{ fontSize: "0.85rem", paddingLeft: "18px", margin: "6px 0 0", lineHeight: "1.6" }}>
                        <li>Design a high-contrast 3-step UI with large 18px font and vernacular Hindi/regional labels.</li>
                        <li>Deliver a mandatory hands-on 2-hour interactive training program (Task G, Days 39–44).</li>
                        <li>Supply laminated one-page cheat sheets on every clerk desk.</li>
                      </ul>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>Owner: Lead Business Analyst &amp; Training Officer</span>
                  </div>
                )}

                {selectedRiskPin === 2 && (
                  <div>
                    <span className="badge badge-danger" style={{ marginBottom: "6px" }}>Rank 2 &bull; Exposure = 3.5 (P=0.5, I=7)</span>
                    <h4 style={{ margin: "0 0 8px" }}>State Rule Changes Within the Year</h4>
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                      <strong>Root Cause:</strong> State Food &amp; Civil Supplies Department modifies BPL income ceilings, family size quotas, and required documents via Government Orders (GOs).
                    </p>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", marginBottom: "10px" }}>
                      <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", color: "var(--primary)" }}>Mitigation &amp; Monitoring (RMMM):</strong>
                      <ul style={{ fontSize: "0.85rem", paddingLeft: "18px", margin: "6px 0 0", lineHeight: "1.6" }}>
                        <li>Implement a Dynamic JSON Rule Engine with schema versioning (<code className="mono">v1.0 &rarr; v2.0</code>).</li>
                        <li>Policy Admin updates thresholds via web form without code recompilation.</li>
                        <li>In-flight applications continue with their submission-date rule version to prevent legal disputes.</li>
                      </ul>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>Owner: Lead Architect &amp; Policy Administrator</span>
                  </div>
                )}

                {selectedRiskPin === 3 && (
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Rank 3 &bull; Exposure = 2.1 (P=0.3, I=7)</span>
                    <h4 style={{ margin: "0 0 8px" }}>Fake / Forged Document Submissions</h4>
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                      <strong>Root Cause:</strong> Applicants uploading forged income certificates or duplicate Aadhaar numbers to obtain subsidized rations.
                    </p>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", marginBottom: "10px" }}>
                      <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", color: "var(--primary)" }}>Mitigation &amp; Monitoring (RMMM):</strong>
                      <ul style={{ fontSize: "0.85rem", paddingLeft: "18px", margin: "6px 0 0", lineHeight: "1.6" }}>
                        <li>Aadhaar Verhoeff algorithm verification + de-duplication cross-check against database.</li>
                        <li>PDF/JPG upload strict MIME-type checks; max 2 MB limits to prevent malicious payloads.</li>
                        <li>Mandatory visual document inspection checklist before officer approval.</li>
                      </ul>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>Owner: Security Lead &amp; Inspecting Officer</span>
                  </div>
                )}

                {selectedRiskPin === 4 && (
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: "6px" }}>Rank 4 &bull; Exposure = 1.2 (P=0.2, I=6)</span>
                    <h4 style={{ margin: "0 0 8px" }}>Server Downtime &amp; Infrastructure Outages</h4>
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6", margin: "0 0 12px" }}>
                      <strong>Root Cause:</strong> Cloud instance failure or network degradation in state data center.
                    </p>
                    <div style={{ background: "var(--card)", padding: "12px", borderRadius: "4px", border: "1px solid var(--border)", marginBottom: "10px" }}>
                      <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", color: "var(--primary)" }}>Mitigation &amp; Monitoring (RMMM):</strong>
                      <ul style={{ fontSize: "0.85rem", paddingLeft: "18px", margin: "6px 0 0", lineHeight: "1.6" }}>
                        <li>Dual-Availability Zone redundancy (AWS AZ-1a &amp; AZ-1b).</li>
                        <li>Auto-scaling ECS Fargate container tasks with ALB health checks.</li>
                        <li>Amazon RDS Multi-AZ automatic failover in &le; 60 seconds.</li>
                      </ul>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>Owner: DevOps Lead &amp; Cloud Architect</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive 6-Step Rule Change Pipeline */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-default" style={{ marginBottom: "4px" }}>Post-Go-Live Change Control</span>
                <h3 style={{ margin: 0 }}>Interactive 6-Step State Rule Change Pipeline</h3>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Click each step to trace how a real Government Order (G.O.) is handled</span>
            </div>

            {/* Stepper Buttons */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {[
                { step: 1, label: "1. Capture" },
                { step: 2, label: "2. Understand Reason" },
                { step: 3, label: "3. Analyze Impact" },
                { step: 4, label: "4. Decide (CCB)" },
                { step: 5, label: "5. Update Plan" },
                { step: 6, label: "6. Implement & Verify" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveChangeStep(s.step)}
                  className={`btn ${activeChangeStep === s.step ? "btn-primary" : "btn-outline"} btn-sm`}
                  style={{ fontSize: "0.85rem" }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Step Spotlight Card */}
            <div className="panel" style={{ background: "var(--muted)", borderLeft: "4px solid var(--primary)", padding: "18px" }}>
              {activeChangeStep === 1 && (
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Step 1: Capture Change Request (CR Intake)</h4>
                  <p style={{ fontSize: "0.88rem", margin: "0 0 10px" }}>
                    The District Supply Officer receives official circular <strong>G.O. Ms. No. 142/FCS/2026</strong> from the State Secretariat: <em>&ldquo;BPL Annual Income ceiling revised from ₹1,00,000 to ₹1,50,000 with immediate effect.&rdquo;</em>
                  </p>
                  <div style={{ background: "var(--card)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}>
                    Change Request Logged: CR-2026-042 | Category: Regulatory Policy | Requester: State Dept | Date: 2026-10-04
                  </div>
                </div>
              )}
              {activeChangeStep === 2 && (
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Step 2: Understand the Underlying Reason</h4>
                  <p style={{ fontSize: "0.88rem", margin: "0 0 10px" }}>
                    The Change Control Board confirms legal authenticity of the Government Order. Purpose: Expand subsidized food security to low-income agricultural laborers following the State Minimum Wage hike.
                  </p>
                  <div style={{ background: "var(--card)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem" }}>
                    <strong>Verification:</strong> Gazette Notification verified by District Legal Officer; signed off as mandatory statutory compliance.
                  </div>
                </div>
              )}
              {activeChangeStep === 3 && (
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Step 3: Multi-Dimensional Impact Analysis</h4>
                  <p style={{ fontSize: "0.88rem", margin: "0 0 10px" }}>
                    Lead Architect and Project Manager evaluate the change across 4 software dimensions:
                  </p>
                  <div className="grid grid-cols-2" style={{ gap: "10px", fontSize: "0.82rem" }}>
                    <div style={{ background: "var(--card)", padding: "8px", borderRadius: "4px" }}>
                      <strong>Scope:</strong> Modify JSON rule schema (<code className="mono">incomeCeilingBPL: 150000</code>).
                    </div>
                    <div style={{ background: "var(--card)", padding: "8px", borderRadius: "4px" }}>
                      <strong>Time:</strong> 4 hours total (1h config, 2h staging tests, 1h deployment).
                    </div>
                    <div style={{ background: "var(--card)", padding: "8px", borderRadius: "4px" }}>
                      <strong>Cost:</strong> ₹0 additional cost (covered under standard warranty).
                    </div>
                    <div style={{ background: "var(--card)", padding: "8px", borderRadius: "4px" }}>
                      <strong>Quality / In-Flight:</strong> Grandfather existing submitted requests under v1.0.
                    </div>
                  </div>
                </div>
              )}
              {activeChangeStep === 4 && (
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Step 4: Formal CCB Decision &amp; Approval</h4>
                  <p style={{ fontSize: "0.88rem", margin: "0 0 10px" }}>
                    Change Control Board (District Supply Officer + Lead Architect + Quality Lead) convenes and formally signs approval:
                  </p>
                  <div style={{ background: "var(--card)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem" }}>
                    <strong>CCB Verdict:</strong> <span className="badge badge-success">APPROVED</span> &mdash; Scheduled for production release during evening maintenance window (22:00 IST).
                  </div>
                </div>
              )}
              {activeChangeStep === 5 && (
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Step 5: Update Project Schedule &amp; Documentation</h4>
                  <p style={{ fontSize: "0.88rem", margin: "0 0 10px" }}>
                    Rule version incremented from <code className="mono">v1.2</code> to <code className="mono">v2.0</code> in the System Configuration Baseline. Traceability matrix updated linking G.O. No. 142 to Decision Table DT-01.
                  </p>
                </div>
              )}
              {activeChangeStep === 6 && (
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Step 6: Implement, Smoke Test &amp; Live Verification</h4>
                  <p style={{ fontSize: "0.88rem", margin: "0 0 10px" }}>
                    Policy Admin enters updated threshold via Admin UI. Staging BVA tests pass. Production rule published with zero downtime:
                  </p>
                  <div style={{ background: "var(--card)", padding: "10px", borderRadius: "4px", fontSize: "0.82rem", color: "green" }}>
                    ✅ Live Verification Complete: Candidate with ₹1,40,000 annual income now successfully qualifies for BPL card. Automated SMS notification dispatched.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TESTING, BVA & DRE METRICS */}
      {/* ========================================================================= */}
      {activeTab === "qa" && (
        <div style={{ animation: "slideIn 0.25s ease" }}>
          {/* Header Panel */}
          <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Quality Engineering &amp; Verification</span>
            <h2 style={{ marginTop: 0 }}>Interactive BVA Sandbox, Decision Tables &amp; DRE Metrics</h2>
            <p style={{ color: "var(--foreground)", opacity: 0.9 }}>
              Formal verification using Boundary Value Analysis (BVA), Equivalence Partitioning (EP), and decision tables for all five request types, proving Defect Removal Efficiency (DRE) of <strong>90.0%</strong>.
            </p>
          </div>

          {/* Interactive BVA Sandbox */}
          <div className="panel" style={{ marginBottom: "28px", border: "2px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "4px" }}>QA Verification &amp; Validation Lab</span>
                <h3 style={{ margin: 0 }}>Live Boundary Value Analysis (BVA) Interactive Sandbox</h3>
              </div>
              <span className="badge badge-default mono">Test Min, Min+1, Nom, Max-1, Max, Out-of-Bounds</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Test inputs dynamically to evaluate boundary conditions and equivalence partitions:
            </p>

            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              {/* Sandbox 1: Family Member Count (1 to 15) */}
              <div className="panel" style={{ background: "var(--muted)" }}>
                <h4 style={{ margin: "0 0 8px" }}>Field 1: Family Member Count (Valid: 1 to 15)</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 12px" }}>
                  Valid boundary: 1 &le; Member Count &le; 15. Type or select a test value:
                </p>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <input
                    type="number"
                    value={bvaMemberCount}
                    onChange={(e) => setBvaMemberCount(parseInt(e.target.value) || 0)}
                    className="input mono"
                    style={{ width: "100px", padding: "8px 12px", fontSize: "1.1rem", fontWeight: 700 }}
                  />
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {[0, 1, 2, 7, 14, 15, 16].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBvaMemberCount(num)}
                        className={`btn ${bvaMemberCount === num ? "btn-primary" : "btn-outline"} btn-sm`}
                        style={{ padding: "4px 8px", fontSize: "0.78rem" }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="panel" style={{ background: "var(--card)", padding: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Boundary Classification:</span>
                    <span className={`badge ${bvaMemberResult.badge}`}>{bvaMemberResult.status}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
                    {bvaMemberResult.category}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                    {bvaMemberResult.message}
                  </div>
                </div>
              </div>

              {/* Sandbox 2: Annual Household Income */}
              <div className="panel" style={{ background: "var(--muted)" }}>
                <h4 style={{ margin: "0 0 8px" }}>Field 2: Annual Income (Scheme Cutoffs)</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "0 0 12px" }}>
                  Ceilings: AAY &le; ₹1L, PHH &le; ₹2.5L, NPHH &le; ₹10L. Type an income:
                </p>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <input
                    type="number"
                    step="25000"
                    value={bvaIncome}
                    onChange={(e) => setBvaIncome(parseInt(e.target.value) || 0)}
                    className="input mono"
                    style={{ width: "140px", padding: "8px 12px", fontSize: "1.1rem", fontWeight: 700 }}
                  />
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {[
                      { label: "₹0", val: 0 },
                      { label: "₹1L", val: 100000 },
                      { label: "₹2.5L", val: 250000 },
                      { label: "₹10L", val: 1000000 },
                      { label: "₹12L", val: 1200000 },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => setBvaIncome(btn.val)}
                        className={`btn ${bvaIncome === btn.val ? "btn-primary" : "btn-outline"} btn-sm`}
                        style={{ padding: "4px 8px", fontSize: "0.78rem" }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="panel" style={{ background: "var(--card)", padding: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.78rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Allocated Scheme:</span>
                    <span className={`badge ${bvaIncomeResult.badge}`}>{bvaIncomeResult.status}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
                    {bvaIncomeResult.scheme}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                    Partition: {bvaIncomeResult.category}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive DRE & Defect Density Calculator */}
          <div className="panel" style={{ marginBottom: "28px", border: "2px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "4px" }}>Interactive Metric Simulation</span>
                <h3 style={{ margin: 0 }}>Defect Removal Efficiency (DRE) &amp; Defect Density Lab</h3>
              </div>
              <span className="badge badge-default mono">Formula: DRE = E / (E + D) &ge; 85% Target</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Adjust pre-release ($E$) and post-release ($D$) defects to test compliance against the industry benchmark $\ge 85\%$ target:
            </p>

            <div className="grid grid-cols-2" style={{ gap: "20px", marginBottom: "16px" }}>
              {/* Pre-Release Slider */}
              <div className="panel" style={{ background: "var(--muted)", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    Pre-Release Defects Found ($E$): <span className="mono" style={{ color: "green", fontSize: "1.1rem" }}>{drePreRelease}</span>
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>(Reviews, QA, UAT)</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="80"
                  value={drePreRelease}
                  onChange={(e) => setDrePreRelease(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "green" }}
                />
              </div>

              {/* Post-Release Slider */}
              <div className="panel" style={{ background: "var(--muted)", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    Post-Release Defects in 30 Days ($D$): <span className="mono" style={{ color: "var(--destructive)", fontSize: "1.1rem" }}>{drePostRelease}</span>
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>(Production Incidents)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={drePostRelease}
                  onChange={(e) => setDrePostRelease(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--destructive)" }}
                />
              </div>
            </div>

            {/* DRE Output Dashboard */}
            <div className="grid grid-cols-3" style={{ gap: "16px" }}>
              <div className="panel" style={{ background: "var(--card)", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Computed DRE Metric</div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: isDrePassing ? "green" : "var(--destructive)",
                    margin: "4px 0",
                  }}
                >
                  {calculatedDre}%
                </div>
                <span className={`badge ${isDrePassing ? "badge-success" : "badge-danger"}`}>
                  {isDrePassing ? "PASSES STATUTORY TARGET (≥ 85%)" : "FAILED TARGET (< 85%)"}
                </span>
              </div>

              <div className="panel" style={{ background: "var(--card)", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Total Project Defects</div>
                <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-mono)", margin: "4px 0" }}>
                  {drePreRelease + drePostRelease}
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                  {drePreRelease} caught early + {drePostRelease} in production
                </span>
              </div>

              <div className="panel" style={{ background: "var(--card)", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted-foreground)" }}>Defect Density (12 KLOC)</div>
                <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary)", margin: "4px 0" }}>
                  {((drePreRelease + drePostRelease) / 12).toFixed(1)}
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                  Defects per Thousand Lines of Code
                </span>
              </div>
            </div>
          </div>

          {/* Decision Table DT-02 (Add Member) */}
          <div className="panel" style={{ marginBottom: "28px" }}>
            <h3 style={{ marginTop: 0 }}>Decision Table DT-02: Eligibility Rules for 'Add Member' Request</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
              Exhaustive combinatorial testing covering member quota (1–15), Aadhaar uniqueness, birth proof validity, and active card status:
            </p>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rule Condition</th>
                    <th>Rule 1 (Pass)</th>
                    <th>Rule 2 (Max Exceeded)</th>
                    <th>Rule 3 (No Proof)</th>
                    <th>Rule 4 (Duplicate Aadhaar)</th>
                    <th>Rule 5 (Card Inactive)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>C1: Active Ration Card?</td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><strong className="mono" style={{ color: "var(--destructive)" }}>N</strong></td>
                  </tr>
                  <tr>
                    <td>C2: Existing Family Members &lt; 15?</td>
                    <td><span className="mono">Y</span></td>
                    <td><strong className="mono" style={{ color: "var(--destructive)" }}>N (Count=15)</strong></td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                  </tr>
                  <tr>
                    <td>C3: Valid Proof of Relationship?</td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><strong className="mono" style={{ color: "var(--destructive)" }}>N</strong></td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                  </tr>
                  <tr>
                    <td>C4: Aadhaar Not in Any Other Card?</td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><span className="mono">Y</span></td>
                    <td><strong className="mono" style={{ color: "var(--destructive)" }}>N (Duplicate)</strong></td>
                    <td><span className="mono">Y</span></td>
                  </tr>
                  <tr style={{ background: "rgba(166, 124, 82, 0.08)", fontWeight: 700 }}>
                    <td>Action / Outcome</td>
                    <td><span className="badge badge-success">Approved &amp; Card Updated</span></td>
                    <td><span className="badge badge-danger">Reject: Quota Limit 15 Reached</span></td>
                    <td><span className="badge badge-warning">Return: Proof Missing</span></td>
                    <td><span className="badge badge-danger">Reject: Duplicate Aadhaar</span></td>
                    <td><span className="badge badge-danger">Reject: Card Inactive</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DOWNLOAD FORMAL DOCUMENTS (.DOCX) */}
      {/* ========================================================================= */}
      {activeTab === "downloads" && (
        <div style={{ animation: "slideIn 0.25s ease" }}>
          {/* Header Panel */}
          <div className="panel" style={{ marginBottom: "28px", borderLeft: "4px solid var(--primary)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "6px" }}>Engineering Deliverables</span>
            <h2 style={{ marginTop: 0 }}>Official Engineering Documentation Package (.docx)</h2>
            <p style={{ color: "var(--foreground)", opacity: 0.9 }}>
              All 6 formal engineering specifications compiled in standardized Microsoft Word format with formal executive title pages,
              tables of contents, embedded high-resolution diagrams, and industry references ready for regulatory review and technical audits.
            </p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: "20px" }}>
            {[
              {
                title: "Software Requirements Specification (SRS)",
                file: "RationSeva_SRS.docx",
                size: "917 words | 7 pages",
                standard: "IEEE 830-1998",
                desc: "11 functional requirements, 6 strictly measurable NFRs (availability 99.5%, auditability 100%, usability <=90s), MoSCoW prioritization, and complete requirements traceability matrix (RTM).",
                badge: "badge-primary",
              },
              {
                title: "Business Requirements Document (BRD)",
                file: "RationSeva_BRD.docx",
                size: "1,919 words | 12 pages",
                standard: "BABOK Guide v3",
                desc: "Problem formulation, baseline 120 misplaced files/month elimination, 4 stakeholder interview profiles, process maps (AS-IS vs TO-BE), and 5-stream service level agreements (SLAs).",
                badge: "badge-primary",
              },
              {
                title: "Statement of Work & Project Plan (SOW)",
                file: "RationSeva_SOW.docx",
                size: "2,011 words | 14 pages",
                standard: "PMBOK 7th Edition",
                desc: "Work Breakdown Structure (WBS), CPM forward/backward pass, 44 working days critical path, 11-day Task C float proof, resource leveling, and Gantt milestone schedule.",
                badge: "badge-primary",
              },
              {
                title: "UML Software Architecture Package",
                file: "RationSeva_UML.docx",
                size: "383 words + 5 diagrams",
                standard: "OMG UML 2.5",
                desc: "Use case, class, sequence (Add Member), activity, and state machine diagrams with formal justifications of loose coupling and high cohesion across intake and officer approval.",
                badge: "badge-default",
              },
              {
                title: "Change Management Procedure",
                file: "RationSeva_Change_Management.docx",
                size: "484 words + flowchart",
                standard: "ITIL v4 Change Control",
                desc: "6-step rule change workflow for absorbing state eligibility updates within the year without code recoding, CCB approval hierarchy, and change log template.",
                badge: "badge-default",
              },
              {
                title: "Test Plan, Boundary Cases & DRE Evidence",
                file: "RationSeva_Test_Plan.docx",
                size: "1,123 words | 8 pages",
                standard: "IEEE 829 Standard",
                desc: "Boundary Value Analysis (member count 1–15, income), equivalence partitioning, decision tables for 5 request types, defect log, and 90.0% Defect Removal Efficiency (DRE) proof.",
                badge: "badge-primary",
              },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="panel interactive"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className={`badge ${doc.badge}`}>{doc.standard}</span>
                    <span className="mono" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{doc.size}</span>
                  </div>
                  <h3 style={{ margin: "0 0 10px", fontSize: "1.15rem" }}>{doc.title}</h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", margin: "0 0 16px", lineHeight: "1.6" }}>
                    {doc.desc}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                    {doc.file}
                  </span>
                  <a
                    href={`/docs/${doc.file}`}
                    download
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <span>📥</span>
                    <span>Download .docx</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
