import { useState } from "react";

const OrganizationResponse = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const checklistItems = [
    {
      id: "preserve",
      text: "Preserve all evidence (original file, metadata, screenshots, communications)",
      priority: "Critical",
    },
    {
      id: "it-security",
      text: "Notify IT Security and Cybersecurity team immediately",
      priority: "Critical",
    },
    {
      id: "legal",
      text: "Inform Legal, Compliance, and Risk Management departments",
      priority: "High",
    },
    {
      id: "pr",
      text: "Alert PR/Communications team if content is public-facing or widely distributed",
      priority: "High",
    },
    {
      id: "access",
      text: "Assess and restrict sensitive system access if identity compromise is suspected",
      priority: "Critical",
    },
    {
      id: "document",
      text: "Document complete incident timeline, impact assessment, and response actions",
      priority: "High",
    },
    {
      id: "stakeholders",
      text: "Notify relevant stakeholders and affected parties (executives, board, partners)",
      priority: "Medium",
    },
    {
      id: "authorities",
      text: "Coordinate with law enforcement and cybercrime authorities as appropriate",
      priority: "High",
    },
    {
      id: "clarification",
      text: "Develop and execute public clarification strategy if content is widely circulated",
      priority: "Medium",
    },
    {
      id: "forensics",
      text: "Engage external forensic experts if detailed technical analysis is required",
      priority: "Medium",
    },
    {
      id: "protocols",
      text: "Review and update security protocols, training, and incident response procedures",
      priority: "Low",
    },
    {
      id: "post-incident",
      text: "Conduct post-incident review and implement lessons learned",
      priority: "Low",
    },
  ];

  const handleCheckChange = (itemId, checked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: checked,
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="organization-response">
      <h3 className="org-response-title">Enterprise Incident Response Protocol</h3>
      <p className="org-description">
        This standardized checklist follows industry best practices for responding to deepfake
        incidents in organizational contexts. Complete each item systematically to ensure
        comprehensive incident management.
      </p>

      <div className="progress-section">
        <div className="progress-header">
          <span>
            Progress: {completedCount}/{totalCount} completed
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="checklist">
        {checklistItems.map((item) => (
          <label key={item.id} className={`checklist-item checklist-item-${item.priority.toLowerCase()}`}>
            <input
              type="checkbox"
              checked={checkedItems[item.id] || false}
              onChange={(e) => handleCheckChange(item.id, e.target.checked)}
            />
            <span className="checkmark"></span>
            <div className="checklist-item-content">
              <span className="checklist-text">{item.text}</span>
              <span className="checklist-priority">{item.priority} Priority</span>
            </div>
          </label>
        ))}
      </div>

      <div className="org-notes">
        <h4>Additional Strategic Considerations</h4>
        <ul>
          <li>
            <strong>Crisis Communication:</strong> Establish a crisis communication plan if the
            incident becomes public or affects stakeholder trust
          </li>
          <li>
            <strong>Forensic Analysis:</strong> Consider engaging external cybersecurity and
            digital forensics experts for comprehensive technical analysis
          </li>
          <li>
            <strong>Training & Awareness:</strong> Review and enhance employee training programs
            on deepfake awareness, detection, and response procedures
          </li>
          <li>
            <strong>Process Improvement:</strong> Update incident response procedures, playbooks,
            and security protocols based on lessons learned from this incident
          </li>
          <li>
            <strong>Insurance & Legal:</strong> Review cyber insurance coverage and consult with
            legal counsel regarding potential liability and regulatory compliance
          </li>
          <li>
            <strong>Business Continuity:</strong> Assess impact on business operations and
            implement continuity measures if necessary
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationResponse;
