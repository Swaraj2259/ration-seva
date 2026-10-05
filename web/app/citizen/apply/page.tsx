"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { REQUEST_TYPES, RequestType } from "@/lib/types";
import SmsToast from "@/components/SmsToast";

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as RequestType) || "NEW_CARD";

  const [step, setStep] = useState(1);
  const [activeRules, setActiveRules] = useState<any>(null);
  const [loadingRules, setLoadingRules] = useState(true);

  // Form State
  const [selectedType, setSelectedType] = useState<RequestType>(initialType);
  const [applicantName, setApplicantName] = useState("Sunita Ramesh Patil");
  const [mobile, setMobile] = useState("9876543210");
  const [aadhaar, setAadhaar] = useState("542188994821");
  const [rationCardNo, setRationCardNo] = useState("MH-PN-1023");
  const [familyMembers, setFamilyMembers] = useState(4);
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [address, setAddress] = useState("Flat 402, Sai Vihar, Kothrud, Pune");
  const [subDistrict, setSubDistrict] = useState("Pune City");

  // Document Upload State
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; sizeKb: number; type: string }>>([
    { name: "aadhaar_card_applicant.pdf", sizeKb: 380, type: "application/pdf" },
    { name: "electricity_bill_residence.pdf", sizeKb: 450, type: "application/pdf" },
  ]);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [generatedRequest, setGeneratedRequest] = useState<any>(null);
  const [smsToast, setSmsToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rules")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setActiveRules(data.activeRules);
      })
      .catch((err) => console.error("Error fetching rules:", err))
      .finally(() => setLoadingRules(false));
  }, []);

  const currentRule = activeRules?.rules?.find((r: any) => r.type === selectedType) || {
    incomeLimit: 100000,
    minMembers: 1,
    maxMembers: 15,
  };

  const isPhh = annualIncome <= currentRule.incomeLimit;
  const isBvaValidMembers = familyMembers >= currentRule.minMembers && familyMembers <= currentRule.maxMembers;
  const isBvaValidIncome = annualIncome >= 0 && annualIncome <= 1000000;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError("");
    setIsUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "File upload failed.");

      setUploadedFiles((prev) => [...prev, ...data.files]);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const payload = {
        type: selectedType,
        applicantName,
        mobile,
        aadhaar,
        rationCardNo: selectedType === "NEW_CARD" ? undefined : rationCardNo,
        familyMembersCount: familyMembers,
        annualIncome,
        address,
        subDistrict,
        documents: uploadedFiles,
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request.");

      setGeneratedRequest(data.data);
      setSmsToast(`RationSeva: Your application ${data.data.id} has been submitted. Check online tracking.`);
      setStep(5);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Stepper Header */}
      <div className="stepper">
        <div className={`stepper-item ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
          <div className="stepper-circle">1</div>
          <span>Select Service</span>
        </div>
        <div className={`stepper-item ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
          <div className="stepper-circle">2</div>
          <span>Applicant Details</span>
        </div>
        <div className={`stepper-item ${step === 3 ? "active" : step > 3 ? "completed" : ""}`}>
          <div className="stepper-circle">3</div>
          <span>Document Proofs</span>
        </div>
        <div className={`stepper-item ${step === 4 ? "active" : step > 4 ? "completed" : ""}`}>
          <div className="stepper-circle">4</div>
          <span>Review &amp; Submit</span>
        </div>
        <div className={`stepper-item ${step === 5 ? "active completed" : ""}`}>
          <div className="stepper-circle">5</div>
          <span>Acknowledgement</span>
        </div>
      </div>

      {submitError && (
        <div className="badge badge-danger" style={{ display: "block", padding: "12px", marginBottom: "20px" }}>
          ⚠ {submitError}
        </div>
      )}

      {/* STEP 1: SELECT SERVICE */}
      {step === 1 && (
        <div className="panel">
          <h2>Step 1: Choose Ration Card Service Stream</h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            Select the statutory ration service stream you wish to request from the District Supply Office.
          </p>

          <div className="grid grid-cols-2" style={{ marginTop: "24px" }}>
            {REQUEST_TYPES.map((t) => {
              const isSelected = selectedType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`panel interactive ${isSelected ? "selected-card" : ""}`}
                  style={{
                    cursor: "pointer",
                    border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                    background: isSelected ? "var(--muted)" : "var(--card)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{t.icon}</div>
                  <h3 style={{ margin: "4px 0" }}>{t.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "6px 0 10px" }}>
                    Standard statutory turnaround: &le; 15 working days SLA.
                  </p>
                  <span className="badge badge-default" style={{ fontSize: "0.75rem" }}>
                    {t.docs.length} Mandatory Document(s)
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "28px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setStep(2)} className="btn btn-primary btn-lg">
              Next: Applicant Details &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: APPLICANT DETAILS WITH LIVE BVA VALIDATOR */}
      {step === 2 && (
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2>Step 2: Household Particulars &amp; Eligibility Boundary Validation</h2>
            <span className="badge badge-primary">Active Rules: {activeRules?.version || "v1.0"}</span>
          </div>

          <p style={{ color: "var(--muted-foreground)" }}>
            Inputs are evaluated in real-time against statutory boundary value rules (BVA) to prevent application rejection.
          </p>

          <div className="grid grid-cols-2" style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label className="form-label">Head of Family / Applicant Name *</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Mobile Number *</label>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="form-input"
                style={{ fontFamily: "var(--font-mono)" }}
                required
              />
              <span className="form-help">Will receive instant SMS at each approval milestone</span>
            </div>

            <div className="form-group">
              <label className="form-label">Aadhaar Card Number *</label>
              <input
                type="text"
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                className="form-input"
                style={{ fontFamily: "var(--font-mono)" }}
                required
              />
            </div>

            {selectedType !== "NEW_CARD" && (
              <div className="form-group">
                <label className="form-label">Existing Ration Card Number *</label>
                <input
                  type="text"
                  value={rationCardNo}
                  onChange={(e) => setRationCardNo(e.target.value.toUpperCase())}
                  className="form-input"
                  placeholder="MH-PN-1023"
                  style={{ fontFamily: "var(--font-mono)" }}
                  required
                />
              </div>
            )}
          </div>

          {/* BVA Visualizer Card */}
          <div className="panel" style={{ background: "var(--muted)", margin: "20px 0", border: "1px dashed var(--ring)" }}>
            <h4 style={{ margin: "0 0 10px", fontFamily: "var(--font-sans)" }}>
              ⚖️ Statutory Boundary Value Analysis (BVA Testing Engine)
            </h4>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  Total Family Member Count: <strong>{familyMembers}</strong>
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Number(e.target.value))}
                  className="form-input"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <div style={{ marginTop: "6px" }}>
                  {isBvaValidMembers ? (
                    <span className="badge badge-success">
                      ✔ Valid (Permitted: {currentRule.minMembers} to {currentRule.maxMembers} Members)
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      ✖ Boundary Breach: Must be between {currentRule.minMembers} and {currentRule.maxMembers}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Annual Household Income: <strong>₹{annualIncome.toLocaleString("en-IN")}</strong>
                </label>
                <input
                  type="number"
                  min={0}
                  max={1000000}
                  step={5000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="form-input"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <div style={{ marginTop: "6px" }}>
                  {isPhh ? (
                    <span className="badge badge-success">
                      ✔ Priority Household (PHH) &le; ₹{currentRule.incomeLimit.toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      ℹ Non-Priority Household (NPHH) &gt; ₹{currentRule.incomeLimit.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Complete Residential Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ marginTop: "28px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} className="btn btn-outline">
              &larr; Back to Services
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!isBvaValidMembers || !applicantName || !mobile}
              className="btn btn-primary btn-lg"
            >
              Next: Upload Proofs &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DOCUMENT UPLOAD ENGINE */}
      {step === 3 && (
        <div className="panel">
          <h2>Step 3: Upload Documentary Evidence</h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            Attach clear, legible scanned proofs (SRS FR-03, NFR-05). Enforced limits: Maximum 2 MB per file, PDF or JPG/PNG only.
          </p>

          <div
            className="panel"
            style={{
              border: "2px dashed var(--ring)",
              textAlign: "center",
              padding: "36px 20px",
              background: "var(--muted)",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📎</div>
            <h4 style={{ margin: "0 0 6px" }}>Select or Drag Documents to Upload</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "0 0 16px" }}>
              Accepted formats: .pdf, .jpg, .png (Max 2 MB per file)
            </p>

            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={isUploading}
              style={{ display: "none" }}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="btn btn-secondary" style={{ cursor: "pointer" }}>
              {isUploading ? "Validating & Uploading..." : "Choose Files from Device"}
            </label>
          </div>

          {uploadError && (
            <div className="badge badge-danger" style={{ display: "block", padding: "10px", marginBottom: "16px" }}>
              ⚠ {uploadError}
            </div>
          )}

          <h4>Attached Dossier Documents ({uploadedFiles.length})</h4>
          {uploadedFiles.length === 0 ? (
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>No documents attached yet.</p>
          ) : (
            <div className="table-container" style={{ marginBottom: "24px" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>File Size</th>
                    <th>Format</th>
                    <th>Verification Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((f, i) => (
                    <tr key={i}>
                      <td>
                        <strong style={{ fontFamily: "var(--font-mono)" }}>{f.name}</strong>
                      </td>
                      <td>{f.sizeKb} KB</td>
                      <td>
                        <span className="badge badge-default">{f.type}</span>
                      </td>
                      <td>
                        <span className="badge badge-success">✔ &le; 2 MB Verified</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="btn btn-destructive btn-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button onClick={() => setStep(2)} className="btn btn-outline">
              &larr; Back to Details
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={uploadedFiles.length === 0}
              className="btn btn-primary btn-lg"
            >
              Next: Review &amp; Submit &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONFIRM */}
      {step === 4 && (
        <div className="panel">
          <h2>Step 4: Formal Verification &amp; Statutory Declaration</h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            Please review the application summary carefully before submitting to the District Supply Office review queue.
          </p>

          <div className="panel" style={{ background: "var(--muted)", margin: "20px 0" }}>
            <h4 style={{ margin: "0 0 12px" }}>Application Dossier Summary</h4>
            <div className="grid grid-cols-2">
              <div>
                <span className="form-help">Requested Service:</span>
                <div><strong>{REQUEST_TYPES.find((t) => t.id === selectedType)?.name}</strong></div>
              </div>
              <div>
                <span className="form-help">Applicant Name:</span>
                <div><strong>{applicantName}</strong></div>
              </div>
              <div>
                <span className="form-help">Mobile:</span>
                <div style={{ fontFamily: "var(--font-mono)" }}>+91 {mobile}</div>
              </div>
              <div>
                <span className="form-help">Aadhaar Reference:</span>
                <div style={{ fontFamily: "var(--font-mono)" }}>XXXXXXXX{aadhaar.slice(-4)}</div>
              </div>
              <div>
                <span className="form-help">Family Size:</span>
                <div><strong>{familyMembers} Members</strong> (Quota: &le; 15)</div>
              </div>
              <div>
                <span className="form-help">Household Category:</span>
                <div>
                  <span className={isPhh ? "badge badge-success" : "badge badge-warning"}>
                    {isPhh ? "PHH (Priority)" : "NPHH (Non-Priority)"} (₹{annualIncome.toLocaleString("en-IN")})
                  </span>
                </div>
              </div>
              <div>
                <span className="form-help">Address:</span>
                <div>{address}</div>
              </div>
              <div>
                <span className="form-help">Documents Attached:</span>
                <div><strong>{uploadedFiles.length} Scanned Files</strong></div>
              </div>
            </div>
          </div>

          <div style={{ margin: "20px 0", padding: "16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ marginTop: "4px" }} />
              <span style={{ fontSize: "0.85rem" }}>
                I hereby solemnly declare that all particulars furnished above are true and correct to the best of my knowledge.
                I understand that submitting fabricated proofs or holding duplicate ration cards across circles constitutes an offense
                punishable under the Essential Commodities Act, 1955.
              </span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button onClick={() => setStep(3)} className="btn btn-outline">
              &larr; Back to Uploads
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
            >
              {isSubmitting ? "Submitting Application..." : "✔ Confirm &amp; Submit Application"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ACKNOWLEDGEMENT */}
      {step === 5 && generatedRequest && (
        <div className="panel" style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🎉</div>
          <h2 style={{ margin: "0 0 8px" }}>Application Received Successfully</h2>
          <p style={{ color: "var(--muted-foreground)", maxWidth: "560px", margin: "0 auto 24px" }}>
            Your application has been assigned to the District Supply Officer review queue (FIFO, Oldest First).
          </p>

          <div
            className="panel"
            style={{
              display: "inline-block",
              background: "var(--muted)",
              border: "2px solid var(--primary)",
              padding: "20px 40px",
              marginBottom: "24px",
            }}
          >
            <span className="form-help" style={{ textTransform: "uppercase" }}>Unique Tracking Dossier ID</span>
            <div style={{ fontSize: "2rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--primary)" }}>
              {generatedRequest.id}
            </div>
            <span className="badge badge-success" style={{ marginTop: "6px" }}>
              Status: {generatedRequest.status}
            </span>
          </div>

          <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", maxWidth: "520px", margin: "0 auto 28px" }}>
            An automated SMS acknowledgment with your tracking link has been dispatched to <strong>+91 {mobile}</strong>.
            Expected statutory adjudication date: <strong>&le; 15 working days</strong>.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href={`/citizen/track?id=${generatedRequest.id}`} className="btn btn-primary btn-lg">
              Track Status in Real-Time &rarr;
            </Link>
            <Link href="/citizen" className="btn btn-secondary btn-lg">
              Return to Citizen Dashboard
            </Link>
          </div>
        </div>
      )}

      <SmsToast message={smsToast || undefined} onClose={() => setSmsToast(null)} />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="panel">Loading application wizard...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
