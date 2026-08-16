const NextSteps = ({ result }) => {
  const getFakeSteps = () => (
    <div className="next-steps-content">
      <div className="steps-intro">
        <p className="steps-intro-text">
          The analysis indicates this video contains synthetic or manipulated content.
          Follow these standardized response procedures to mitigate risk and preserve evidence.
        </p>
      </div>
      <ol className="step-list">
        <li className="step-item step-item-critical">
          <div className="step-header">
            <span className="step-number">1</span>
            <strong className="step-title">Immediate Action: Do Not Share</strong>
          </div>
          <p className="step-description">
            Do not forward, share, or distribute this content. Sharing deepfakes contributes
            to misinformation spread and may have legal implications. Isolate the content
            immediately.
          </p>
        </li>
        <li className="step-item">
          <div className="step-header">
            <span className="step-number">2</span>
            <strong className="step-title">Preserve Original Evidence</strong>
          </div>
          <p className="step-description">
            Save the original video file without any modifications, edits, or compression.
            Maintain file metadata (EXIF data, timestamps, source information). Store in a
            secure location with write-protection enabled. Document the file path and
            preservation method.
          </p>
        </li>
        <li className="step-item">
          <div className="step-header">
            <span className="step-number">3</span>
            <strong className="step-title">Document Source and Context</strong>
          </div>
          <p className="step-description">
            Record where and when you received this video, the sender's identity (if known),
            distribution channels, and any associated communications. Capture URLs, message
            timestamps, and platform information. Create a timeline of events.
          </p>
        </li>
        <li className="step-item">
          <div className="step-header">
            <span className="step-number">4</span>
            <strong className="step-title">Capture Supporting Evidence</strong>
          </div>
          <p className="step-description">
            Take high-resolution screenshots of suspicious frames, artifacts, or anomalies.
            Document any visible manipulation indicators. If applicable, capture metadata
            from the original file. Save all evidence with timestamps.
          </p>
        </li>
        <li className="step-item">
          <div className="step-header">
            <span className="step-number">5</span>
            <strong className="step-title">Verify with Subject (If Applicable)</strong>
          </div>
          <p className="step-description">
            If the video depicts someone you know, contact them through a verified channel
            to confirm authenticity. Use secure communication methods. Do not share the video
            during verification. Document their response.
          </p>
        </li>
        <li className="step-item">
          <div className="step-header">
            <span className="step-number">6</span>
            <strong className="step-title">Report to Authorities</strong>
          </div>
          <p className="step-description">
            File appropriate reports with law enforcement and cybercrime authorities based on
            your jurisdiction. Use the Legal Guidance section for jurisdiction-specific
            reporting procedures. Provide all documented evidence.
          </p>
        </li>
        <li className="step-item">
          <div className="step-header">
            <span className="step-number">7</span>
            <strong className="step-title">Generate Evidence Report</strong>
          </div>
          <p className="step-description">
            Download the professional evidence report from the Evidence Report section. This
            document includes detection results, file hashes, timestamps, and technical
            analysis details suitable for legal or organizational use.
          </p>
        </li>
      </ol>
      <div className="steps-note">
        <strong>Important:</strong> Do not delete or modify the original file. Maintain a
        chain of custody for all evidence. Consult legal counsel if this content may be
        used in legal proceedings.
      </div>
    </div>
  );

  const getRealSteps = () => (
    <div className="authentic-notice">
      <div className="notice-icon">✓</div>
      <div className="notice-content">
        <h3>Analysis Indicates Authentic Content</h3>
        <p>
          The AI analysis suggests this video is authentic and not manipulated. However,
          automated detection systems are not infallible. Consider the following:
        </p>
        <ul className="authentic-considerations">
          <li>Verify the source and context of the content</li>
          <li>Assess whether the content aligns with known information about the subject</li>
          <li>If concerns persist, seek expert forensic analysis</li>
          <li>Review the Risk Assessment section if the content has concerning implications</li>
        </ul>
        <p className="authentic-note">
          <strong>Note:</strong> Even authentic content can be misused or taken out of context.
          Exercise judgment and consider the broader circumstances.
        </p>
      </div>
    </div>
  );

  const getUnsureSteps = () => (
    <div className="inconclusive-notice">
      <div className="notice-icon">⚠</div>
      <div className="notice-content">
        <h3>Analysis Inconclusive</h3>
        <p>
          The system could not confidently determine the authenticity of this video. This
          may occur due to:
        </p>
        <ul className="inconclusive-reasons">
          <li>Poor video quality or resolution</li>
          <li>Lack of clear, detectable faces</li>
          <li>Heavy compression or encoding artifacts</li>
          <li>Technical limitations of automated detection</li>
          <li>Novel deepfake techniques not yet detectable</li>
        </ul>
        <div className="inconclusive-recommendations">
          <h4>Recommended Actions:</h4>
          <ul>
            <li>If this content is of concern, seek expert forensic analysis</li>
            <li>Document the source and context thoroughly</li>
            <li>Preserve the original file as evidence</li>
            <li>Consider the Risk Assessment section to evaluate potential impact</li>
            <li>Consult with legal or security professionals if necessary</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="next-steps">
      <h3 className="next-steps-title">Recommended Response Protocol</h3>
      {result === "FAKE" && getFakeSteps()}
      {result === "REAL" && getRealSteps()}
      {result !== "FAKE" && result !== "REAL" && getUnsureSteps()}
    </div>
  );
};

export default NextSteps;
