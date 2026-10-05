"""Generates SRS, BRD and SOW for RationSeva (concise, exam-ready)."""
from common import *

# ---------------- Shared data (single source of truth) ----------------
FRS = [
    ("FR-01", "Citizens and staff shall log in using mobile number + 6-digit OTP; role-based menus (Citizen / Officer / Admin).", "Must", "UC1", "TC-01, TC-02"),
    ("FR-02", "Citizen shall submit a request for any of 5 types: New Card, Add Member, Remove Member, Address Change, Duplicate Card.", "Must", "UC2", "TC-03"),
    ("FR-03", "System shall accept document upload (PDF/JPG, max 2 MB each) and list mandatory documents per request type.", "Must", "UC3", "TC-04, TC-05"),
    ("FR-04", "System shall auto-check eligibility (income, member count, duplicate Aadhaar) using the active rule version before submission.", "Must", "UC10", "TC-06 to TC-12"),
    ("FR-05", "System shall generate a unique Request ID (RS-YYYY-NNNNNN) and on-screen acknowledgement on submission.", "Must", "UC2", "TC-13"),
    ("FR-06", "Citizen shall track status by Request ID showing a dated timeline of every state change.", "Must", "UC4", "TC-14"),
    ("FR-07", "Officer shall view a review queue (oldest first) and Approve / Reject / Return a request; remarks mandatory for Reject/Return.", "Must", "UC5, UC6", "TC-15, TC-16"),
    ("FR-08", "System shall send an SMS to the applicant on Submitted, Returned, Approved, Rejected and Card Issued events.", "Must", "UC9", "TC-17"),
    ("FR-09", "Admin shall create a new version of eligibility rules (limits, documents) with an effective date, without code change.", "Must", "UC7", "TC-18"),
    ("FR-10", "System shall provide reports: requests by type/status, pending > SLA (15 days), officer-wise disposal.", "Should", "UC8", "TC-19"),
    ("FR-11", "Citizen shall download a PDF acknowledgement / approval letter.", "Could", "UC4", "TC-20"),
]

NFRS = [
    ("NFR-01", "Availability", "Portal uptime >= 99.5% per month (<= 3.6 h unplanned downtime); planned maintenance only 11 PM–5 AM.", "Monthly uptime monitor report", "Must"),
    ("NFR-02", "Auditability", "100% of create/status/rule changes logged with user ID, timestamp, old & new value; logs read-only and retained 7 years.", "Audit sample of 50 random requests – 0 gaps", "Must"),
    ("NFR-03", "Usability (staff)", "A staff member with basic skills can process (open → decide) a request in <= 5 min after <= 2 h training; SUS score >= 70.", "Timed UAT with 10 staff + SUS survey", "Must"),
    ("NFR-04", "Usability (citizen)", "First-time citizen completes a request in <= 10 min; status reachable in <= 3 clicks from home page.", "Usability test with 20 citizens", "Must"),
    ("NFR-05", "Performance", "95% of pages load in <= 3 s on 4G with 200 concurrent users; 95% of SMS delivered within 60 s.", "JMeter load test; SMS gateway report", "Should"),
    ("NFR-06", "Security / Modifiability", "TLS 1.2+, OTP expiry 5 min, role-based access; a state rule change is live within 1 working day via Admin screen (no redeploy).", "Pen-test report; rule-change drill", "Must"),
]

TASKS = [  # id, name, dur, preds, ES, EF, LS, LF, float
    ("A", "Requirements", 6, "-", 0, 6, 0, 6, 0),
    ("B", "Service rules for 5 request types", 8, "A", 6, 14, 6, 14, 0),
    ("C", "Application portal", 14, "A", 6, 20, 17, 31, 11),
    ("D", "Officer approval workflow", 12, "B", 14, 26, 14, 26, 0),
    ("E", "Status & SMS", 5, "D", 26, 31, 26, 31, 0),
    ("F", "Testing", 8, "C, E", 31, 39, 31, 39, 0),
    ("G", "Staff training", 5, "F", 39, 44, 39, 44, 0),
]


