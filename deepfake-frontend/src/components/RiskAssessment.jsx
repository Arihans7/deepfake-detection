import { useState, useEffect } from "react";

const RiskAssessment = () => {
  const [answers, setAnswers] = useState({
    q1: false, // impersonation
    q2: false, // financial fraud
    q3: false, // public distribution
    q4: false, // reputation damage
  });
  const [riskLevel, setRiskLevel] = useState(null);

  const questions = [
    {
      id: "q1",
      text: "Does this video impersonate you, a colleague, executive, or someone in your organization?",
      category: "Identity",
    },
    {
      id: "q2",
      text: "Is there potential for financial fraud, unauthorized transactions, or business email compromise?",
      category: "Financial",
    },
    {
      id: "q3",
      text: "Has this video been publicly shared, distributed on social media, or used in communications?",
      category: "Distribution",
    },
    {
      id: "q4",
      text: "Could this content damage reputation, cause professional harm, or impact business operations?",
      category: "Impact",
    },
    {
      id: "q5",
      text: "Does this involve sensitive information, trade secrets, or confidential data?",
      category: "Confidentiality",
    },
    {
      id: "q6",
      text: "Is there potential for legal liability, regulatory issues, or compliance violations?",
      category: "Legal",
    },
  ];

  const handleAnswerChange = (questionId, checked) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: checked,
    }));
  };

  useEffect(() => {
    const checkedCount = Object.values(answers).filter(Boolean).length;
    const criticalAnswers = answers.q1 || answers.q2 || answers.q5;

    if (checkedCount === 0) {
      setRiskLevel(null);
    } else if (checkedCount === 1 && !criticalAnswers) {
      setRiskLevel("low");
    } else if (checkedCount >= 2 && checkedCount <= 4) {
      setRiskLevel("medium");
    } else if (checkedCount >= 5 || criticalAnswers) {
      setRiskLevel("high");
    } else {
      setRiskLevel("medium");
    }
  }, [answers]);

  const getRiskDisplay = () => {
    switch (riskLevel) {
      case "low":
        return {
          icon: "🟢",
          title: "Low Risk Level",
          severity: "Low",
          description:
            "The identified risks are manageable with standard response procedures. Monitor the situation and maintain documentation.",
          immediateActions: [
            "Document the incident and preserve evidence",
            "Report to relevant platforms where content was shared",
            "Monitor for further distribution or escalation",
            "Review and update awareness protocols",
          ],
          followUp: "Continue monitoring. Escalate if the situation changes or new risks emerge.",
        };
      case "medium":
        return {
          icon: "🟡",
          title: "Medium Risk Level",
          severity: "Medium",
          description:
            "This incident requires prompt action and coordinated response. Multiple risk factors are present.",
          immediateActions: [
            "Preserve all evidence and maintain chain of custody",
            "Report to law enforcement cybercrime division",
            "Notify affected parties and stakeholders",
            "Report to all relevant platforms",
            "Consult with legal counsel",
            "Document incident timeline and impact assessment",
          ],
          followUp: "Implement response protocol. Consider engaging external experts if needed.",
        };
      case "high":
        return {
          icon: "🔴",
          title: "High Risk Level",
          severity: "High",
          description:
            "This is a high-severity incident requiring immediate, coordinated response. Critical risk factors are present.",
          immediateActions: [
            "Immediately contact law enforcement and cybercrime authorities",
            "Engage legal counsel and crisis management team",
            "Notify IT security and initiate incident response protocol",
            "Preserve all evidence with strict chain of custody",
            "Assess and mitigate potential operational or financial impact",
            "Consider public relations and communication strategy",
            "Document all actions and maintain detailed incident log",
          ],
          followUp: "This incident requires ongoing management. Engage specialized forensic and legal experts immediately.",
        };
      default:
        return null;
    }
  };

  const riskDisplay = getRiskDisplay();

  return (
    <div className="risk-assessment">
      <h3 className="risk-assessment-title">Risk & Impact Assessment Framework</h3>
      <p className="assessment-description">
        Evaluate the following risk factors to determine the appropriate response level.
        Select all applicable scenarios to generate a comprehensive risk assessment.
      </p>

      <div className="risk-questions">
        {questions.map((question) => (
          <label key={question.id} className="question-item">
            <input
              type="checkbox"
              checked={answers[question.id]}
              onChange={(e) =>
                handleAnswerChange(question.id, e.target.checked)
              }
            />
            <div className="question-content">
              <span className="question-category">{question.category}</span>
              <span className="question-text">{question.text}</span>
            </div>
          </label>
        ))}
      </div>

      {riskDisplay && (
        <div className={`risk-result ${riskLevel}`}>
          <div className="risk-header">
            <div className="risk-icon">{riskDisplay.icon}</div>
            <div className="risk-title-section">
              <h4 className="risk-title">{riskDisplay.title}</h4>
              <span className="risk-severity">Severity: {riskDisplay.severity}</span>
            </div>
          </div>
          <div className="risk-content">
            <p className="risk-description">{riskDisplay.description}</p>
            <div className="risk-actions-section">
              <h5 className="risk-actions-title">Immediate Actions Required:</h5>
              <ul className="risk-actions-list">
                {riskDisplay.immediateActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
            <div className="risk-followup">
              <strong>Follow-up:</strong> {riskDisplay.followUp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
