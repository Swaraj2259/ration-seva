"""Generates UML package, Change Management and Test Plan for RationSeva."""
from common import *


# =============================== UML ===============================
def uml():
    d = new_doc("UML Design Package", "Use case, class, sequence, activity and state diagrams")
    h(d, "1. Use Case Diagram")
    para(d, "Actors: Citizen, Supply Officer, Admin/Staff and the external SMS Gateway. Submit Service Request includes Upload Documents, Check Eligibility and Send SMS.")
    image(d, "usecase.png", 5.2, "Figure 1: Use case diagram")

    h(d, "2. Class Diagram")
    para(d, "Core entities: ServiceRequest (one per application), RationCard with FamilyMember (composition, 1..15), Document, ApprovalTask. Versioned EligibilityRule records are evaluated by RuleEngine.")
    image(d, "class.png", 6.6, "Figure 2: Class diagram")

    h(d, "3. Sequence Diagram – Request Adding a Member to a Ration Card")
    para(d, "The Intake Service validates the request through RuleEngine, saves it and publishes a RequestSubmitted event. The Approval Service picks the event up from the queue, so intake never calls approval directly.")
    image(d, "sequence.png", 6.6, "Figure 3: Sequence diagram – Add Member")

    h(d, "4. Activity Diagram – Service Request Processing")
    image(d, "activity.png", 4.2, "Figure 4: Activity diagram")

    h(d, "5. State Diagram – ServiceRequest")
    image(d, "state.png", 4.6, "Figure 5: State diagram of ServiceRequest.status")

    h(d, "6. Consistency Check")
    table(d, ["Element", "Use case", "Class", "Sequence", "State"], [
        ("Submit request", "UC2", "ServiceRequest.submit()", "submitRequest()", "Draft → Submitted"),
        ("Eligibility check", "UC10", "RuleEngine.evaluate()", "evaluate(ADD_MEMBER)", "guard [eligible]"),
        ("Officer decision", "UC6", "ApprovalTask, Officer.decide()", "Approve / Reject alt", "PendingApproval → Approved/Rejected"),
        ("Return for docs", "UC6", "ApprovalTask.decision", "Reject / Return", "ClarificationRequired"),
        ("SMS alert", "UC9", "NotificationService.sendSMS()", "sendSMS()", "on every transition"),
        ("Add member", "UC2", "RationCard.addMember(), FamilyMember", "add FamilyMember", "Approved → CardIssued"),
    ], widths=[1.2, 0.7, 1.8, 1.4, 1.6], font=8.5)

    h(d, "7. Cohesion & Coupling Justification")
    h(d, "Loose coupling: request intake vs officer approval", 2)
    bullets(d, [
        ("Event / queue based: ", "Intake publishes RequestSubmitted(requestId) and Approval subscribes to it. Neither calls the other directly (message coupling, the loosest kind)."),
        ("Only the ID is shared: ", "The modules share just the requestId and the status values. No internal objects are passed between them (data coupling, not stamp or control coupling)."),
        ("Rules are external: ", "Both modules call RuleEngine, which reads versioned EligibilityRule data. A state rule change does not touch intake or approval code."),
        ("Benefit: ", "If approval is down, citizens can still submit, because requests wait in the queue. The approval UI can also be redesigned without retesting intake."),
    ])
    h(d, "High cohesion: each module has a single purpose", 2)
    table(d, ["Module", "Single responsibility", "Cohesion type"], [
        ("Intake", "Capture the application and documents, validate, save", "Functional"),
        ("RuleEngine", "Evaluate eligibility for a request type", "Functional"),
        ("Approval", "Officer queue and decisions", "Functional"),
        ("Notification", "Send SMS for any event", "Functional"),
        ("Audit", "Record every change, read-only", "Functional"),
    ], widths=[1.3, 3.6, 1.5])
    save(d, "RationSeva_UML.docx")


