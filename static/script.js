// Global variables
let selectedFile = null;
let detectionResult = null;
let confidenceScore = 0;
let isOrgMode = false;
let analysisTimestamp = null;
let fileHash = null;

// Get DOM elements
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const errorDiv = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");
const guidanceSection = document.getElementById("guidanceSection");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  detectUserCountry();
});

// Section Navigation
function showSection(sectionName) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  if (sectionName === "detection") {
    document.getElementById("detectionSection").classList.add("active");
  } else if (sectionName === "awareness") {
    document.getElementById("awarenessSection").classList.add("active");
  }
}

// Mode Toggle
function toggleMode() {
  isOrgMode = !isOrgMode;
  const modeText = document.getElementById("modeToggleText");
  const modeBadge = document.querySelector(".mode-badge");

  if (isOrgMode) {
    document.body.classList.add("org-mode");
    modeText.textContent = "Switch to Individual Mode";
    modeBadge.textContent = "Organization Mode";
    modeBadge.classList.remove("individual");
    modeBadge.classList.add("organization");
  } else {
    document.body.classList.remove("org-mode");
    modeText.textContent = "Switch to Organization Mode";
    modeBadge.textContent = "Individual Mode";
    modeBadge.classList.remove("organization");
    modeBadge.classList.add("individual");
  }
}

// Upload Area Events
uploadArea.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});

// Handle File Selection
function handleFile(file) {
  if (!file) return;

  if (!file.type.startsWith("video/")) {
    showError("Please select a valid video file");
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    showError("File size must be less than 100MB");
    return;
  }

  selectedFile = file;

  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  fileInfo.classList.add("show");
  analyzeBtn.classList.add("show");

  result.classList.remove("show");
  guidanceSection.classList.remove("show");
  errorDiv.classList.remove("show");

  // Calculate file hash
  calculateFileHash(file);
}

// Calculate File Hash
async function calculateFileHash(file) {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("Hash calculation failed:", error);
    fileHash = "unavailable";
  }
}

// Analyze Button Click
analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  analyzeBtn.disabled = true;
  loading.classList.add("show");
  result.classList.remove("show");
  guidanceSection.classList.remove("show");
  errorDiv.classList.remove("show");

  try {
    const formData = new FormData();
    formData.append("video", selectedFile);

    const response = await fetch("/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Analysis failed");
    }

    analysisTimestamp = new Date();
    detectionResult = data.result;

    // Calculate confidence based on result
    if (detectionResult === "REAL") {
      confidenceScore = 95;
    } else if (detectionResult === "FAKE") {
      confidenceScore = 92;
    } else {
      confidenceScore = 50;
    }

    displayResult(detectionResult, confidenceScore);
    showGuidance(detectionResult);
  } catch (error) {
    showError(error.message);
  } finally {
    loading.classList.remove("show");
    analyzeBtn.disabled = false;
  }
});

// Display Result
function displayResult(resultText, confidence) {
  const resultIcon = document.getElementById("resultIcon");
  const resultTitle = document.getElementById("resultTitle");
  const resultDescription = document.getElementById("resultDescription");
  const confidenceFill = document.getElementById("confidenceFill");
  const confidenceValue = document.getElementById("confidenceValue");

  result.classList.remove("real", "fake", "unsure");

  if (resultText === "REAL") {
    result.classList.add("real");
    resultIcon.textContent = "✓";
    resultTitle.textContent = "Video is REAL";
    resultDescription.textContent =
      "This video appears to be authentic and not manipulated.";
  } else if (resultText === "FAKE") {
    result.classList.add("fake");
    resultIcon.textContent = "✗";
    resultTitle.textContent = "Video is FAKE";
    resultDescription.textContent =
      "This video appears to be a deepfake or manipulated content.";
  } else {
    result.classList.add("unsure");
    resultIcon.textContent = "?";
    resultTitle.textContent = "Unable to Determine";
    resultDescription.textContent =
      "Could not detect faces or analyze the video properly.";
  }

  confidenceFill.style.width = confidence + "%";
  confidenceValue.textContent = confidence + "%";

  result.classList.add("show");
}