# =============================== SRS ===============================
def srs():
    d = new_doc("Software Requirements Specification (SRS)", "IEEE 830 format")
    h(d, "1. Introduction")
    para(d, "Define what RationSeva must do so the District Supply Office (DSO) can take ration card service requests online, track them and approve them.", "Purpose: ")
    para(d, "Online applications for 5 request types, document upload, eligibility check, officer approval, status tracking and SMS alerts. About 4,000 requests a month.", "Scope: ")
    para(d, "Online payment, a mobile app, and integration with the PDS fair-price shop system (Won't have in this release).", "Out of scope: ")
    table(d, ["Term", "Meaning"], [
        ("DSO", "District Supply Office"), ("PHH / NPHH", "Priority / Non-priority household card"),
        ("SLA", "Service Level Agreement – 15 days per request"), ("OTP", "One-Time Password via SMS"),
        ("MoSCoW", "Must / Should / Could / Won't priority"),
    ], widths=[1.4, 5])

    h(d, "2. Overall Description")
    para(d, "A new web portal that replaces paper files and Excel registers. It uses an external SMS gateway and is hosted in the State Data Centre.", "Product perspective: ")
    table(d, ["User class", "Needs"], [
        ("Citizen", "Apply from home, upload documents, know the status without visiting the office"),
        ("Supply office staff", "Simple screens, few clicks (limited computer skills)"),
        ("Supply Officer", "Review queue, approve/reject, SLA view"),
        ("State department / Admin", "Change eligibility rules quickly, see reports"),
    ], widths=[1.8, 4.6])
    h(d, "Constraints & Assumptions", 2)
    bullets(d, [
        "Staff have limited computer skills, so the UI needs large buttons, plain English and at most 3 steps per task.",
        "The state will change eligibility rules within the year, so rules must be data-driven and versioned (not hard-coded).",
        "Hosting on the State Data Centre; must comply with the IT Act 2000 and Aadhaar data-handling rules.",
        "Fixed timeline of 44 working days (see SOW).",
        "Assumption: citizens have a mobile phone to receive OTP and SMS.",
    ])

    h(d, "3. Requirements Elicitation (summary)")
    table(d, ["Stakeholder", "Technique", "Key finding"], [
        ("Citizens (15)", "Interviews at help desk", "2–4 office visits per request; no way to know status"),
        ("Supply office staff (6)", "Interview + observation", "Files misplaced; manual Excel register; low IT comfort"),
        ("Officers (2)", "Interview", "Need a queue sorted by age and the ability to send a request back"),
        ("State department", "Interview + circulars", "Income limits and documents change by government order"),
        ("Existing forms & spreadsheets", "Document analysis", "Fields: card no., members, income, address, documents"),
    ], widths=[1.6, 1.7, 3.2])
    para(d, "4,000 requests a month × 3% = 120 misplaced files a month. Removing paper files is the main business driver.", "Baseline problem: ")

    h(d, "4. Functional Requirements")
    table(d, ["ID", "Requirement", "MoSCoW"], [(f[0], f[1], f[2]) for f in FRS], widths=[0.7, 5.0, 0.8])

    h(d, "5. Non-Functional Requirements (all measurable)")
    table(d, ["ID", "Category", "Measurable target", "Verified by", "MoSCoW"], NFRS, widths=[0.6, 1.0, 2.9, 1.4, 0.6])

    h(d, "6. MoSCoW Summary & Justification")
    table(d, ["Priority", "Items", "Justification"], [
        ("Must", "FR-01–09, NFR-01–04, 06", "Core service; without these, office visits and misplaced files continue"),
        ("Should", "FR-10, NFR-05", "Helps management but the go-live does not depend on them"),
        ("Could", "FR-11", "Nice for citizens; the SMS already confirms the outcome"),
        ("Won't (now)", "Online payment, mobile app, PDS integration", "Not needed for the problem; planned for phase 2"),
    ], widths=[1, 2.2, 3.3])

    h(d, "7. Traceability Matrix (FR → Use Case → Test Case)")
    table(d, ["FR", "Use case", "Test case(s)", "Priority"], [(f[0], f[3], f[4], f[2]) for f in FRS], widths=[0.9, 1.4, 2.4, 1])
    save(d, "RationSeva_SRS.docx")


