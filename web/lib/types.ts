export const REQUEST_TYPES = [
  { id: "NEW_CARD", name: "New Ration Card", code: "NC", icon: "🌾", docs: ["Proof of Residence", "Aadhaar Cards of all members", "Income Certificate from Tahsildar"] },
  { id: "ADD_MEMBER", name: "Add Member to Card", code: "AM", icon: "➕", docs: ["Birth Certificate / Marriage Certificate", "Aadhaar Card of New Member"] },
  { id: "REMOVE_MEMBER", name: "Remove Member from Card", code: "RM", icon: "➖", docs: ["Death Certificate / Marriage Certificate / Migration NOC"] },
  { id: "ADDRESS_CHANGE", name: "Change Residence Address", code: "AC", icon: "🏠", docs: ["New Electricity Bill / Water Bill / Registered Lease Deed"] },
  { id: "DUPLICATE", name: "Duplicate Ration Card", code: "DC", icon: "📄", docs: ["Police Lost-Report / Self-Declaration Affidavit / Damaged Card"] },
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number]["id"];

export type RequestStatus =
  | "Submitted"
  | "Under Verification"
  | "Clarification Required"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Card Issued"
  | "Closed";

export interface HistoryEntry {
  status: RequestStatus;
  timestamp: string;
  actor: string;
  actorRole: "Citizen" | "Supply Officer" | "System" | "Admin";
  remarks?: string;
}

export interface ServiceRequest {
  id: string;
  type: RequestType;
  applicantName: string;
  mobile: string;
  aadhaar: string;
  rationCardNo: string;
  familyMembersCount: number;
  annualIncome: number;
  category: "PHH (Priority)" | "NPHH (Non-Priority)";
  address: string;
  subDistrict: string;
  documents: Array<{ name: string; sizeKb: number; type: string; uploadedAt: string }>;
  status: RequestStatus;
  submittedAt: string;
  ruleVersion: string;
  slaDays: number;
  slaBreached: boolean;
  history: HistoryEntry[];
}

export interface EligibilityRule {
  type: RequestType;
  incomeLimit: number;
  minMembers: number;
  maxMembers: number;
  requiredDocs: string[];
}

export interface RuleVersion {
  version: string;
  effectiveFrom: string;
  publishedAt: string;
  publishedBy: string;
  governmentOrderRef: string;
  summary: string;
  rules: EligibilityRule[];
}

export interface SmsNotification {
  id: string;
  requestId: string;
  mobile: string;
  message: string;
  sentAt: string;
  delivered: boolean;
}