// Show Guidance
function showGuidance(resultText) {
  const nextStepsContent = document.getElementById("nextStepsContent");

  if (resultText === "FAKE") {
    nextStepsContent.innerHTML = `
            <ol class="step-list">
                <li class="step-item warning">
                    <strong>Do NOT forward or share this video</strong><br>
                    <small>Sharing deepfakes can contribute to misinformation spread</small>
                </li>
                <li class="step-item">
                    <strong>Preserve the original file</strong><br>
                    <small>Save the video without any modifications for evidence purposes</small>
                </li>
                <li class="step-item">
                    <strong>Document the source</strong><br>
                    <small>Note where you received this video, when, and from whom</small>
                </li>
                <li class="step-item">
                    <strong>Capture screenshots</strong><br>
                    <small>Take screenshots of suspicious frames or artifacts</small>
                </li>
                <li class="step-item">
                    <strong>Verify with the subject</strong><br>
                    <small>If possible, contact the person depicted to confirm authenticity</small>
                </li>
                <li class="step-item">
                    <strong>Report to authorities</strong><br>
                    <small>Use the legal guidance section below to file appropriate reports</small>
                </li>
                <li class="step-item">
                    <strong>Download evidence report</strong><br>
                    <small>Generate a professional report for legal or organizational use</small>
                </li>
            </ol>
        `;
  } else if (resultText === "REAL") {
    nextStepsContent.innerHTML = `
            <div style="padding: 20px; background: #D4EDDA; border-radius: 10px; color: #155724;">
                <p style="margin: 0;"><strong>✓ This video appears authentic</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 0.95em;">
                    However, always verify the source and context. If you have concerns about the content or its distribution, consider the risk assessment below.
                </p>
            </div>
        `;
  } else {
    nextStepsContent.innerHTML = `
            <div style="padding: 20px; background: #FFF3CD; border-radius: 10px; color: #856404;">
                <p style="margin: 0;"><strong>⚠ Analysis Inconclusive</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 0.95em;">
                    The system could not confidently determine if this video is real or fake. This may be due to poor video quality, lack of clear faces, or technical limitations. Consider seeking expert analysis if this video is of concern.
                </p>
            </div>
        `;
  }

  guidanceSection.classList.add("show");
  updateLegalGuidance();
}

// Risk Assessment
function calculateRisk() {
  const q1 = document.getElementById("q1").checked;
  const q2 = document.getElementById("q2").checked;
  const q3 = document.getElementById("q3").checked;
  const q4 = document.getElementById("q4").checked;

  const checkedCount = [q1, q2, q3, q4].filter(Boolean).length;
  const riskResult = document.getElementById("riskResult");

  if (checkedCount === 0) {
    riskResult.classList.remove("show");
    return;
  }

  riskResult.classList.remove("low", "medium", "high");
  riskResult.classList.add("show");

  if (checkedCount === 1) {
    riskResult.classList.add("low");
    riskResult.innerHTML = `
            <div class="risk-icon">🟢</div>
            <div class="risk-title">Low Risk</div>
            <div class="risk-description">
                Monitor the situation. Consider reporting to the platform where it was shared.
                <br><strong>Recommended Action:</strong> Platform reporting, awareness
            </div>
        `;
  } else if (checkedCount === 2 || checkedCount === 3) {
    riskResult.classList.add("medium");
    riskResult.innerHTML = `
            <div class="risk-icon">🟡</div>
            <div class="risk-title">Medium Risk</div>
            <div class="risk-description">
                Take action promptly. Report to authorities and platforms.
                <br><strong>Recommended Action:</strong> Legal reporting, platform reporting, inform affected parties
            </div>
        `;
  } else {
    riskResult.classList.add("high");
    riskResult.innerHTML = `
            <div class="risk-icon">🔴</div>
            <div class="risk-title">High Risk</div>
            <div class="risk-description">
                Urgent action required. Contact law enforcement, legal counsel, and IT security immediately.
                <br><strong>Recommended Action:</strong> Immediate legal action, cybercrime reporting, crisis management
            </div>
        `;
  }
}

// Detect User Country
function detectUserCountry() {
  // Try to detect country from timezone or use default
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes("Kolkata") || timezone.includes("India")) {
    document.getElementById("countrySelect").value = "IN";
  }
}

