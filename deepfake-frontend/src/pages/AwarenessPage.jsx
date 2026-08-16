const AwarenessPage = () => {
  return (
    <div className="page-container awareness-page">
      <header className="aw-page-header">
        <div className="container">
          <h1 className="aw-page-header-title">Deepfake Awareness & Ethics</h1>
          <p className="aw-page-header-subtitle">
            Understanding synthetic media, its implications across Industry 5.0,
            and responsible AI practices. Learn how to protect yourself and your
            organization.
          </p>
        </div>
      </header>

      {/* 1. Understanding Deepfakes — full-screen */}
      <section className="aw-full-section" id="understanding">
        <div className="aw-full-inner container">
          <h2 className="aw-full-section-title">Understanding Deepfakes</h2>
          <div className="aw-full-body">
            <p>
              Deepfakes are synthetic media created using artificial intelligence
              to manipulate or generate visual and audio content. The term
              combines &ldquo;deep learning&rdquo; and &ldquo;fake,&rdquo; referring
              to AI-generated media that can convincingly depict individuals
              saying or doing things they never actually said or did.
            </p>
            <p>
              As deepfake technology becomes more accessible and sophisticated,
              the ability to create convincing synthetic media has significant
              implications for information integrity, personal security, and
              public trust. The proliferation of deepfakes poses challenges for
              individuals, organizations, and society at large, making reliable
              detection tools and broad awareness essential.
            </p>
            <p>
              This platform provides AI-based detection to help identify
              potentially manipulated content. Understanding how deepfakes work,
              where they are used, and how detection operates is critical for
              informed decisions about media authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Types and Applications — full-screen */}
      <section className="aw-full-section aw-full-alt">
        <div className="aw-full-inner container">
          <h2 className="aw-full-section-title">Types and Applications of Deepfakes</h2>
          <div className="aw-full-body">
            <h3>Common Types</h3>
            <ul>
              <li><strong>Face swapping:</strong> Replacing one person&apos;s face with another&apos;s in existing video while keeping expressions and movements.</li>
              <li><strong>Voice cloning:</strong> Synthesizing speech to mimic a person&apos;s voice, often combined with video for full impersonation.</li>
              <li><strong>Expression transfer:</strong> Altering facial expressions and movements to create new performances from existing footage.</li>
              <li><strong>Full synthesis:</strong> Generating entirely new video or audio of individuals using AI trained on their appearance or voice.</li>
            </ul>
            <h3>How They Are Created</h3>
            <p>
              Creation typically involves training deep neural networks (e.g. GANs
              or autoencoders) on large datasets of the target. Models learn to
              map facial features, expressions, and movements, then generate or
              alter content that appears authentic but is synthetic or heavily
              modified.
            </p>
            <h3>Areas of Concern</h3>
            <ul>
              <li><strong>Misinformation and disinformation:</strong> False content to sway opinion or spread lies.</li>
              <li><strong>Identity misuse:</strong> Impersonation for fraud, social engineering, or unauthorized access.</li>
              <li><strong>Reputation harm:</strong> Defamatory or compromising content to damage people or brands.</li>
              <li><strong>Financial fraud:</strong> Synthetic media to deceive individuals or organizations for gain.</li>
              <li><strong>Non-consensual content:</strong> Unauthorized synthetic media of individuals.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Deepfakes in Industry 5.0 — full-screen, highlight */}
      <section className="aw-full-section aw-full-highlight" id="industry5">
        <div className="aw-full-inner container">
          <h2 className="aw-full-section-title">Deepfakes and Industry 5.0</h2>
          <div className="aw-full-body">
            <p>
              <strong>Industry 5.0</strong> shifts focus from pure automation to
              human-centric, sustainable, and resilient systems. It combines
              human creativity and judgment with advanced AI, robotics, and
              IoT. In this context, trust in identity, communications, and
              media is foundational—and deepfakes directly undermine it.
            </p>
            <h3>Effects Across Sectors</h3>
            <div className="aw-full-grid">
              <div className="aw-full-card">
                <h4>Manufacturing &amp; Supply Chain</h4>
                <p>Fake video or voice of executives to authorize fraudulent orders, change suppliers, or reveal IP. Sabotage of training or safety content. Impersonation of auditors or partners in remote verification.</p>
              </div>
              <div className="aw-full-card">
                <h4>Healthcare</h4>
                <p>Impersonation in telemedicine and consent workflows. Manipulation of medical or training videos. Fraud targeting patients, insurers, or pharma. Erosion of trust in remote diagnostics and second opinions.</p>
              </div>
              <div className="aw-full-card">
                <h4>Finance &amp; Banking</h4>
                <p>CEO fraud and business email compromise via cloned video or voice. Bypass or social engineering around voice biometrics. Fake investor or board communications. Market manipulation using fabricated statements.</p>
              </div>
              <div className="aw-full-card">
                <h4>Media, Legal &amp; HR</h4>
                <p>Disinformation and eroded trust in news. Fabricated evidence or testimony. Recruitment and HR scams. Defamation and character attacks. Challenges for authentication of recordings in legal proceedings.</p>
              </div>
            </div>
            <h3>Workforce and Training</h3>
            <p>
              In Industry 5.0, remote work, hybrid teams, and digital training
              are standard. Deepfakes can corrupt training materials, impersonate
              instructors or leaders in town halls, and compromise identity in
              access and approval workflows. Building resilience requires
              verification habits, detection tools, and clear protocols.
            </p>
            <h3>Mitigation in an Industry 5.0 Framework</h3>
            <ul>
              <li><strong>Detection:</strong> Deploy AI-based and forensic tools as part of content and communication verification.</li>
              <li><strong>Verification protocols:</strong> Multi-factor and out-of-band checks for high-value or sensitive decisions.</li>
              <li><strong>Zero-trust and resilience:</strong> Assume media and identity can be faked; verify before trusting.</li>
              <li><strong>Awareness and training:</strong> Educate staff on deepfakes, phishing, and when to escalate.</li>
              <li><strong>Human-in-the-loop:</strong> Keep human oversight for critical judgments; use AI to assist, not replace.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. How Detection Works — full-screen */}
      <section className="aw-full-section">
        <div className="aw-full-inner container">
          <h2 className="aw-full-section-title">How Deepfake Detection Works</h2>
          <div className="aw-full-body">
            <p>
              This platform uses AI to look for patterns and artifacts that may
              indicate manipulation. Detection is probabilistic, not absolute.
            </p>
            <h3>Methodology</h3>
            <ul>
              <li><strong>Face detection:</strong> MTCNN to find and extract faces from frames.</li>
              <li><strong>Feature analysis:</strong> MobileNetV2 to examine textures and patterns suggestive of manipulation.</li>
              <li><strong>Frame sampling:</strong> Analysis across the video to check consistency and anomalies.</li>
              <li><strong>Pattern recognition:</strong> Artifacts such as odd blending, lighting, or temporal glitches.</li>
            </ul>
            <h3>Understanding Results</h3>
            <p>
              Results are likelihoods, not proof. Quality, resolution, compression,
              and the sophistication of the deepfake all affect reliability.
              Treat high-confidence flags as a reason to seek further verification—e.g.
              expert or forensic analysis—especially when stakes are high.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Responsible Use & Limitations — full-screen, highlight */}
      <section className="aw-full-section aw-full-highlight">
        <div className="aw-full-inner container">
          <h2 className="aw-full-section-title">Responsible Use and System Limitations</h2>
          <div className="aw-full-body">
            <h3>Limitations</h3>
            <ul>
              <li>Outputs are probability estimates, not absolute determinations.</li>
              <li>No system detects all manipulations with perfect accuracy; technology evolves.</li>
              <li>Results are not legal proof; independent verification may be required.</li>
              <li>False positives and false negatives are possible.</li>
            </ul>
            <h3>Ethical Use</h3>
            <ul>
              <li>Use detection as one input in a broader assessment, not the sole basis for serious decisions.</li>
              <li>Consider source and context when interpreting results.</li>
              <li>Seek expert or forensic verification for legal, regulatory, or high-stakes cases.</li>
              <li>Respect privacy; do not use tools to surveil without authorization.</li>
              <li>Handle and share content flagged as potentially manipulated with care.</li>
            </ul>
            <h3>Privacy and Data</h3>
            <p>
              Videos are processed in memory and not retained. Data is not shared
              with third parties or used beyond analysis. The system is designed
              in line with human-centric, transparent, and ethical AI principles
              consistent with Industry 5.0.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Practical Awareness & Verification — full-screen */}
      <section className="aw-full-section aw-full-alt">
        <div className="aw-full-inner container">
          <h2 className="aw-full-section-title">Practical Awareness and Verification</h2>
          <div className="aw-full-body">
            <h3>Evaluating Suspicious Content</h3>
            <ul>
              <li><strong>Source:</strong> Assess credibility and whether the content fits known facts.</li>
              <li><strong>Context:</strong> Consider timing, location, and circumstance.</li>
              <li><strong>Technical cues:</strong> Look for odd motion, sync issues, or visual inconsistencies.</li>
              <li><strong>Cross-reference:</strong> Check other verified sources and prior reporting.</li>
            </ul>
            <h3>When to Use Automated Detection</h3>
            <p>
              Use tools when screening before sharing or acting, for initial
              triage in a larger verification process, or when handling large
              volumes where manual review is not feasible.
            </p>
            <h3>When to Seek Extra Verification</h3>
            <p>
              Pursue expert or forensic review when results suggest manipulation
              and implications are significant, when content may be used in
              legal or official proceedings, when important decisions depend on
              authenticity, or when different tools give conflicting results.
            </p>
            <h3>Protective Practices</h3>
            <ul>
              <li>Limit public high-quality photos and videos that could train deepfake models.</li>
              <li>Use privacy settings and be cautious with biometric or voice data.</li>
              <li>Educate colleagues and contacts on deepfakes and verification.</li>
              <li>Report suspected deepfakes to platforms and, where appropriate, to authorities.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AwarenessPage;