# =============================== CHANGE MGMT ===============================
def change():
    d = new_doc("Change Management Process", "Handling state eligibility-rule changes after go-live")
    h(d, "1. Why This Process Is Needed")
    para(d, "The state is expected to change eligibility rules within the year. This risk has P = 0.5, I = 7 and exposure 3.5 (ranked #2). Uncontrolled edits would break the eligibility checks and the audit trail.")
    h(d, "2. Roles")
    table(d, ["Role", "Who", "Responsibility"], [
        ("Requester", "State Dept. / DSO staff", "Raises a change request (CR) with a copy of the GO"),
        ("Change Coordinator", "Project Manager", "Logs the CR, tracks it to closure"),
        ("Impact Analyst", "Business Analyst + Tech Lead", "Assesses scope, time, cost and quality"),
        ("Decision Owner", "District Supply Officer", "Approves, rejects or defers the change"),
        ("Implementer", "Admin (config) / Developer (code)", "Applies the change as a new rule version"),
        ("Verifier", "Tester + 1 Officer", "Runs regression tests and signs off"),
    ], widths=[1.4, 2, 3])
    h(d, "3. Change Categories")
    table(d, ["Type", "Example", "Path", "Target time"], [
        ("A – Configuration", "Change income limit or document list", "Fast track: Admin creates a new rule version", "<= 1 working day"),
        ("B – Logic", "New condition or new field", "Full process + code release", "<= 10 working days"),
        ("C – New service", "New request type", "Treated as a new project or phase", "Planned release"),
    ], widths=[1.3, 2, 2.1, 1.1])
    h(d, "4. Six-Step Procedure")
    image(d, "change.png", 6.6, "Figure 1: Rule-change process")
    table(d, ["Step", "What happens", "Output"], [
        ("1. Capture", "Requester fills in the CR form (GO no., rule, old/new value, effective date)", "CR-ID in change log"),
        ("2. Understand reason", "Coordinator confirms the legal source and urgency with the State Dept.", "Reason + priority"),
        ("3. Analyse impact", "Assess Scope (screens, rules), Time (days), Cost (effort), Quality (tests to rerun)", "Impact sheet"),
        ("4. Decide", "District Supply Officer approves, rejects or defers", "Decision + date"),
        ("5. Update plan", "Update the SRS rule table, schedule, test cases and traceability matrix", "Updated baseline"),
        ("6. Implement & verify", "New rule version with effective date; rerun decision-table and BVA tests; officer sign-off; SMS/notice to staff", "Rule vX.Y live, CR closed"),
    ], widths=[1.3, 3.6, 1.5])
    note(d, "Requests already submitted are evaluated under the rule version that was active on the submission date. This is fair to applicants and keeps the audit trail intact.")

    h(d, "5. Change Log")
    table(d, ["CR", "Date", "Change & reason", "Impact (S / T / C / Q)", "Decision", "Implemented & verified", "Status"], [
        ("CR-001", "05-Jan-27", "PHH income limit ₹1,00,000 → ₹1,20,000 (State GO 12/2027)", "S: 1 rule value; T: 0.5 d; C: ~0.5 person-day; Q: rerun TC-06, TC-12 at new boundary", "Approved – DSO, 06-Jan", "Rules v1.1, effective 01-Feb; tests passed 07-Jan", "Closed"),
        ("CR-002", "20-Feb-27", "Aadhaar of new member mandatory for Add Member (anti-fraud GO)", "S: +1 field, +1 condition; T: 3 d; C: ~3 person-days; Q: update DT-2, TC-07", "Approved – DSO, 22-Feb", "Release 1.2 on 02-Mar; regression passed", "Closed"),
        ("CR-003", "10-Mar-27", "Add 'Card Surrender' request type", "S: new service; T: ~10 d; C: high; Q: new test suite", "Deferred to Phase 2", "–", "Deferred"),
    ], widths=[0.55, 0.7, 1.5, 1.6, 0.9, 1.1, 0.6], font=8)
    save(d, "RationSeva_Change_Management.docx")