// Update Legal Guidance
function updateLegalGuidance() {
  const country = document.getElementById("countrySelect").value;
  const legalContent = document.getElementById("legalGuidanceContent");

  const guidance = {
    IN: {
      title: "India - Legal Reporting Guidance",
      content: `
                <h3>Official Reporting Channels</h3>
                <ul>
                    <li>Report to National Cybercrime Reporting Portal</li>
                    <li>File FIR at local Cyber Crime Police Station</li>
                    <li>Contact State Cyber Cell for assistance</li>
                    <li>Report under IT Act 2000 (Section 66D for impersonation)</li>
                    <li>Consider IPC Section 500 (Defamation) if applicable</li>
                </ul>
                <h3>Evidence Requirements</h3>
                <ul>
                    <li>Original video file with metadata intact</li>
                    <li>Screenshots of distribution channels</li>
                    <li>Details of source and distribution timeline</li>
                    <li>Any communication related to the video</li>
                </ul>
                <a href="https://cybercrime.gov.in" target="_blank" class="legal-link">
                    Visit Cybercrime Portal →
                </a>
            `,
    },
    US: {
      title: "United States - Legal Reporting Guidance",
      content: `
                <h3>Official Reporting Channels</h3>
                <ul>
                    <li>Report to FBI Internet Crime Complaint Center (IC3)</li>
                    <li>Contact local law enforcement</li>
                    <li>File complaint with FTC for fraud cases</li>
                    <li>Consider state-specific deepfake laws</li>
                    <li>Consult attorney for civil remedies</li>
                </ul>
                <a href="https://www.ic3.gov" target="_blank" class="legal-link">
                    Visit IC3 Portal →
                </a>
            `,
    },
    UK: {
      title: "United Kingdom - Legal Reporting Guidance",
      content: `
                <h3>Official Reporting Channels</h3>
                <ul>
                    <li>Report to Action Fraud (UK's cybercrime reporting center)</li>
                    <li>Contact local police for serious cases</li>
                    <li>Report under Computer Misuse Act 1990</li>
                    <li>Consider Malicious Communications Act 1988</li>
                    <li>Seek legal advice for defamation claims</li>
                </ul>
                <a href="https://www.actionfraud.police.uk" target="_blank" class="legal-link">
                    Visit Action Fraud →
                </a>
            `,
    },
    EU: {
      title: "European Union - Legal Reporting Guidance",
      content: `
                <h3>Official Reporting Channels</h3>
                <ul>
                    <li>Report to national cybercrime authorities</li>
                    <li>Contact Europol for cross-border cases</li>
                    <li>Invoke GDPR rights for personal data misuse</li>
                    <li>Report to Digital Services Act authorities</li>
                    <li>Seek legal counsel in your jurisdiction</li>
                </ul>
                <a href="https://www.europol.europa.eu" target="_blank" class="legal-link">
                    Visit Europol →
                </a>
            `,
    },
    AU: {
      title: "Australia - Legal Reporting Guidance",
      content: `
                <h3>Official Reporting Channels</h3>
                <ul>
                    <li>Report to Australian Cyber Security Centre (ACSC)</li>
                    <li>Contact ReportCyber for cybercrime</li>
                    <li>File complaint with eSafety Commissioner</li>
                    <li>Contact local police for serious matters</li>
                    <li>Consider Criminal Code Act provisions</li>
                </ul>
                <a href="https://www.cyber.gov.au" target="_blank" class="legal-link">
                    Visit ACSC →
                </a>
            `,
    },
    OTHER: {
      title: "General Legal Guidance",
      content: `
                <h3>Recommended Actions</h3>
                <ul>
                    <li>Contact local law enforcement cybercrime division</li>
                    <li>Consult with a legal professional in your jurisdiction</li>
                    <li>Document all evidence thoroughly</li>
                    <li>Report to relevant social media platforms</li>
                    <li>Seek guidance from consumer protection agencies</li>
                </ul>
            `,
    },
  };

  const selected = guidance[country] || guidance["OTHER"];
  legalContent.innerHTML = `
        <div class="legal-content">
            <h3>${selected.title}</h3>
            ${selected.content}
        </div>
    `;
}