# =============================== BRD ===============================
def brd():
    d = new_doc("Business Requirements Document (BRD)", "Comprehensive Business Problem, Objectives, KPIs, Scope & Operational Strategy")
    
    h(d, "1. Executive Summary & Business Context")
    para(d, "The District Supply Office (DSO) operates under the Department of Food, Civil Supplies and Consumer Protection. It is the nodal administrative agency responsible for issuing, maintaining, and updating ration cards under the National Food Security Act (NFSA) and state public distribution mandates. Ration cards serve as both a statutory identity/residence credential and the primary instrument enabling subsidized essential foodgrains for priority and general households.", "Institutional Context: ")
    para(d, "Currently, all citizen service interactions, document verification, quota evaluations, and approval workflows are performed using manual physical paper dossiers and legacy, unlinked spreadsheets. This manual paradigm creates severe administrative friction, unacceptable processing delays, file loss, and citizen distress.", "Problem Context: ")

    h(d, "2. Problem Statement & Baseline Operational Metrics")
    para(d, "The district handles approximately 4,000 ration card service requests every month across five distinct service streams. The operational realities of this manual volume are characterized by four acute systemic failure points:", "Volume Breakdown: ")
    table(d, ["Service Stream", "Monthly Volume", "% Total", "Current Handling Mechanism", "Key Bottleneck"], [
        ("New Ration Card Issuance", "1,200", "30%", "Physical multi-page form + physical attachments", "Manual residence enquiry & eligibility check"),
        ("Adding Family Member", "1,000", "25%", "Physical application + birth/marriage cert", "Risk of exceeding family quota (15 members)"),
        ("Removing Family Member", "400", "10%", "Physical application + death/migration proof", "Manual verification of remaining members >= 1"),
        ("Address / FPS Change", "800", "20%", "Physical application + new electricity/rent bill", "Boundary verification within same district"),
        ("Duplicate Card Issuance", "600", "15%", "Affidavit/FIR submission + ledger search", "Manual search through old paper registers"),
        ("Total Monthly Volume", "4,000", "100%", "Paper files moved by hand between desks", "High administrative overhead"),
    ], widths=[1.5, 0.7, 0.6, 1.8, 1.8], font=8.5)

    bullets(d, [
        ("The Misplaced File Crisis (120 files/month): ", "Exactly 3% of all physical requests are misplaced, lost in transit between clerical desks and officer chambers, or filed under incorrect serial numbers. With 4,000 monthly requests, this results in 120 misplaced files every month (1,440 files annually). Each misplaced file requires complete re-application, manual dossier reconstruction, citizen distress, and severe audit vulnerability."),
        ("Excessive Citizen Footfall (2.8 to 4 visits per request): ", "Due to lack of transparent status tracking, citizens must travel to the DSO multiple times: (1) Form collection and requirement enquiry, (2) Application and document submission, (3) Mid-process status enquiries or rectifying unnoticed document defects, and (4) Collecting the physical card or endorsement. This imposes heavy wage loss and travel expenditure on economically vulnerable families."),
        ("Operational Constraints of Supply Staff: ", "DSO clerical staff have limited computer literacy and keyboard proficiency. Systems requiring complex multi-window navigation or cryptic technical inputs inevitably fail or lead to shadow paper books. The UI must therefore be high-contrast, large-font, and structured in at most 3 intuitive steps."),
        ("Impending State Rule Changes: ", "State eligibility guidelines (such as household annual income thresholds, document mandates, and category quotas) are subject to revision by Government Orders (GO) within the year. Hard-coded software logic would require costly and slow developer redeployments; rules must therefore be data-driven and version-controlled."),
    ])

    h(d, "3. Current State (As-Is) vs. Future State (To-Be) Analysis")
    para(d, "The transition from the legacy paper-and-spill register environment to the RationSeva digital portal is summarized across seven operational dimensions:")
    table(d, ["Operational Dimension", "Current State (As-Is)", "Target State (To-Be)", "Business Impact / Value"], [
        ("Application Intake", "Physical queue at DSO counter; paper forms and photocopies", "Online self-service portal + mobile OTP login", "Eliminates counter congestion; 24x7 submission"),
        ("Document Handling", "Photocopies stapled to physical dossier; physical storage", "Direct digital upload (PDF/JPG, max 2 MB per file)", "Eliminates paper storage; zero dossier misplacement"),
        ("Eligibility Evaluation", "Manual inspection of income slips by dealing clerk", "Automated pre-submission validation via Rule Engine", "Prevents invalid applications before entering queue"),
        ("Work Distribution", "Paper files stacked on desks; vulnerable to cherry-picking", "Centralized digital queue sorted strictly by FIFO & SLA", "Guaranteed fairness; oldest applications reviewed first"),
        ("Adjudication", "Pen endorsement in ledger; unrecorded verbal rejections", "Digital Approve/Reject/Return with mandatory remarks", "Complete accountability; transparent citizen recourse"),
        ("Status Transparency", "Nil; citizens must visit DSO physically to ask clerks", "Real-time online tracking + automated SMS at every milestone", "Reduces physical visits from ~3 to <= 0.2 per request"),
        ("Policy Updates", "Circulars manually interpreted; months of inconsistent rules", "Admin screen with versioned rules & effective dates", "Rule change live within 1 working day; zero code change"),
    ], widths=[1.2, 1.7, 1.8, 1.7], font=8.0)

    h(d, "4. Business Objectives & Measurable Target KPIs")
    para(d, "The success of the RationSeva implementation will be evaluated against strict, quantifiable metrics monitored over 6-month and 12-month post-go-live intervals:")
    table(d, ["Business Objective", "Metric & Baseline (As-Is)", "6-Month Target", "12-Month Target", "Verification Method"], [
        ("Eliminate File Loss", "120 misplaced files/month (3% of 4,000)", "0 lost files (100% digital)", "0 lost files (100% digital)", "Monthly digital audit log vs physical grievance log"),
        ("Reduce Citizen Footfall", "2.8 to 4 physical visits per request", "<= 0.5 visits per request", "<= 0.2 visits (exceptions only)", "Citizen entry register & helpdesk survey"),
        ("Statutory SLA Compliance", "Average TAT: 32 days; 42% breaches", ">= 90% decided in <= 15 days", ">= 98% decided in <= 15 days", "Automated SLA tracking report in portal MIS"),
        ("Communication Transparency", "0% automated notifications", "100% status updates triggered", "100% status updates triggered", "SMS gateway delivery receipts & logs"),
        ("Policy Evolution Agility", "4 to 6 weeks manual implementation", "<= 1 working day via admin UI", "<= 4 hours via admin UI", "Rule change drill timestamp logs"),
        ("Staff Processing Efficiency", "18 minutes manual handling per file", "<= 5 minutes per application", "<= 3.5 minutes per application", "Time-and-motion study during officer sessions"),
    ], widths=[1.3, 1.4, 1.2, 1.2, 1.3], font=8.0)

    h(d, "5. Comprehensive Stakeholder Analysis & RACI Matrix")
    para(d, "RACI definitions: R = Responsible for execution; A = Accountable for final approval; C = Consulted for domain input; I = Informed of status.")
    table(d, ["Project / Operational Activity", "Citizen", "Dealing Staff", "Supply Officer", "District Supply Officer", "State Dept", "IT Vendor"], [
        ("Requirements Sign-Off & Baseline", "C", "C", "C", "A", "C", "R"),
        ("Eligibility Rule Definition & GOs", "I", "I", "C", "C", "A", "R"),
        ("Application & Document Intake", "R", "I", "I", "A", "I", "A"),
        ("Automated Eligibility Evaluation", "I", "I", "I", "A", "I", "R"),
        ("Document Verification & Adjudication", "I", "R", "A", "A", "I", "I"),
        ("Policy & Rule Change Administration", "I", "I", "C", "A", "C", "R"),
        ("UAT & Operational Sign-Off", "C", "R", "R", "A", "I", "R"),
    ], widths=[2.0, 0.7, 0.7, 0.7, 0.9, 0.7, 0.7], font=8.5)

    h(d, "6. High-Level Business Requirements (BR-01 to BR-10)")
    table(d, ["ID", "Business Requirement", "Operational Justification", "MoSCoW", "Traceability"], [
        ("BR-01", "Citizen Self-Service Intake for 5 Request Types", "Eliminates counter queues and handwritten illegibility", "Must", "FR-02, UC2"),
        ("BR-02", "Digital Document Upload (PDF/JPG <= 2 MB)", "Prevents paper loss; enforces legible evidence", "Must", "FR-03, UC3"),
        ("BR-03", "Pre-Submission Rule Engine Validation", "Stops ineligible requests instantly, saving officer hours", "Must", "FR-04, UC10"),
        ("BR-04", "Unique Tracking ID & Instant Acknowledgment", "Gives applicant proof of submission; enables tracking", "Must", "FR-05, UC2"),
        ("BR-05", "Online Status Timeline by Request ID", "Eliminates enquiry visits to the supply office", "Must", "FR-06, UC4"),
        ("BR-06", "Oldest-First Queue & SLA Breach Indicators", "Guarantees fair processing and identifies delayed files", "Must", "FR-07, UC5"),
        ("BR-07", "Adjudication with Mandatory Remarks on Rejection", "Ensures administrative natural justice and clarity", "Must", "FR-07, UC6"),
        ("BR-08", "Milestone-Driven SMS Alerts to Beneficiary", "Ensures citizens without internet can track outcomes", "Must", "FR-08, UC9"),
        ("BR-09", "Data-Driven Rule Versioning via Admin UI", "Adapts to state rule changes without redeployment", "Must", "FR-09, UC7"),
        ("BR-10", "Operational MIS Reporting & Disposal Metrics", "Enables DSO to hold inspection officers accountable", "Should", "FR-10, UC8"),
    ], widths=[0.6, 2.0, 2.2, 0.6, 1.0], font=8.0)

    h(d, "7. Business Rules Catalog by Service Stream")
    bullets(d, [
        ("New Card Rules: ", "Applicant must reside in the district; no family member may possess an active Aadhaar record on another card; income <= ₹1,00,000 qualifies as PHH (Priority), else NPHH (Non-priority); requires residence proof, family Aadhaar copies, and income certificate."),
        ("Add Member Rules: ", "Parent ration card must be active; new member must not exist on any other card; total family size after addition cannot exceed 15 members; requires birth certificate (for child) or marriage certificate (for spouse)."),
        ("Remove Member Rules: ", "Parent card must be active; total family size after removal must be >= 1 member (if 0, applicant must apply for card cancellation/surrender); if Head of Family is removed, a new head must be explicitly designated; requires death certificate, marriage certificate, or migration certificate."),
        ("Address Change Rules: ", "Parent card must be active; new address must be within district administrative boundaries (inter-district transfers require transfer surrender cert); requires electricity bill, water bill, or registered rent agreement."),
        ("Duplicate Card Rules: ", "Parent card must be active; reason must be declared (lost, stolen, damaged); applicant allowed at most 2 duplicate issuances within a rolling 12-month period; requires police report / self-declaration for loss or physical card return for damaged cards."),
    ])

    h(d, "8. Scope Boundaries: In-Scope vs. Out-of-Scope")
    table(d, ["Category", "Item / Feature", "In / Out", "Business Rationale"], [
        ("Citizen Intake", "Web portal for 5 service types with OTP login", "IN", "Core requirement to replace physical application desk"),
        ("Document Engine", "Multi-file upload (PDF/JPG, max 2MB) & preview", "IN", "Replaces physical photocopies; prevents lost papers"),
        ("Policy Engine", "Configurable eligibility rules with versioning", "IN", "Essential to accommodate state rule revisions"),
        ("Adjudication", "Officer queue with FIFO, SLA alerts, Approve/Reject", "IN", "Replaces manual desk routing and unlogged approvals"),
        ("Alerts", "Automated SMS on submission, return, approval, reject", "IN", "Direct communication to eliminate enquiry visits"),
        ("Payment Gateway", "Online fee collection module", "OUT", "Statutory fee is nominal or zero; adding payment gateway introduces citizen friction and payment reconciliation complexity in Phase 1"),
        ("Native Mobile App", "Dedicated Android / iOS mobile applications", "OUT", "Responsive web portal is accessible from any mobile browser without requiring app downloads or device storage"),
        ("Fair-Price e-PoS", "Direct real-time integration with fair price shop biometric e-PoS", "OUT", "Managed under separate state central server; deferred to Phase 2 to maintain fixed 44-day go-live"),
        ("Legacy Archiving", "Digitization of pre-existing paper records prior to go-live", "OUT", "Historical digitization is a separate procurement; RationSeva manages active forward-looking transactions"),
    ], widths=[1.1, 2.3, 0.6, 2.4], font=8.0)

    h(d, "9. Business Risks, Exposure & Strategic Mitigations")
    para(d, "Risks prioritized by Exposure = Probability (P) x Impact (I):")
    table(d, ["Rank & Risk", "P", "I", "Exposure", "Operational Impact", "Strategic Business Response"], [
        ("1. Staff Skill Gaps", "0.6", "6", "3.6", "Clerks unable to navigate complex UI; revert to paper", "Large-font, high-contrast 3-step UI; 2-hour mandatory hands-on training with quick-reference bilingual job aids"),
        ("2. State Rule Changes", "0.5", "7", "3.5", "Mid-year GO invalidates hardcoded rules; system stalls", "Decoupled Rule Engine with database-driven versioning and effective dates; no code changes required"),
        ("3. Fake Documents", "0.3", "7", "2.1", "Ineligible beneficiaries obtain subsidized cards fraudulently", "Mandatory clear digital upload, cross-card Aadhaar duplicate check, and officer field-verification return mechanism"),
        ("4. Server Downtime", "0.2", "6", "1.2", "Portal inaccessible; citizen complaints and missed SLAs", "State Data Centre hosting with 99.5% uptime SLA, redundant power/network, and nightly automated database snapshots"),
    ], widths=[1.3, 0.3, 0.3, 0.6, 1.8, 2.1], font=8.0)

    h(d, "10. Cost-Benefit & Business Value Proposition")
    bullets(d, [
        ("Direct Administrative Savings: ", "Elimination of 4,000 paper dossier packets per month (each averaging 8 pages of forms and enclosures = 32,000 sheets/month), physical stationery savings, and substantial reduction in clerical overtime and file retrieval labor."),
        ("Direct Citizen Economic Value: ", "Eliminating ~2.5 unnecessary round trips for 4,000 applicants saves approximately 10,000 citizen transit trips monthly. At an average travel/loss-of-daily-wage cost of ₹150 per visit, this delivers ~₹15,00,000 per month in direct economic relief to the district's citizen base."),
        ("Intangible & Governance Value: ", "100% elimination of touts/middlemen outside the supply office, full statutory compliance with Right to Public Services Act (RTS), complete auditability of every officer decision, and enhanced public trust in the district administration."),
    ])

    h(d, "11. Document Sign-Off & Approvals")
    table(d, ["Role / Designation", "Name", "Organization / Department", "Signature", "Date"], [
        ("Project Sponsor", "Shri R. K. Sharma", "District Supply Office (DSO)", "", ""),
        ("Head of e-Governance", "Smt. A. Deshmukh", "District Collectorate", "", ""),
        ("State Policy Liaison", "Shri V. Patil", "Dept of Food & Civil Supplies", "", ""),
        ("Lead Project Manager", "IT Solutions Lead", "Technical Delivery Partner", "", ""),
    ], widths=[1.5, 1.4, 1.7, 1.0, 0.8], font=8.5)
    save(d, "RationSeva_BRD.docx")


