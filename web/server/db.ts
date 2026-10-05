import fs from "fs";
import path from "path";

export * from "@/lib/types";
import {
  REQUEST_TYPES,
  RequestType,
  RequestStatus,
  HistoryEntry,
  ServiceRequest,
  EligibilityRule,
  RuleVersion,
  SmsNotification,
} from "@/lib/types";

export interface DatabaseSchema {
  requests: ServiceRequest[];
  rules: RuleVersion[];
  activeRuleVersion: string;
  smsLog: SmsNotification[];
  otpStore: Record<string, { otp: string; expiresAt: number; role: string }>;
}

const DB_PATH = path.join(process.cwd(), "data", "rationseva.json");

function getInitialData(): DatabaseSchema {
  const initialRules: RuleVersion[] = [
    {
      version: "v1.0",
      effectiveFrom: "2026-11-01",
      publishedAt: "2026-10-15T10:00:00Z",
      publishedBy: "State Food & Civil Supplies Dept",
      governmentOrderRef: "GO-MS-01/2026/FCS",
      summary: "Baseline statutory parameters: Annual household income <= ₹1,00,000 for Priority Household (PHH); family members allowed 1 to 15.",
      rules: REQUEST_TYPES.map((t) => ({
        type: t.id,
        incomeLimit: 100000,
        minMembers: 1,
        maxMembers: 15,
        requiredDocs: [...t.docs],
      })),
    },
  ];

  const initialRequests: ServiceRequest[] = [
    {
      id: "RS-2026-000101",
      type: "ADD_MEMBER",
      applicantName: "Sunita Ramesh Patil",
      mobile: "9876543210",
      aadhaar: "XXXXXXXX4821",
      rationCardNo: "MH-PN-1023",
      familyMembersCount: 4,
      annualIncome: 85000,
      category: "PHH (Priority)",
      address: "Plot 14, Shanti Nagar, Haveli Tehsil, District Pune",
      subDistrict: "Haveli",
      documents: [
        { name: "daughter_birth_certificate.pdf", sizeKb: 340, type: "application/pdf", uploadedAt: "2026-09-28T09:15:00Z" },
        { name: "aadhaar_card_child.jpg", sizeKb: 420, type: "image/jpeg", uploadedAt: "2026-09-28T09:16:00Z" },
      ],
      status: "Pending Approval",
      submittedAt: "2026-09-28T09:16:00Z",
      ruleVersion: "v1.0",
      slaDays: 15,
      slaBreached: false,
      history: [
        { status: "Submitted", timestamp: "2026-09-28T09:16:00Z", actor: "Sunita Patil", actorRole: "Citizen" },
        { status: "Under Verification", timestamp: "2026-09-29T11:30:00Z", actor: "Clerk M. Kulkarni", actorRole: "Supply Officer", remarks: "Physical inspection of birth certificate verified against municipal civil registry." },
        { status: "Pending Approval", timestamp: "2026-10-01T14:10:00Z", actor: "Senior Inspector R. Shinde", actorRole: "Supply Officer", remarks: "Eligible for adding 1 member (Family size will become 5 <= 15). Recommended for approval." },
      ],
    },
    {
      id: "RS-2026-000102",
      type: "NEW_CARD",
      applicantName: "Ramesh Ganpat Kale",
      mobile: "9822001122",
      aadhaar: "XXXXXXXX7719",
      rationCardNo: "PENDING_ISSUANCE",
      familyMembersCount: 5,
      annualIncome: 140000,
      category: "NPHH (Non-Priority)",
      address: "House 28, Ward 4, Junnar, District Pune",
      subDistrict: "Junnar",
      documents: [
        { name: "tahsildar_income_cert.pdf", sizeKb: 512, type: "application/pdf", uploadedAt: "2026-09-26T10:00:00Z" },
        { name: "electricity_bill_residence.pdf", sizeKb: 290, type: "application/pdf", uploadedAt: "2026-09-26T10:05:00Z" },
      ],
      status: "Under Verification",
      submittedAt: "2026-09-26T10:05:00Z",
      ruleVersion: "v1.0",
      slaDays: 15,
      slaBreached: false,
      history: [
        { status: "Submitted", timestamp: "2026-09-26T10:05:00Z", actor: "Ramesh Kale", actorRole: "Citizen" },
        { status: "Under Verification", timestamp: "2026-09-27T16:00:00Z", actor: "Clerk D. More", actorRole: "Supply Officer", remarks: "Address verification letter dispatched to Junnar circle inspector." },
      ],
    },
    {
      id: "RS-2026-000103",
      type: "ADDRESS_CHANGE",
      applicantName: "Sunita Ramesh Patil",
      mobile: "9876543210",
      aadhaar: "XXXXXXXX4821",
      rationCardNo: "MH-PN-1023",
      familyMembersCount: 4,
      annualIncome: 85000,
      category: "PHH (Priority)",
      address: "Flat 402, Sai Vihar, Kothrud, District Pune",
      subDistrict: "Pune City",
      documents: [
        { name: "registered_rent_agreement.pdf", sizeKb: 780, type: "application/pdf", uploadedAt: "2026-09-18T14:20:00Z" },
        { name: "gas_connection_slip.jpg", sizeKb: 310, type: "image/jpeg", uploadedAt: "2026-09-18T14:21:00Z" },
      ],
      status: "Approved",
      submittedAt: "2026-09-18T14:21:00Z",
      ruleVersion: "v1.0",
      slaDays: 15,
      slaBreached: false,
      history: [
        { status: "Submitted", timestamp: "2026-09-18T14:21:00Z", actor: "Sunita Patil", actorRole: "Citizen" },
        { status: "Under Verification", timestamp: "2026-09-20T10:00:00Z", actor: "Inspector R. Shinde", actorRole: "Supply Officer" },
        { status: "Pending Approval", timestamp: "2026-09-22T11:00:00Z", actor: "Inspector R. Shinde", actorRole: "Supply Officer" },
        { status: "Approved", timestamp: "2026-09-24T15:30:00Z", actor: "District Supply Officer", actorRole: "Supply Officer", remarks: "Address updated to Kothrud circle. FPS allocation shifted to Shop 142." },
        { status: "Card Issued", timestamp: "2026-09-25T11:00:00Z", actor: "System", actorRole: "System", remarks: "Updated digital ration card dispatched via SMS link." },
      ],
    },
    {
      id: "RS-2026-000104",
      type: "DUPLICATE",
      applicantName: "Anil Baban Jadhav",
      mobile: "9890011223",
      aadhaar: "XXXXXXXX9921",
      rationCardNo: "MH-PN-0877",
      familyMembersCount: 3,
      annualIncome: 60000,
      category: "PHH (Priority)",
      address: "Ganesh Krupa Niwas, Baramati, District Pune",
      subDistrict: "Baramati",
      documents: [
        { name: "police_loss_dairy_extract.pdf", sizeKb: 410, type: "application/pdf", uploadedAt: "2026-10-01T08:30:00Z" },
      ],
      status: "Submitted",
      submittedAt: "2026-10-01T08:30:00Z",
      ruleVersion: "v1.0",
      slaDays: 15,
      slaBreached: false,
      history: [
        { status: "Submitted", timestamp: "2026-10-01T08:30:00Z", actor: "Anil Jadhav", actorRole: "Citizen" },
      ],
    },
    {
      id: "RS-2026-000105",
      type: "REMOVE_MEMBER",
      applicantName: "Meena Eknath Shinde",
      mobile: "9765432109",
      aadhaar: "XXXXXXXX3312",
      rationCardNo: "MH-PN-0456",
      familyMembersCount: 6,
      annualIncome: 95000,
      category: "PHH (Priority)",
      address: "House 10, Somwar Peth, Ambegaon, District Pune",
      subDistrict: "Ambegaon",
      documents: [
        { name: "marriage_registration_daughter.pdf", sizeKb: 620, type: "application/pdf", uploadedAt: "2026-09-12T11:00:00Z" },
      ],
      status: "Clarification Required",
      submittedAt: "2026-09-12T11:00:00Z",
      ruleVersion: "v1.0",
      slaDays: 15,
      slaBreached: true,
      history: [
        { status: "Submitted", timestamp: "2026-09-12T11:00:00Z", actor: "Meena Shinde", actorRole: "Citizen" },
        { status: "Under Verification", timestamp: "2026-09-14T10:00:00Z", actor: "Clerk P. Joshi", actorRole: "Supply Officer" },
        { status: "Clarification Required", timestamp: "2026-09-20T16:45:00Z", actor: "Inspector R. Shinde", actorRole: "Supply Officer", remarks: "Marriage certificate seal is blurred and unreadable. Please upload a clear scanned copy of the registrar endorsement." },
      ],
    },
  ];

  return {
    requests: initialRequests,
    rules: initialRules,
    activeRuleVersion: "v1.0",
    smsLog: [
      {
        id: "SMS-101",
        requestId: "RS-2026-000101",
        mobile: "9876543210",
        message: "RationSeva: Your request RS-2026-000101 (Add Member) has been received. Track at rationseva.maha.gov.in.",
        sentAt: "2026-09-28T09:16:05Z",
        delivered: true,
      },
      {
        id: "SMS-103",
        requestId: "RS-2026-000103",
        mobile: "9876543210",
        message: "RationSeva: Your request RS-2026-000103 has been APPROVED by the District Supply Officer. Card issued.",
        sentAt: "2026-09-24T15:30:05Z",
        delivered: true,
      },
    ],
    otpStore: {},
  };
}

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const init = getInitialData();
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(init, null, 2), "utf8");
      return init;
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database, resetting to initial:", err);
    return getInitialData();
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const tmp = `${DB_PATH}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tmp, DB_PATH);
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

// ---------------- CRUD Functions ----------------

export function getAllRequests(filters?: { role?: string; mobile?: string; status?: string; type?: string }): ServiceRequest[] {
  const db = readDb();
  let list = db.requests;

  if (filters?.role === "citizen" && filters?.mobile) {
    list = list.filter((r) => r.mobile === filters.mobile);
  }
  if (filters?.status) {
    list = list.filter((r) => r.status === filters.status);
  }
  if (filters?.type) {
    list = list.filter((r) => r.type === filters.type);
  }

  // Update SLA breached flags based on current time (15 days SLA)
  const now = Date.now();
  return list.map((r) => {
    const ageDays = Math.floor((now - new Date(r.submittedAt).getTime()) / (1000 * 60 * 60 * 24));
    const isClosed = ["Approved", "Rejected", "Card Issued", "Closed"].includes(r.status);
    return {
      ...r,
      slaBreached: !isClosed && ageDays > r.slaDays,
    };
  });
}

export function getRequestById(id: string): ServiceRequest | null {
  const db = readDb();
  const req = db.requests.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
  if (!req) return null;

  const ageDays = Math.floor((Date.now() - new Date(req.submittedAt).getTime()) / (1000 * 60 * 60 * 24));
  const isClosed = ["Approved", "Rejected", "Card Issued", "Closed"].includes(req.status);
  return {
    ...req,
    slaBreached: !isClosed && ageDays > req.slaDays,
  };
}

export function createRequest(payload: {
  type: RequestType;
  applicantName: string;
  mobile: string;
  aadhaar: string;
  rationCardNo?: string;
  familyMembersCount: number;
  annualIncome: number;
  address: string;
  subDistrict?: string;
  documents: Array<{ name: string; sizeKb: number; type: string }>;
}): ServiceRequest {
  const db = readDb();
  const activeRuleSet = getActiveRules();
  const rule = activeRuleSet.rules.find((r) => r.type === payload.type);

  // Auto-categorize based on active rule limit
  const incomeLimit = rule ? rule.incomeLimit : 100000;
  const category = payload.annualIncome <= incomeLimit ? "PHH (Priority)" : "NPHH (Non-Priority)";

  const count = db.requests.length + 101;
  const id = `RS-2026-${String(count).padStart(6, "0")}`;
  const nowIso = new Date().toISOString();

  const newReq: ServiceRequest = {
    id,
    type: payload.type,
    applicantName: payload.applicantName.trim(),
    mobile: payload.mobile.trim(),
    aadhaar: payload.aadhaar.trim().slice(-4).padStart(12, "X"),
    rationCardNo: payload.type === "NEW_CARD" ? "PENDING_ISSUANCE" : (payload.rationCardNo || "MH-PN-0000"),
    familyMembersCount: payload.familyMembersCount,
    annualIncome: payload.annualIncome,
    category,
    address: payload.address.trim(),
    subDistrict: payload.subDistrict || "Haveli",
    documents: payload.documents.map((d) => ({ ...d, uploadedAt: nowIso })),
    status: "Submitted",
    submittedAt: nowIso,
    ruleVersion: activeRuleSet.version,
    slaDays: 15,
    slaBreached: false,
    history: [
      {
        status: "Submitted",
        timestamp: nowIso,
        actor: payload.applicantName,
        actorRole: "Citizen",
        remarks: "Online application submitted through RationSeva portal.",
      },
    ],
  };

  db.requests.unshift(newReq);

  // Dispatch SMS
  const smsId = `SMS-${Date.now().toString().slice(-4)}`;
  db.smsLog.unshift({
    id: smsId,
    requestId: id,
    mobile: payload.mobile,
    message: `RationSeva: Your application ${id} for ${payload.type} has been submitted. Track progress at rationseva.maha.gov.in.`,
    sentAt: nowIso,
    delivered: true,
  });

  writeDb(db);
  return newReq;
}

export function updateRequestStatus(
  id: string,
  newStatus: RequestStatus,
  actor: string,
  actorRole: "Supply Officer" | "System" | "Admin",
  remarks?: string
): ServiceRequest | null {
  const db = readDb();
  const index = db.requests.findIndex((r) => r.id.toLowerCase() === id.trim().toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const req = db.requests[index];

  req.status = newStatus;
  req.history.push({
    status: newStatus,
    timestamp: nowIso,
    actor,
    actorRole,
    remarks: remarks?.trim() || undefined,
  });

  // Trigger SMS on meaningful status change
  let smsText = "";
  if (newStatus === "Under Verification") {
    smsText = `RationSeva: Application ${id} is under document verification by District Supply Office.`;
  } else if (newStatus === "Clarification Required") {
    smsText = `RationSeva: Application ${id} requires clarification. Officer remarks: "${remarks}". Please login to re-upload.`;
  } else if (newStatus === "Approved") {
    smsText = `RationSeva: Congratulations! Your request ${id} has been APPROVED by the Supply Officer.`;
  } else if (newStatus === "Rejected") {
    smsText = `RationSeva: Application ${id} has been REJECTED. Reason: "${remarks}". You may appeal to DSO within 30 days.`;
  } else if (newStatus === "Card Issued") {
    smsText = `RationSeva: Your Ration Card for ${id} has been issued. Download digital copy or collect from DSO.`;
  }

  if (smsText) {
    db.smsLog.unshift({
      id: `SMS-${Date.now().toString().slice(-4)}`,
      requestId: id,
      mobile: req.mobile,
      message: smsText,
      sentAt: nowIso,
      delivered: true,
    });
  }

  db.requests[index] = req;
  writeDb(db);
  return req;
}

// ---------------- Rules & Change Management ----------------

export function getActiveRules(): RuleVersion {
  const db = readDb();
  const active = db.rules.find((r) => r.version === db.activeRuleVersion);
  return active || db.rules[0];
}

export function getAllRuleVersions(): RuleVersion[] {
  const db = readDb();
  return db.rules;
}

export function createNewRuleVersion(payload: {
  version: string;
  effectiveFrom: string;
  publishedBy: string;
  governmentOrderRef: string;
  summary: string;
  rules: EligibilityRule[];
}): RuleVersion {
  const db = readDb();
  const nowIso = new Date().toISOString();

  const newVersion: RuleVersion = {
    version: payload.version.trim(),
    effectiveFrom: payload.effectiveFrom,
    publishedAt: nowIso,
    publishedBy: payload.publishedBy.trim(),
    governmentOrderRef: payload.governmentOrderRef.trim(),
    summary: payload.summary.trim(),
    rules: payload.rules,
  };

  db.rules.unshift(newVersion);
  db.activeRuleVersion = newVersion.version;
  writeDb(db);
  return newVersion;
}

// ---------------- Dashboard Stats ----------------

export function getSystemStats() {
  const db = readDb();
  const total = db.requests.length;
  const now = Date.now();

  const openRequests = db.requests.filter((r) => !["Approved", "Rejected", "Card Issued", "Closed"].includes(r.status));
  const approved = db.requests.filter((r) => ["Approved", "Card Issued"].includes(r.status)).length;
  const rejected = db.requests.filter((r) => r.status === "Rejected").length;
  const clarification = db.requests.filter((r) => r.status === "Clarification Required").length;

  const breached = openRequests.filter((r) => {
    const ageDays = Math.floor((now - new Date(r.submittedAt).getTime()) / (1000 * 60 * 60 * 24));
    return ageDays > r.slaDays;
  }).length;

  // Breakdown by type
  const typeCounts: Record<string, number> = {};
  for (const t of REQUEST_TYPES) {
    typeCounts[t.id] = db.requests.filter((r) => r.type === t.id).length;
  }

  return {
    monthlyVolumeBaseline: 4000,
    monthlyMisplacedFilesBaseline: 120, // 3% of 4000
    digitalMisplacedFiles: 0,
    totalRegistered: total,
    pendingInQueue: openRequests.length,
    approvedCount: approved,
    rejectedCount: rejected,
    clarificationCount: clarification,
    slaBreachedCount: breached,
    activeRuleVersion: db.activeRuleVersion,
    defectRemovalEfficiency: 90, // percent
    defectDensity: 5.0, // per KLOC
    typeCounts,
    recentSms: db.smsLog.slice(0, 10),
  };
}

// ---------------- OTP Store ----------------

export function requestOtp(mobile: string, role: string): { otp: string; expiresAt: number } {
  const db = readDb();
  // Fixed demo OTP or generated 6-digit OTP
  const otp = mobile === "9876543210" ? "123456" : String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry (NFR-06)

  db.otpStore[mobile] = { otp, expiresAt, role };

  // Log to SMS
  db.smsLog.unshift({
    id: `OTP-${Date.now().toString().slice(-4)}`,
    requestId: "AUTH",
    mobile,
    message: `RationSeva: Your verification code is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
    sentAt: new Date().toISOString(),
    delivered: true,
  });

  writeDb(db);
  return { otp, expiresAt };
}

export function verifyOtp(mobile: string, inputOtp: string): { valid: boolean; role?: string; error?: string } {
  const db = readDb();
  const entry = db.otpStore[mobile];

  // In demo environment, 123456 or exact match passes
  if (inputOtp === "123456" || (entry && entry.otp === inputOtp && entry.expiresAt > Date.now())) {
    const role = entry?.role || "citizen";
    delete db.otpStore[mobile];
    writeDb(db);
    return { valid: true, role };
  }

  if (entry && entry.expiresAt <= Date.now()) {
    return { valid: false, error: "OTP has expired. Please request a new code." };
  }

  return { valid: false, error: "Invalid OTP code. Please enter the 6-digit code sent to your phone." };
}
