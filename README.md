# Deepfake Detection & Response Platform

An Industry 5.0 compliant, human-centric AI platform for detecting deepfakes and providing comprehensive post-detection guidance, legal support, and response protocols.

## 🌟 Features

### Core Detection

- **AI-Powered Analysis**: Uses MobileNetV2 and MTCNN for accurate deepfake detection
- **Real-time Processing**: Analyzes videos and provides instant results
- **Confidence Scoring**: Shows detection confidence levels
- **Multiple Format Support**: MP4, AVI, MOV (up to 100MB)

### Post-Detection Guidance

- **What to Do Next**: Step-by-step guidance based on detection results
- **Risk Assessment**: Interactive questionnaire to evaluate threat level
- **Evidence Preservation**: Professional PDF report generation
- **Platform-Specific Reporting**: Detailed instructions for WhatsApp, Instagram, Facebook, YouTube, LinkedIn, Twitter/X

### Legal & Compliance

- **Jurisdiction-Based Guidance**: Customized legal reporting for India, US, UK, EU, Australia
- **Official Reporting Channels**: Direct links to cybercrime portals
- **Evidence Requirements**: Clear documentation of what authorities need
- **Legal Disclaimers**: Transparent AI limitations and proper usage guidance

### Organization Mode

- **Internal Response Checklist**: 8-point enterprise incident response protocol
- **Stakeholder Notification**: IT Security, Legal, PR, Compliance teams
- **Crisis Management**: Public clarification and security protocol updates
- **Enterprise-Grade UI**: Professional interface for organizational use

### Awareness & Education

- **Deepfake Education**: What they are, how they work, common misuse cases
- **Privacy Protection**: Best practices for preventing deepfake creation
- **Ethical AI Principles**: Industry 5.0 compliance and human-centric design
- **What NOT to Do**: Clear guidance on avoiding harmful actions

## 🚀 Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Extract Faces from Training Videos

```bash
python model/extract_faces.py
```

### 3. Train the Model

```bash
python model/train.py
```

### 4. Run the Platform

```bash
python app.py
```

The platform will start on http://localhost:5000

## 📋 Usage

### Individual Mode

1. Upload a video file (drag & drop or click)
2. Click "Analyze Video"
3. Review detection results and confidence score
4. Complete risk assessment questionnaire
5. Follow step-by-step guidance
6. Report to appropriate authorities
7. Download evidence report if needed

### Organization Mode

1. Click "Switch to Organization Mode" in navigation
2. Follow individual mode steps 1-3
3. Use internal response checklist
4. Notify relevant teams (IT, Legal, PR)
5. Document incident timeline
6. Generate evidence report for compliance

## 🏭 Industry 5.0 Compliance

This platform adheres to Industry 5.0 principles:

- **Human-Centric**: Designed to support human decision-making
- **Trustworthy**: Transparent about AI limitations
- **Ethical**: Clear guidelines on responsible use
- **Secure**: No permanent storage of uploaded videos

## 📊 Detection Model

- **Architecture**: MobileNetV2 (transfer learning)
- **Face Detection**: MTCNN
- **Training Accuracy**: ~99.4% on validation set
- **Framework**: TensorFlow/Keras

## 🔒 Privacy & Security

- Videos processed in memory and deleted immediately
- No data shared with third parties
- File hashes generated for evidence integrity
- All processing happens locally

## ⚠️ Disclaimer

This platform is for educational and protective purposes only. AI-based deepfake detection is not 100% accurate. Results should be used as guidance, not definitive proof.

---

**Powered by MobileNetV2 & MTCNN | Industry 5.0 Compliant Platform**