# =============================== SOW ===============================
def sow():
    d = new_doc("Statement of Work (SOW) & Project Plan", "Contractual Scope, Detailed WBS, CPM Schedule Analysis, Resource Allocation & Governance")
    
    h(d, "1. Project Identification & Contractual Overview")
    para(d, "This Statement of Work (SOW) defines the formal agreement between the District Supply Office (Client / Sponsor) and the Technical Solutions Partner (Contractor) for the turnkey design, development, verification, deployment, and operationalization of the RationSeva Online Ration Card Services Portal.", "Project Charter: ")
    table(d, ["Project Parameter", "Contract Specification"], [
        ("Project Title", "RationSeva – Online Ration Card Services Portal"),
        ("Sponsoring Authority", "District Supply Office (DSO), District Collectorate"),
        ("Contract Type", "Fixed Duration, Milestone-Billed Turnkey Software Delivery"),
        ("Total Schedule Duration", "44 Working Days (from Project Inception to Production Go-Live)"),
        ("Target Production Environment", "State Data Centre (SDC) Cloud Infrastructure"),
        ("Governing Standards", "IEEE 830-1998 (SRS), ISO/IEC 25010 Quality Model, IT Act 2000"),
    ], widths=[2.0, 4.4], font=8.5)

    h(d, "2. Scope of Work & Deliverables Package (D1 to D6)")
    para(d, "The Contractor is contractually committed to delivering six comprehensive work packages, tied to formal milestone checkpoints:")
    table(d, ["Deliverable ID", "Deliverable Name", "Milestone", "Delivery Format", "Acceptance Verification Standard"], [
        ("D1", "Requirements & Business Blueprint Package", "M1 (Day 6)", "IEEE 830 SRS, BRD, Traceability Matrix", "Formal sponsor sign-off; 100% FR-to-test mapping"),
        ("D2", "Eligibility Rules Engine & Data Architecture", "M2 (Day 31)", "Config schema, rule evaluation service, DB scripts", "Passing 100% boundary and decision-table test specs"),
        ("D3", "Citizen Portal & Officer Workflow Application", "M2 (Day 31)", "Deployable web application + SMS gateway hook", "Passes end-to-end multi-role functional tests"),
        ("D4", "Quality Assurance & Test Evidence Package", "M3 (Day 39)", "Test execution logs, BVA/Decision tables, DRE report", "DRE >= 85%; zero open Severity-1 / Severity-2 defects"),
        ("D5", "Operational Readiness & Training Enablement", "M4 (Day 44)", "Bilingual quick-guides, 2h staff training delivery", "100% target staff trained; SUS usability score >= 70"),
        ("D6", "Production Deployment & Go-Live Certificate", "M4 (Day 44)", "SDC production release, operational baseline", "Signed Go-Live acceptance certificate from DSO"),
    ], widths=[0.7, 1.8, 0.8, 1.5, 1.6], font=8.0)

    h(d, "3. Detailed Work Breakdown Structure (WBS)")
    para(d, "The project scope is hierarchically decomposed into seven primary Level-1 work packages, partitioned down to verifiable operational tasks:")
    table(d, ["WBS Code", "Work Package / Task Name", "Input Artifacts", "Core Activities", "Tangible Deliverable"], [
        ("1.0", "Requirements Engineering", "Forms, staff interviews", "Elicit citizen/staff needs; define 11 FRs & 6 NFRs", "Signed SRS v1.0 & BRD v1.0"),
        ("1.1", "Stakeholder Elicitation", "Citizen/staff questionnaires", "Conduct 23 interviews; analyze paper forms", "Field interview findings report"),
        ("1.2", "Specification & Traceability", "Elicitation data", "Author IEEE 830 SRS, MoSCoW priorities, NFRs", "Baselined SRS & Traceability Matrix"),
        ("2.0", "Service Rules Engine", "State food policy circulars", "Model 5 request types; build versioned rule schema", "Rule Engine module & test harness"),
        ("2.1", "Rule Schema & Versioning", "NFSA guidelines", "Design table schema for income, quota, and doc list", "Data dictionary & migration DDL"),
        ("2.2", "Evaluation Service APIs", "Rule schema", "Develop stateless evaluate() service with effective dates", "REST rule evaluation endpoints"),
        ("3.0", "Application Portal Development", "SRS FR-01, 02, 03, 05", "Build citizen self-service screens & file upload", "Tested citizen web portal"),
        ("3.1", "Auth & OTP Subsystem", "Telecom SMS API", "Implement mobile OTP generation and session management", "Login & authentication module"),
        ("3.2", "5-Service Application Wizard", "SRS FR-02", "Multi-step form with live client-side validation", "Application intake wizard"),
        ("3.3", "Document Upload Engine", "SRS FR-03", "File type/size validator (PDF/JPG <= 2MB)", "Document ingestion subsystem"),
        ("4.0", "Officer Approval Workflow", "SRS FR-07, NFR-02", "Develop FIFO work queue and decision actions", "Officer approval dashboard"),
        ("4.1", "Review Queue with SLA", "SRS FR-07", "Build queue sorted oldest-first with >15d SLA alerts", "FIFO review queue screen"),
        ("4.2", "Adjudication & Remarks Engine", "SRS FR-07", "Approve/Reject/Return with mandatory rejection remarks", "Decision modal & handlers"),
        ("4.3", "Immutable Audit Subsystem", "NFR-02", "Log every status and rule alteration with timestamp", "Audit trail database & viewer"),
        ("5.0", "Status Tracking & SMS Gateway", "SRS FR-06, FR-08", "State machine transition events & SMS dispatch", "SMS notification subsystem"),
        ("5.1", "Status State Machine", "UML State Diagram", "Implement transitions: Submitted->Verified->Approved/etc", "State machine logic"),
        ("5.2", "SMS Gateway Integration", "Gateway credentials", "Template management; asynchronous dispatch (<60s)", "Notification worker service"),
        ("6.0", "Testing & Quality Assurance", "SRS, Test Plan", "Black-box BVA, decision tables, UAT with 30 users", "Comprehensive Test Report"),
        ("6.1", "System & Boundary Testing", "BVA/EP test cases", "Execute TC-01 to TC-20 across all boundary limits", "System test execution log"),
        ("6.2", "User Acceptance Testing (UAT)", "Test scenarios", "Conduct formal UAT with 10 staff and 20 citizens", "Signed UAT test report"),
        ("7.0", "Deployment & Staff Enablement", "D3, D4, D5", "Host on SDC; conduct 2h hands-on training for staff", "Trained staff & Go-Live"),
        ("7.1", "SDC Infrastructure Setup", "SDC cloud VM", "Configure web/db servers, SSL certificate, firewall", "Production environment"),
        ("7.2", "Staff Training & Cutover", "Bilingual user guides", "Train staff with low computer skills; verify SUS >= 70", "Go-Live Certificate"),
    ], widths=[0.6, 1.8, 1.2, 1.8, 1.1], font=7.5)

    h(d, "4. Schedule Analysis – Critical Path Method (CPM) & Float")
    para(d, "Project schedule parameters derived from given task durations and strict dependency logic:")
    table(d, ["ID", "Task Description", "Dur (d)", "Predecessors", "ES", "EF", "LS", "LF", "Total Float", "Free Float", "Critical?"], [
        ("A", "Requirements Engineering", "6", "None (-)", "0", "6", "0", "6", "0", "0", "YES (Critical)"),
        ("B", "Service rules for 5 request types", "8", "A", "6", "14", "6", "14", "0", "0", "YES (Critical)"),
        ("C", "Application portal", "14", "A", "6", "20", "17", "31", "11", "11", "NO (Float = 11d)"),
        ("D", "Officer approval workflow", "12", "B", "14", "26", "14", "26", "0", "0", "YES (Critical)"),
        ("E", "Status & SMS", "5", "D", "26", "31", "26", "31", "0", "0", "YES (Critical)"),
        ("F", "Testing", "8", "C, E", "31", "39", "31", "39", "0", "0", "YES (Critical)"),
        ("G", "Staff training", "5", "F", "39", "44", "39", "44", "0", "0", "YES (Critical)"),
    ], widths=[0.3, 2.0, 0.45, 0.7, 0.35, 0.35, 0.35, 0.35, 0.55, 0.55, 0.65], font=8.0,
    highlight=lambda r: "FFE0E0" if r[10].startswith("YES") else "E8F0FE")

    h(d, "4.1 Mathematical Walkthrough of Forward & Backward Pass", 2)
    bullets(d, [
        ("Forward Pass (Early Dates): ", "ES(A) = 0 -> EF(A) = 0 + 6 = 6. ES(B) = EF(A) = 6 -> EF(B) = 6 + 8 = 14. ES(C) = EF(A) = 6 -> EF(C) = 6 + 14 = 20. ES(D) = EF(B) = 14 -> EF(D) = 14 + 12 = 26. ES(E) = EF(D) = 26 -> EF(E) = 26 + 5 = 31. Task F requires both C and E; ES(F) = max(EF(C), EF(E)) = max(20, 31) = 31 -> EF(F) = 31 + 8 = 39. ES(G) = EF(F) = 39 -> EF(G) = 39 + 5 = 44."),
        ("Backward Pass (Late Dates): ", "Target project duration = 44 days. LF(G) = 44 -> LS(G) = 44 - 5 = 39. LF(F) = LS(G) = 39 -> LS(F) = 39 - 8 = 31. Task F succeeds both C and E; hence LF(C) = LS(F) = 31 -> LS(C) = 31 - 14 = 17. LF(E) = LS(F) = 31 -> LS(E) = 31 - 5 = 26. LF(D) = LS(E) = 26 -> LS(D) = 26 - 12 = 14. LF(B) = LS(D) = 14 -> LS(B) = 14 - 8 = 6. Task A precedes B and C; LF(A) = min(LS(B), LS(C)) = min(6, 17) = 6 -> LS(A) = 6 - 6 = 0."),
        ("Critical Path Identification: ", "The critical path is defined by zero float (Total Float = LS - ES = 0): Path A -> B -> D -> E -> F -> G. Total duration = 6 + 8 + 12 + 5 + 8 + 5 = 44 Working Days."),
        ("Float Analysis of Task C (Application Portal): ", "Total Float = LS(C) - ES(C) = 17 - 6 = 11 days. Free Float = min(ES of successors) - EF(C) = ES(F) - EF(C) = 31 - 20 = 11 days. Task C can be delayed by up to 11 days without delaying Task F or extending the 44-day project deadline."),
    ])
    image(d, "network.png", 6.6, "Figure 1: Project Network Diagram (Critical Path highlighted in Red)")

    h(d, "4.2 Milestones & Contractual Gates", 2)
    para(d, "Four mandatory contractual milestones serve as zero-duration formal gates:")
    table(d, ["Milestone", "Day", "Formal Gate Criteria", "Required Sign-Off Authority"], [
        ("M1 – Requirements Sign-Off", "Day 6", "SRS v1.0 and BRD v1.0 approved; traceability matrix baseline locked", "District Supply Officer & Lead BA"),
        ("M2 – System Build Complete", "Day 31", "All 11 FRs coded; Portal (C) and Status/SMS (E) successfully integrated", "Technical Delivery Lead"),
        ("M3 – UAT Acceptance", "Day 39", "All Must-have test cases pass; DRE >= 85%; zero open Sev-1/2 bugs", "Lead QA & Staff Representative"),
        ("M4 – Production Go-Live", "Day 44", "All DSO staff completed 2h training; SDC cutover complete; portal live", "District Collector / DSO Sponsor"),
    ], widths=[1.8, 0.7, 2.7, 1.4], font=8.5)
    image(d, "gantt.png", 6.6, "Figure 2: Milestone Gantt Chart (Red = Critical Tasks, Grey = Float)")

    h(d, "5. Human Resource Allocation & Resource Leveling Strategy")
    para(d, "To guarantee project execution within 44 days, human resources are allocated based on critical-path prioritization:")
    table(d, ["Role", "Headcount", "Core Task Assignments", "Total Person-Days", "Key Responsibilities"], [
        ("Project Manager (PM)", "1", "All (A–G), Change Management", "22 (0.5 FTE)", "Schedule tracking, risk management, milestone gates"),
        ("Lead Business Analyst", "1", "A (Req), B (Rules), G (Training)", "19 (1.0 FTE)", "Requirements elicitation, rule specification, staff training"),
        ("Full-Stack Developer 1 (Lead)", "1", "B (Rules), D (Officer Approval)", "20 (1.0 FTE)", "Rule engine architecture, approval state machine"),
        ("Full-Stack Developer 2", "1", "C (Portal), D/E Support", "22 (1.0 FTE)", "Citizen portal wizard, document upload, then assists D & E"),
        ("Integration Developer", "1", "E (SMS), System Integration", "16 (1.0 FTE)", "SMS gateway integration, audit log, build pipeline"),
        ("QA / Test Engineer", "1", "Test design (d14–30), F (Testing)", "24 (1.0 FTE)", "BVA/decision table tests, defect logging, DRE metrics"),
    ], widths=[1.6, 0.6, 1.6, 1.0, 1.8], font=8.0)
    note(d, "Resource Leveling Insight: Developer 2 completes Task C (Application Portal) on Day 20. Because Task C has 11 days of float, Developer 2 is redeployed to assist Developer 1 on Task D (Officer Approval) and Task E (Status & SMS) from Day 20 to 31. This injects 11 person-days of additional development capacity directly into the critical path, mitigating schedule risk.")

    h(d, "6. Project Governance, Cadence & Escalation Protocol")
    para(d, "A three-tier governance model ensures continuous oversight and rapid issue resolution:")
    table(d, ["Governance Meeting", "Frequency", "Participants", "Primary Objective"], [
        ("Daily Scrum / Standup", "Daily (15 min)", "Project Team (PM, Devs, QA, BA)", "Track daily progress, identify blockers, verify critical path"),
        ("Weekly Progress Review", "Weekly (60 min)", "PM, Lead BA, Supply Officers", "Review milestone burn-down, review open defects and risks"),
        ("Milestone Gate Sign-off", "Milestones M1–M4", "DSO Sponsor, District Collectorate, PM", "Formal acceptance sign-off and authorization to proceed"),
    ], widths=[1.5, 1.1, 1.8, 2.2], font=8.5)
    para(d, "Issue Escalation Hierarchy:")
    bullets(d, [
        ("Tier 1 (Technical / Task Variance <= 1 day): ", "Handled by Contractor Lead Developer & Lead BA within 4 working hours."),
        ("Tier 2 (Schedule Variance > 1 day or Cross-Module Dependency): ", "Escalated to Project Manager; corrective action plan formulated within 24 hours."),
        ("Tier 3 (Scope Dispute, Policy Contradiction, or Budget Impact): ", "Referred directly to District Supply Officer (Sponsor); binding decision within 48 hours."),
    ])

    h(d, "7. Quality Assurance Standards & Acceptance Criteria")
    bullets(d, [
        ("Functional Completeness: ", "100% of Must-have Functional Requirements (FR-01 through FR-09) pass verification against their mapped test cases (TC-01 through TC-18)."),
        ("Defect Removal Efficiency (DRE): ", "System testing must achieve DRE >= 85% prior to go-live sign-off, calculated as DRE = E / (E + D)."),
        ("Defect Severity Thresholds: ", "Zero open Severity-1 (Blocker) and Severity-2 (Critical) defects at the conclusion of Milestone M3 (UAT Sign-off)."),
        ("Non-Functional Target Verification: ", "System availability >= 99.5%, 100% audit logging, sub-3s response time, and SUS usability score >= 70 verified in formal UAT."),
    ])

    h(d, "8. Change Control & Scope Amendment Protocol")
    para(d, "Any proposed amendment to requirements, service rules, schedule, or architecture must comply with the formal 6-step Change Management Process (Capture -> Understand -> Impact Analysis -> Decide -> Update Plan -> Implement & Verify). The District Supply Officer holds sole statutory approval authority for changes impacting scope or legal compliance.")

    h(d, "9. Post-Go-Live Warranty & SLA Support")
    para(d, "The Contractor provides a 90-calendar-day warranty period commencing immediately following Milestone M4 (Go-Live). Support SLAs:")
    table(d, ["Severity Level", "Definition", "Response Time", "Resolution Time Target"], [
        ("Severity 1 (Critical)", "Portal down, citizen login disabled, SMS gateway failure", "<= 30 minutes", "<= 4 hours"),
        ("Severity 2 (High)", "Eligibility rule miscalculation, document upload error", "<= 2 hours", "<= 12 hours"),
        ("Severity 3 (Medium)", "UI visual defect, non-critical report generation slow", "<= 4 hours", "<= 48 hours"),
        ("Severity 4 (Low)", "Minor text typo, documentation clarification", "<= 8 hours", "Next scheduled release patch"),
    ], widths=[1.4, 2.6, 1.1, 1.5], font=8.5)

    h(d, "10. Contractual Authorization & Signatures")
    table(d, ["For and on Behalf of Client (DSO)", "For and on Behalf of Contractor"], [
        ("Name: Shri R. K. Sharma\nTitle: District Supply Officer (Sponsor)\nDate: ________________________\nSignature: ___________________",
         "Name: Lead Delivery Partner\nTitle: Engagement Director\nDate: ________________________\nSignature: ___________________"),
    ], widths=[3.3, 3.3], font=9.0)
    save(d, "RationSeva_SOW.docx")


if __name__ == "__main__":
    srs(); brd(); sow()
