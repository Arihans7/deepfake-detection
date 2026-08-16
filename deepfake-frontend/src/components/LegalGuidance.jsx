import { useState, useEffect } from "react";

const LegalGuidance = () => {
  const [selectedCountry, setSelectedCountry] = useState("IN");

  const legalGuidance = {
    IN: {
      title: "India - Legal Reporting Guidance",
      content: (
        <>
          <div className="legal-section">
            <h5>Official Reporting Channels</h5>
            <ul>
              <li><strong>National Cybercrime Reporting Portal:</strong> Report at cybercrime.gov.in (24/7 online reporting)</li>
              <li><strong>Cyber Crime Police Station:</strong> File FIR at your local cybercrime police station</li>
              <li><strong>State Cyber Cell:</strong> Contact your state's cybercrime investigation cell for specialized assistance</li>
              <li><strong>National Cyber Crime Helpline:</strong> 1930 (toll-free) for immediate assistance</li>
            </ul>
          </div>
          <div className="legal-section">
            <h5>Relevant Legal Provisions</h5>
            <ul>
              <li><strong>IT Act 2000, Section 66D:</strong> Punishment for cheating by personation using computer resource (up to 3 years imprisonment, fine)</li>
              <li><strong>IT Act 2000, Section 66E:</strong> Violation of privacy (up to 3 years, fine up to ₹2 lakh)</li>
              <li><strong>IPC Section 500:</strong> Defamation (simple imprisonment up to 2 years, fine, or both)</li>
              <li><strong>IPC Section 469:</strong> Forgery for purpose of harming reputation</li>
              <li><strong>IPC Section 509:</strong> Word, gesture, or act intended to insult modesty of a woman</li>
            </ul>
          </div>
          <div className="legal-section">
            <h5>Evidence Requirements</h5>
            <ul>
              <li>Original video file with complete metadata (EXIF data, timestamps)</li>
              <li>Screenshots of distribution channels, URLs, and platform information</li>
              <li>Documented timeline: when received, from whom, distribution history</li>
              <li>All related communications (messages, emails, social media interactions)</li>
              <li>File hash (SHA-256) for integrity verification</li>
              <li>Witness statements if applicable</li>
            </ul>
          </div>
          <div className="legal-section">
            <h5>Reporting Procedure</h5>
            <ol>
              <li>Gather all evidence and documentation</li>
              <li>Visit cybercrime.gov.in or call 1930</li>
              <li>File a complaint with complete details</li>
              <li>Obtain complaint reference number</li>
              <li>Follow up with local cybercrime police if required</li>
              <li>Maintain copies of all filed documents</li>
            </ol>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Visit National Cybercrime Reporting Portal →
          </a>
        </>
      ),
    },
    US: {
      title: "United States - Legal Reporting Guidance",
      content: (
        <>
          <div className="legal-section">
            <h5>Federal Reporting Channels</h5>
            <ul>
              <li><strong>FBI IC3:</strong> Internet Crime Complaint Center (ic3.gov) - primary federal reporting for cybercrime</li>
              <li><strong>FTC:</strong> Federal Trade Commission (reportfraud.ftc.gov) for fraud and identity theft cases</li>
              <li><strong>Local Law Enforcement:</strong> Contact your local police department or sheriff's office</li>
              <li><strong>Secret Service:</strong> For financial fraud or identity theft involving financial institutions</li>
            </ul>
          </div>
          <div className="legal-section">
            <h5>Relevant Legal Frameworks</h5>
            <ul>
              <li><strong>State Laws:</strong> Many states have specific deepfake legislation (check your state)</li>
              <li><strong>Computer Fraud and Abuse Act (CFAA):</strong> Federal law for unauthorized computer access</li>
              <li><strong>Identity Theft and Assumption Deterrence Act:</strong> For identity impersonation</li>
              <li><strong>State Defamation Laws:</strong> Vary by state, consult local attorney</li>
              <li><strong>Civil Remedies:</strong> Potential claims for defamation, false light, emotional distress</li>
            </ul>
          </div>
          <div className="legal-section">
            <h5>Evidence Requirements</h5>
            <ul>
              <li>Original video file with metadata</li>
              <li>Documentation of source and distribution</li>
              <li>Screenshots and URLs of where content appeared</li>
              <li>File hash for integrity verification</li>
              <li>Impact documentation (financial, reputational, etc.)</li>
            </ul>
          </div>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Visit FBI IC3 Portal →
          </a>
        </>
      ),
    },
    UK: {
      title: "United Kingdom - Legal Reporting Guidance",
      content: (
        <>
          <h4>Official Reporting Channels</h4>
          <ul>
            <li>Report to Action Fraud (UK's cybercrime reporting center)</li>
            <li>Contact local police for serious cases</li>
            <li>Report under Computer Misuse Act 1990</li>
            <li>Consider Malicious Communications Act 1988</li>
            <li>Seek legal advice for defamation claims</li>
          </ul>
          <a
            href="https://www.actionfraud.police.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Visit Action Fraud →
          </a>
        </>
      ),
    },
    EU: {
      title: "European Union - Legal Reporting Guidance",
      content: (
        <>
          <h4>Official Reporting Channels</h4>
          <ul>
            <li>Report to national cybercrime authorities</li>
            <li>Contact Europol for cross-border cases</li>
            <li>Invoke GDPR rights for personal data misuse</li>
            <li>Report to Digital Services Act authorities</li>
            <li>Seek legal counsel in your jurisdiction</li>
          </ul>
          <a
            href="https://www.europol.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Visit Europol →
          </a>
        </>
      ),
    },
    AU: {
      title: "Australia - Legal Reporting Guidance",
      content: (
        <>
          <h4>Official Reporting Channels</h4>
          <ul>
            <li>Report to Australian Cyber Security Centre (ACSC)</li>
            <li>Contact ReportCyber for cybercrime</li>
            <li>File complaint with eSafety Commissioner</li>
            <li>Contact local police for serious matters</li>
            <li>Consider Criminal Code Act provisions</li>
          </ul>
          <a
            href="https://www.cyber.gov.au"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            Visit ACSC →
          </a>
        </>
      ),
    },
    OTHER: {
      title: "General Legal Guidance",
      content: (
        <>
          <h4>Recommended Actions</h4>
          <ul>
            <li>Contact local law enforcement cybercrime division</li>
            <li>Consult with a legal professional in your jurisdiction</li>
            <li>Document all evidence thoroughly</li>
            <li>Report to relevant social media platforms</li>
            <li>Seek guidance from consumer protection agencies</li>
          </ul>
        </>
      ),
    },
  };

  // Auto-detect country based on timezone
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes("Kolkata") || timezone.includes("India")) {
      setSelectedCountry("IN");
    }
  }, []);

  const currentGuidance = legalGuidance[selectedCountry] || legalGuidance.OTHER;

  return (
    <div className="legal-guidance">
      <h3 className="legal-guidance-title">Legal Reporting & Jurisdictional Guidance</h3>
      <p className="legal-intro">
        Deepfake-related incidents may violate multiple laws depending on jurisdiction.
        Select your jurisdiction below for specific reporting procedures and legal frameworks.
      </p>

      <div className="country-selector">
        <label htmlFor="country-select">Select Your Jurisdiction:</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="country-select"
        >
          <option value="IN">India</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="EU">European Union</option>
          <option value="AU">Australia</option>
          <option value="OTHER">Other Jurisdiction</option>
        </select>
      </div>

      <div className="legal-content">
        <h4 className="legal-content-title">{currentGuidance.title}</h4>
        <div className="legal-content-body">{currentGuidance.content}</div>
      </div>
    </div>
  );
};

export default LegalGuidance;
