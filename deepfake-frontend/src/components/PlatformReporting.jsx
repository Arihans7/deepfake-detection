import { useState } from "react";

const PlatformReporting = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const platforms = [
    { id: "whatsapp", name: "WhatsApp", icon: "💬" },
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "facebook", name: "Facebook", icon: "👥" },
    { id: "youtube", name: "YouTube", icon: "📺" },
    { id: "linkedin", name: "LinkedIn", icon: "💼" },
    { id: "twitter", name: "Twitter/X", icon: "🐦" },
  ];

  const platformGuides = {
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

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId);
  };

  return (
    <div className="platform-reporting">
      <h3 className="platform-reporting-title">Platform-Specific Reporting Procedures</h3>
      <p className="platform-description">
        Each platform has specific procedures for reporting manipulated media. Select a platform
        below to view step-by-step reporting instructions. These procedures are based on current
        platform policies and may be updated by the platforms.
      </p>

      <div className="platform-buttons">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            className={`platform-btn ${selectedPlatform === platform.id ? "active" : ""}`}
            onClick={() => handlePlatformSelect(platform.id)}
          >
            <span className="platform-icon">{platform.icon}</span>
            <span className="platform-name">{platform.name}</span>
          </button>
        ))}
      </div>

      {selectedPlatform && platformGuides[selectedPlatform] && (
        <div className="platform-guide">
          <h4 className="platform-guide-title">{platformGuides[selectedPlatform].title}</h4>
          <div className="guide-intro">
            <p>Follow these steps to report manipulated media on this platform:</p>
          </div>
          <ol className="guide-steps">
            {platformGuides[selectedPlatform].steps.map((step, index) => (
              <li key={index} className="guide-step">
                <span className="guide-step-number">{index + 1}</span>
                <span className="guide-step-text">{step}</span>
              </li>
            ))}
          </ol>
          <div className="guide-important">
            <h5>Important Notes:</h5>
            <ul>
              <li>Platform policies and reporting procedures may change without notice</li>
              <li>Always verify current procedures in the platform's official Help Center</li>
              <li>Keep records of your report submission (screenshot confirmation, reference numbers)</li>
              <li>Follow up if the content is not removed within the platform's stated timeframe</li>
              <li>Consider reporting to multiple platforms if content appears on several</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformReporting;
