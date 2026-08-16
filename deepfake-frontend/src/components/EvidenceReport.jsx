import { formatFileSize } from "../services/api";

const EvidenceReport = ({ analysisData, isOrgMode }) => {
  const { result, confidence, file, fileHash, timestamp } = analysisData;

  const generateReport = () => {
    const reportDate = new Date();
    const reportContent = `
═══════════════════════════════════════════════════════════════
         DEEPFAKE DETECTION EVIDENCE REPORT
         Professional Documentation for Legal/Organizational Use
═══════════════════════════════════════════════════════════════

REPORT METADATA
───────────────
Report Generated: ${reportDate.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}
Report Version: 1.0
Report Type: ${isOrgMode ? "Organization" : "Individual"} Analysis
Platform: Deepfake Detection & Response Platform

═══════════════════════════════════════════════════════════════
SECTION 1: ANALYSIS SUMMARY
═══════════════════════════════════════════════════════════════

Detection Result: ${result}
Confidence Level: ${confidence}%
Analysis Date: ${timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
Analysis Mode: ${isOrgMode ? "Organization" : "Individual"}

Result Interpretation:
${result === "FAKE"
        ? "This video has been identified as potentially manipulated or synthetic content (deepfake). The AI model detected patterns consistent with artificial generation or manipulation. The confidence level indicates the system's assessment of manipulation likelihood."
        : result === "REAL"
          ? "This video appears to be authentic based on AI analysis. No significant manipulation artifacts were detected. However, automated detection systems are not infallible, and results should be considered alongside other verification methods."
          : "The analysis was inconclusive. This may be due to video quality, lack of detectable faces, compression artifacts, or technical limitations. Expert forensic analysis may be required for definitive determination."
      }

═══════════════════════════════════════════════════════════════
SECTION 2: FILE INFORMATION
═══════════════════════════════════════════════════════════════

File Name: ${file.name}
File Size: ${formatFileSize(file.size)}
File Type: ${file.type}
File Last Modified: ${file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Not available'}

Cryptographic Hash (SHA-256):
${fileHash}

Hash Verification:
This SHA-256 hash can be used to verify file integrity. Any modification
to the file will result in a different hash value.

═══════════════════════════════════════════════════════════════
SECTION 3: TECHNICAL ANALYSIS DETAILS
═══════════════════════════════════════════════════════════════

Detection Methodology:
- Face Detection: MTCNN (Multi-task Cascaded Convolutional Networks)
- Classification Model: MobileNetV2 with transfer learning
- Analysis Type: Frame-by-frame feature extraction and pattern recognition
- Technology Stack: TensorFlow, Python-based AI models

Technical Process:
1. Video frame extraction and preprocessing
2. Face detection using MTCNN architecture
3. Feature extraction from detected facial regions
4. Pattern analysis for manipulation indicators
5. Confidence scoring based on detected artifacts

Model Information:
- Model Architecture: MobileNetV2 (lightweight, efficient)
- Training: Transfer learning on deepfake detection datasets
- Analysis Scope: Facial manipulation detection, temporal consistency

═══════════════════════════════════════════════════════════════
SECTION 4: RECOMMENDED RESPONSE ACTIONS
═══════════════════════════════════════════════════════════════

${result === "FAKE"
        ? `Based on the detection result, the following actions are recommended:

1. IMMEDIATE ACTIONS:
   - Do not share, forward, or distribute this content
   - Preserve the original file without modification
   - Document the source and distribution channels
   - Capture supporting evidence (screenshots, metadata)

2. EVIDENCE PRESERVATION:
   - Maintain file integrity (do not edit or compress)
   - Store in secure, write-protected location
   - Document chain of custody
   - Preserve all related communications

3. LEGAL REPORTING:
   - Report to appropriate law enforcement authorities
   - File reports with relevant cybercrime portals
   - Consult with legal counsel if necessary
   - Consider jurisdiction-specific legal requirements

4. PLATFORM REPORTING:
   - Report to platforms where content appears
   - Follow platform-specific reporting procedures
   - Document all report submissions

5. RISK ASSESSMENT:
   - Evaluate potential impact and harm
   - Assess distribution scope
   - Consider affected parties
   - Implement appropriate mitigation measures`
        : result === "REAL"
          ? `Based on the analysis, this video appears authentic. However, consider the following:

1. VERIFICATION:
   - Verify the source and context of the content
   - Confirm authenticity through independent channels if concerns persist
   - Assess whether content aligns with known information

2. RISK ASSESSMENT:
   - Evaluate if content has concerning implications even if authentic
   - Consider context and potential misuse
   - Review Risk Assessment section if needed

3. DOCUMENTATION:
   - Maintain records of analysis for future reference
   - Document source verification process`
          : `Given the inconclusive result, the following actions are recommended:

1. EXPERT ANALYSIS:
   - Seek professional forensic video analysis
   - Consult with digital forensics experts
   - Consider multiple detection methods

2. EVIDENCE PRESERVATION:
   - Preserve original file and metadata
   - Document all available context
   - Maintain chain of custody

3. RISK-BASED RESPONSE:
   - Conduct risk assessment based on content implications
   - Take appropriate action based on potential impact
   - Consult with legal or security professionals if needed`}

═══════════════════════════════════════════════════════════════
SECTION 5: LIMITATIONS AND DISCLAIMERS
═══════════════════════════════════════════════════════════════

IMPORTANT DISCLAIMERS:

1. PROBABILISTIC NATURE:
   This report reflects AI-based analysis results, which are probabilistic
   in nature. The confidence score indicates likelihood, not absolute certainty.

2. TECHNICAL LIMITATIONS:
   - Detection accuracy depends on video quality, resolution, and compression
   - Advanced or novel deepfake techniques may evade detection
   - Results may vary based on video characteristics
   - False positives and false negatives are possible

3. LEGAL CONSIDERATIONS:
   - This report is for informational and guidance purposes
   - Results should not be treated as definitive legal proof
   - Consult with qualified legal professionals for legal matters
   - Independent expert verification may be required for legal proceedings

4. CONTINUOUS EVOLUTION:
   Deepfake technology and detection methods are continuously evolving.
   This analysis represents the state of technology at the time of analysis.

5. HUMAN OVERSIGHT:
   This analysis was performed using Industry 5.0 compliant AI systems
   emphasizing human-centric design, transparency, and ethical AI practices.
   Human judgment and expert analysis should complement automated detection.

═══════════════════════════════════════════════════════════════
SECTION 6: PLATFORM AND COMPLIANCE INFORMATION
═══════════════════════════════════════════════════════════════

Platform: Deepfake Detection & Response Platform
Technology: MobileNetV2, MTCNN, TensorFlow
Compliance Framework: Industry 5.0 Standards
Design Principles: Human-centric, Transparent, Ethical AI

Privacy and Data Handling:
- Videos are processed in memory only
- No permanent storage of video content
- No third-party data sharing
- Analysis results provided transparently

Industry Standards:
- Follows Industry 5.0 principles for human-AI collaboration
- Emphasizes transparency, ethics, and responsible AI use
- Designed for trustworthiness and accountability

═══════════════════════════════════════════════════════════════
END OF REPORT
═══════════════════════════════════════════════════════════════

Report Generated By: Deepfake Detection & Response Platform
For questions or additional analysis, consult with qualified experts.

This report may be used for legal, organizational, or investigative purposes
but should be supplemented with expert analysis for critical decisions.
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
      "Evidence report downloaded successfully. This report can be used for legal or organizational purposes.",
    );
  };

  return (
    <div className="evidence-report">
      <h3 className="evidence-report-title">Professional Evidence Documentation</h3>
      <p className="report-description">
        Generate a comprehensive, professionally formatted evidence report suitable for
        legal proceedings, organizational documentation, or investigative purposes.
        The report follows standardized documentation practices.
      </p>

      <div className="report-preview">
        <h4 className="report-preview-title">Report Contents:</h4>
        <ul className="report-contents">
          <li><strong>Report Metadata:</strong> Generation date, version, report type</li>
          <li><strong>Analysis Summary:</strong> Detection result, confidence level, interpretation</li>
          <li><strong>File Information:</strong> Complete file details and SHA-256 cryptographic hash</li>
          <li><strong>Technical Analysis:</strong> Detailed methodology, model information, process description</li>
          <li><strong>Response Actions:</strong> Comprehensive recommended actions based on results</li>
          <li><strong>Legal Disclaimers:</strong> Limitations, probabilistic nature, legal considerations</li>
          <li><strong>Platform Information:</strong> Technology stack, compliance, privacy practices</li>
        </ul>
      </div>

      <div className="report-usage">
        <h4>Intended Use Cases:</h4>
        <ul>
          <li>Legal documentation and evidence preservation</li>
          <li>Organizational incident reporting and documentation</li>
          <li>Law enforcement and cybercrime reporting</li>
          <li>Internal audit and compliance documentation</li>
          <li>Expert consultation and forensic analysis support</li>
        </ul>
      </div>

      <button className="generate-report-btn" onClick={generateReport}>
        Download Professional Evidence Report
      </button>

      <div className="report-info">
        <p className="report-info-text">
          <strong>Report Format:</strong> Plain text (.txt) format for maximum compatibility
          and legal admissibility. The report includes all necessary information for professional
          use while maintaining clear structure and comprehensive documentation.
        </p>
        <p className="report-info-note">
          <strong>Note:</strong> This report is generated by an AI-based system and should be
          used as supporting documentation. For legal proceedings, supplement with expert
          analysis and maintain proper chain of custody for all evidence.
        </p>
      </div>
    </div>
  );
};

export default EvidenceReport;