# =============================== TEST PLAN ===============================
def test():
    d = new_doc("Test Plan & Evidence", "BVA, equivalence classes, decision tables, defect log, DRE")
    h(d, "1. Scope & Approach")
    bullets(d, [
        "Black-box functional tests derived from the SRS (BVA, equivalence partitioning, decision tables).",
        "Levels: unit → integration → system → UAT (with 10 staff and 20 citizens for the usability NFRs).",
        "Exit criteria: all Must-have test cases pass, no open Severity-1 defects, DRE >= 85%.",
    ])
    note(d, "Eligibility values are rule v1.0 (assumed, admin-configurable): members per card 1–15, income field 0–10,00,000, PHH if annual income <= ₹1,00,000.")

    h(d, "2. Boundary Value Analysis")
    h(d, "2.1 Family-member count (valid 1–15)", 3)
    table(d, ["Input", "Class", "Expected"], [
        ("0", "Below min", "Error: at least 1 member"), ("1", "Min", "Accepted"), ("2", "Min+1", "Accepted"),
        ("8", "Nominal", "Accepted"), ("14", "Max−1", "Accepted (Add Member allowed → 15)"),
        ("15", "Max", "Accepted (Add Member rejected: limit)"), ("16", "Above max", "Error: max 15 members"),
    ], widths=[0.8, 1.4, 4.2])
    h(d, "2.2 Annual income ₹ (valid 0–10,00,000; PHH threshold 1,00,000)", 3)
    table(d, ["Input", "Class", "Expected"], [
        ("-1", "Below min", "Error: invalid income"), ("0", "Min", "Accepted → PHH"), ("1", "Min+1", "Accepted → PHH"),
        ("99,999", "Threshold−1", "PHH"), ("1,00,000", "Threshold", "PHH (<= limit)"), ("1,00,001", "Threshold+1", "NPHH"),
        ("9,99,999", "Max−1", "Accepted → NPHH"), ("10,00,000", "Max", "Accepted → NPHH"), ("10,00,001", "Above max", "Error: verify income"),
    ], widths=[1, 1.4, 4])

    h(d, "3. Equivalence Classes")
    table(d, ["Field", "Valid classes", "Invalid classes"], [
        ("Member count", "EC1: 1–15", "EC2: < 1;  EC3: > 15;  EC4: non-numeric"),
        ("Annual income", "EC5: 0–1,00,000 (PHH);  EC6: 1,00,001–10,00,000 (NPHH)", "EC7: < 0;  EC8: > 10,00,000;  EC9: non-numeric"),
        ("Request type", "EC10: one of the 5 types", "EC11: blank / other"),
        ("Document", "EC12: PDF/JPG <= 2 MB", "EC13: > 2 MB;  EC14: other file type"),
        ("Mobile / OTP", "EC15: 10-digit mobile, OTP correct within 5 min", "EC16: wrong OTP;  EC17: expired OTP"),
    ], widths=[1.2, 2.7, 2.5])

    h(d, "4. Decision Tables – Eligibility per Request Type")
    para(d, "Y = Yes, N = No, – = don't care. Each column (rule) is one test case.")
    dts = [
        ("DT-1 New Card (TC-06)", ["C1 Resident of district", "C2 No existing card for any member (Aadhaar)", "C3 Mandatory documents complete", "C4 Income <= ₹1,00,000"],
         [["Y", "Y", "Y", "Y", "N"], ["Y", "Y", "Y", "N", "–"], ["Y", "Y", "N", "–", "–"], ["Y", "N", "–", "–", "–"]],
         ["Eligible – PHH", "Eligible – NPHH", "Return: docs", "Reject: duplicate", "Reject: out of district"]),
        ("DT-2 Add Member (TC-07)", ["C1 Card active", "C2 Member not on any other card", "C3 Birth/marriage proof uploaded", "C4 Members after add <= 15"],
         [["Y", "Y", "Y", "Y", "N"], ["Y", "Y", "Y", "N", "–"], ["Y", "Y", "N", "–", "–"], ["Y", "N", "–", "–", "–"]],
         ["Eligible", "Reject: limit 15", "Return: proof", "Reject: duplicate", "Reject: inactive"]),
        ("DT-3 Remove Member (TC-08)", ["C1 Card active", "C2 Death/marriage/migration proof", "C3 Members after removal >= 1", "C4 If head removed, new head named"],
         [["Y", "Y", "Y", "Y", "N"], ["Y", "Y", "Y", "N", "–"], ["Y", "Y", "N", "–", "–"], ["Y", "N", "–", "–", "–"]],
         ["Eligible", "Return: name head", "Reject: use surrender", "Return: proof", "Reject: inactive"]),
        ("DT-4 Address Change (TC-09)", ["C1 Card active", "C2 New address in same district", "C3 Address proof uploaded"],
         [["Y", "Y", "Y", "N"], ["Y", "Y", "N", "–"], ["Y", "N", "–", "–"]],
         ["Eligible", "Return: proof", "Reject: apply transfer", "Reject: inactive"]),
        ("DT-5 Duplicate Card (TC-10)", ["C1 Card active", "C2 Reason (lost/damaged) declared", "C3 FIR/self-declaration or damaged card uploaded", "C4 Duplicates in last 12 months < 2"],
         [["Y", "Y", "Y", "Y", "N"], ["Y", "Y", "Y", "N", "–"], ["Y", "Y", "N", "–", "–"], ["Y", "N", "–", "–", "–"]],
         ["Eligible", "Refer to officer", "Return: proof", "Return: reason", "Reject: inactive"]),
    ]
    for title, conds, cols, acts in dts:
        h(d, title, 3)
        n = len(acts)
        rows = []
        # each entry in cols is one condition row across rules R1..Rn
        for ci, c in enumerate(conds):
            rows.append([c] + cols[ci])
        rows.append(["Action"] + acts)
        table(d, ["Condition / Rule"] + [f"R{i+1}" for i in range(n)], rows,
              widths=[2.4] + [0.85] * n, font=8.5,
              highlight=lambda r: "E8F0FE" if r[0] == "Action" else None)

    h(d, "5. Test Cases (linked to FRs)")
    table(d, ["TC", "FR", "Description / input", "Expected", "Result"], [
        ("TC-01", "FR-01", "Valid mobile + correct OTP", "Role dashboard", "Pass"),
        ("TC-02", "FR-01", "Wrong / expired OTP (EC16, EC17)", "Error, no login", "Pass"),
        ("TC-03", "FR-02", "Submit each of 5 request types", "Accepted", "Pass"),
        ("TC-04", "FR-03", "Upload 1.9 MB PDF", "Accepted", "Pass"),
        ("TC-05", "FR-03", "Upload 2.1 MB / .exe file", "Rejected with message", "Pass"),
        ("TC-06", "FR-04", "DT-1 rules R1–R5", "As per table", "Pass (after fix D-03)"),
        ("TC-07", "FR-04", "DT-2 rules R1–R5", "As per table", "Pass (after fix D-04)"),
        ("TC-08", "FR-04", "DT-3 rules R1–R5", "As per table", "Pass"),
        ("TC-09", "FR-04", "DT-4 rules R1–R4", "As per table", "Pass"),
        ("TC-10", "FR-04", "DT-5 rules R1–R5", "As per table", "Pass (after fix D-06)"),
        ("TC-11", "FR-04", "BVA member count 0,1,2,8,14,15,16", "As per 2.1", "Pass (after fix D-04)"),
        ("TC-12", "FR-04", "BVA income -1 … 10,00,001", "As per 2.2", "Pass (after fix D-03)"),
        ("TC-13", "FR-05", "Submit 2 requests", "Unique IDs RS-YYYY-NNNNNN", "Pass"),
        ("TC-14", "FR-06", "Track valid / invalid ID", "Timeline / 'not found'", "Pass"),
        ("TC-15", "FR-07", "Officer approves request", "Status Approved, audit entry", "Pass"),
        ("TC-16", "FR-07", "Reject without remarks", "Blocked: remarks required", "Pass"),
        ("TC-17", "FR-08", "Each status change", "SMS sent within 60 s", "Pass"),
        ("TC-18", "FR-09", "New rule version, future effective date", "Old rule applies until that date", "Pass"),
        ("TC-19", "FR-10", "Pending > 15 days report", "Correct count", "Pass"),
        ("TC-20", "FR-11", "Download acknowledgement", "PDF opens", "Pass"),
    ], widths=[0.6, 0.6, 2.4, 1.9, 1.0], font=8.5)

    h(d, "6. Defect Log (sample test log)")
    note(d, "The case study gives no defect data, so the figures below are assumed sample values used to show the method.")
    table(d, ["ID", "Found in", "Description", "Severity", "Found by", "Status"], [
        ("D-01", "Req. review", "Max members not specified in SRS", "Medium", "Review", "Closed"),
        ("D-02", "Design review", "Approval called intake directly (tight coupling)", "Medium", "Review", "Closed"),
        ("D-03", "System test", "Income = 1,00,000 classified NPHH ('<' used instead of '<=')", "High", "TC-12", "Closed"),
        ("D-04", "System test", "Add Member allowed a 16th member", "High", "TC-11", "Closed"),
        ("D-05", "Integration", "SMS not sent on 'Returned' status", "Medium", "TC-17", "Closed"),
        ("D-06", "System test", "Duplicate card allowed a 3rd time in 12 months", "High", "TC-10", "Closed"),
        ("D-07", "UAT", "Reject button too close to Approve (usability)", "Low", "UAT", "Closed"),
        ("D-08", "Post-release", "Address change accepted pin code outside district", "Medium", "Field", "Closed"),
    ], widths=[0.5, 1.0, 2.6, 0.7, 0.8, 0.6], font=8.5)
    table(d, ["Phase", "Defects found"], [
        ("Requirements review", "6"), ("Design review", "8"), ("Unit testing", "14"),
        ("Integration testing", "12"), ("System testing + UAT", "14"),
        ("Total before release (E)", "54"), ("After release – first 30 days (D)", "6"), ("Total (E + D)", "60"),
    ], widths=[3.5, 1.5])

    h(d, "7. Metrics")
    para(d, "12 KLOC (assumed).", "Size: ")
    para(d, "DRE = E / (E + D) = 54 / (54 + 6) = 54 / 60 = 0.90 = 90%. This meets the >= 85% target.", "Defect Removal Efficiency: ")
    para(d, "Total defects / KLOC = 60 / 12 = 5.0 defects per KLOC (pre-release only: 54 / 12 = 4.5 per KLOC).", "Defect density: ")
    para(d, "3 of the 4 high-severity defects (D-03, D-04, D-06) were eligibility-boundary errors caught by the BVA and decision-table tests. This shows these techniques are the right ones for rule-heavy modules. D-08 escaped because DT-4 had no pin-code range test, so that test has been added.", "Interpretation: ")
    save(d, "RationSeva_Test_Plan.docx")


if __name__ == "__main__":
    uml(); change(); test()