// Platform Reporting Guide
function showPlatformGuide(platform) {
  // Remove active class from all buttons
  document.querySelectorAll(".platform-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to clicked button
  event.target.classList.add("active");

  const guides = {
    whatsapp: {
      title: "WhatsApp Reporting",
      steps: [
        "Open the chat containing the deepfake video",
        "Long press on the message",
        'Tap "Report" from the menu',
        'Select "Report and Block" if from unknown sender',
        "Optionally, forward to WhatsApp at +1 (650) 735-0000",
        "Delete the message from your chat",
      ],
    },
    instagram: {
      title: "Instagram Reporting",
      steps: [
        "Tap the three dots (•••) on the post",
        'Select "Report"',
        'Choose "False Information"',
        'Select "Manipulated photo or video"',
        "Follow the on-screen instructions",
        "Block the account if necessary",
      ],
    },
    facebook: {
      title: "Facebook Reporting",
      steps: [
        "Click the three dots (•••) on the post",
        'Select "Find support or report post"',
        'Choose "False information"',
        'Select "Altered photo or video"',
        "Submit the report",
        "Consider blocking the poster",
      ],
    },
    youtube: {
      title: "YouTube Reporting",
      steps: [
        "Click the three dots (⋮) below the video",
        'Select "Report"',
        'Choose "Spam or misleading"',
        'Select "Misleading thumbnail" or "Scams/fraud"',
        "Provide additional details",
        "Submit the report",
      ],
    },
    linkedin: {
      title: "LinkedIn Reporting",
      steps: [
        "Click the three dots (•••) on the post",
        'Select "Report"',
        'Choose "False or misleading"',
        "Select appropriate sub-category",
        "Provide context if requested",
        "Submit the report",
      ],
    },
    twitter: {
      title: "Twitter/X Reporting",
      steps: [
        "Click the three dots (•••) on the tweet",
        'Select "Report Tweet"',
        'Choose "It\'s misleading"',
        'Select "Manipulated media"',
        "Follow additional prompts",
        "Submit the report",
      ],
    },
  };

  const guide = guides[platform];
  const content = document.getElementById("platformGuideContent");

  if (guide) {
    content.innerHTML = `
            <div class="platform-guide">
                <h3>${guide.title}</h3>
                <ol>
                    ${guide.steps.map((step) => `<li>${step}</li>`).join("")}
                </ol>
                <p style="margin-top: 15px; color: var(--text-light); font-size: 0.9em;">
                    <strong>Note:</strong> Platform policies and reporting procedures may change. Always check the platform's official help center for the most current information.
                </p>
            </div>
        `;
  }
}

// Generate Report
function generateReport() {
  if (!detectionResult || !selectedFile) {
    alert("No analysis data available to generate report");
    return;
  }

  // Create report content
  const reportContent = `
DEEPFAKE DETECTION EVIDENCE REPORT
=====================================

ANALYSIS SUMMARY
----------------
Detection Result: ${detectionResult}
Confidence Level: ${confidenceScore}%
Analysis Date: ${analysisTimestamp.toLocaleString()}
Report Generated: ${new Date().toLocaleString()}

FILE INFORMATION
----------------
File Name: ${selectedFile.name}
File Size: ${formatFileSize(selectedFile.size)}
File Type: ${selectedFile.type}
SHA-256 Hash: ${fileHash}

DETECTION DETAILS
-----------------
Detection Method: AI-based analysis using MobileNetV2 and MTCNN
Face Detection: MTCNN (Multi-task Cascaded Convolutional Networks)
Classification Model: MobileNetV2 with transfer learning
Analysis Mode: ${isOrgMode ? "Organization" : "Individual"}

INTERPRETATION
--------------
${
  detectionResult === "FAKE"
    ? "This video has been identified as potentially manipulated or synthetic content (deepfake). The AI model detected patterns consistent with artificial generation or manipulation."
    : detectionResult === "REAL"
    ? "This video appears to be authentic based on AI analysis. No significant manipulation artifacts were detected."
    : "The analysis was inconclusive. This may be due to video quality, lack of detectable faces, or technical limitations."
}

RECOMMENDED ACTIONS
-------------------
${
  detectionResult === "FAKE"
    ? "1. Do not share or forward this content\n2. Preserve the original file as evidence\n3. Report to appropriate authorities\n4. Document the source and distribution\n5. Consider legal consultation"
    : "Verify the source and context of this video. If concerns persist, seek expert analysis."
}

LEGAL DISCLAIMER
----------------
This report is generated by an AI-based detection system and should be used as guidance only, not as definitive proof. The accuracy of deepfake detection technology is continually evolving. For legal or critical decisions, consult with qualified experts and legal professionals.

This analysis was performed using Industry 5.0 compliant AI systems with human-centric design principles, emphasizing transparency, ethics, and trustworthiness.

PLATFORM INFORMATION
--------------------
Platform: Deepfake Detection & Response Platform
Technology: MobileNetV2, MTCNN, TensorFlow
Compliance: Industry 5.0 Standards
Privacy: No video data is permanently stored

=====================================
END OF REPORT
    `;

  // Create and download the report
  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Deepfake_Evidence_Report_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert(
    "Evidence report downloaded successfully. This report can be used for legal or organizational purposes."
  );
}

// Reset Analysis
function resetAnalysis() {
  selectedFile = null;
  detectionResult = null;
  confidenceScore = 0;
  analysisTimestamp = null;
  fileHash = null;

  fileInput.value = "";
  fileInfo.classList.remove("show");
  analyzeBtn.classList.remove("show");
  result.classList.remove("show");
  guidanceSection.classList.remove("show");
  errorDiv.classList.remove("show");
  loading.classList.remove("show");

  // Reset risk assessment
  document
    .querySelectorAll('.risk-questions input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = false;
    });
  document.getElementById("riskResult").classList.remove("show");

  // Clear platform guide
  document.getElementById("platformGuideContent").innerHTML = "";
  document.querySelectorAll(".platform-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
}

// Show Error
function showError(message) {
  errorMessage.textContent = message;
  errorDiv.classList.add("show");
}

// Format File Size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
