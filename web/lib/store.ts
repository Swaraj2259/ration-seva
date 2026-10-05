// Mock data + localStorage store. No backend – prototype only.
"use client";
import { useEffect, useState, useCallback } from "react";

export const REQUEST_TYPES = [
  { id: "NEW_CARD", name: "New Ration Card", icon: "🆕", docs: ["Address proof", "Aadhaar of all members", "Income certificate"] },
  { id: "ADD_MEMBER", name: "Add Member", icon: "➕", docs: ["Birth / Marriage certificate", "Aadhaar of new member"] },
  { id: "REMOVE_MEMBER", name: "Remove Member", icon: "➖", docs: ["Death / Marriage / Migration proof"] },
  { id: "ADDRESS_CHANGE", name: "Address Change", icon: "🏠", docs: ["New address proof"] },
  { id: "DUPLICATE", name: "Duplicate Card", icon: "📄", docs: ["FIR / Self-declaration or damaged card"] },
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number]["id"];
export type Status =
  | "Submitted" | "Under Verification" | "Clarification Required" | "Pending Approval"
  | "Approved" | "Rejected" | "Card Issued" | "Closed";

export interface HistoryItem { status: Status; at: string; by: string; remarks?: string }
export interface ServiceRequest {
  id: string; type: RequestType; applicant: string; mobile: string; cardNo: string;
  members: number; income: number; docs: string[]; status: Status; submittedOn: string;
  ruleVersion: string; history: HistoryItem[];
}
export interface Rule {
  type: RequestType; incomeLimit: number; minMembers: number; maxMembers: number; docs: string;
}
export interface RuleSet { version: string; effectiveFrom: string; rules: Rule[] }
export interface RuleLog { version: string; date: string; by: string; note: string }

export const typeName = (t: RequestType) => REQUEST_TYPES.find((x) => x.id === t)?.name ?? t;

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

const SEED_REQUESTS: ServiceRequest[] = [
  mk("RS-2026-000101", "ADD_MEMBER", "Sunita Patil", "9876543210", "MH-PN-1023", 4, 85000, "Pending Approval", 3),
  mk("RS-2026-000102", "NEW_CARD", "Ramesh Kale", "9822001122", "—", 5, 140000, "Under Verification", 6),
  mk("RS-2026-000103", "ADDRESS_CHANGE", "Sunita Patil", "9876543210", "MH-PN-1023", 4, 85000, "Approved", 12),
  mk("RS-2026-000104", "DUPLICATE", "Anil Jadhav", "9890011223", "MH-PN-0877", 3, 60000, "Submitted", 1),
  mk("RS-2026-000105", "REMOVE_MEMBER", "Meena Shinde", "9765432109", "MH-PN-0456", 6, 95000, "Pending Approval", 18),
];

function mk(id: string, type: RequestType, applicant: string, mobile: string, cardNo: string,
  members: number, income: number, status: Status, age: number): ServiceRequest {
  const flow: Status[] = ["Submitted", "Under Verification", "Pending Approval", "Approved"];
  const upto = flow.indexOf(status);
  const history = flow.slice(0, upto + 1).map((s, i) => ({ status: s, at: daysAgo(age - i), by: i === 0 ? "Citizen" : "Officer" }));
  return { id, type, applicant, mobile, cardNo, members, income, docs: ["aadhaar.pdf", "proof.jpg"], status,
    submittedOn: daysAgo(age), ruleVersion: "v1.0", history };
}

const SEED_RULES: RuleSet = {
  version: "v1.0", effectiveFrom: "2026-11-01",
  rules: REQUEST_TYPES.map((t) => ({ type: t.id, incomeLimit: 100000, minMembers: 1, maxMembers: 15, docs: t.docs.join(", ") })),
};
const SEED_LOG: RuleLog[] = [{ version: "v1.0", date: "2026-11-01", by: "Admin", note: "Initial rules as per State GO 01/2026" }];

function useLocal<T>(key: string, seed: T) {
  const [val, setVal] = useState<T>(seed);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) setVal(JSON.parse(raw));
  }, [key]);
  const save = useCallback((v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); }, [key]);
  return [val, save] as const;
}

export const useRequests = () => useLocal<ServiceRequest[]>("rs_requests", SEED_REQUESTS);
export const useRules = () => useLocal<RuleSet>("rs_rules", SEED_RULES);
export const useRuleLog = () => useLocal<RuleLog[]>("rs_rulelog", SEED_LOG);
export const useRole = () => useLocal<string>("rs_role", "");

export const newRequestId = (list: ServiceRequest[]) =>
  `RS-2026-${String(101 + list.length).padStart(6, "0")}`;

export const ageDays = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
export { today };

export function statusClass(s: Status) {
  if (s === "Approved" || s === "Card Issued" || s === "Closed") return "badge green";
  if (s === "Rejected") return "badge red";
  if (s === "Clarification Required") return "badge orange";
  return "badge blue";
}
