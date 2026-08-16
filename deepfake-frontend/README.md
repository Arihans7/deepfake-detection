# Deepfake Detection Platform - Frontend

A modern, clean React frontend for the Deepfake Detection Platform built with Vite.

## 🎨 Design Features

### Typography & Visual Hierarchy

- **Single Font Family**: Inter (400, 500, 600, 700, 800 weights)
- **Consistent Scale**:
  - Hero title: 56px, weight 800
  - Section titles: 32px, weight 600
  - Feature titles: 20px, weight 600
  - Body text: 16-18px, weight 400
- **Clean Layout**: Generous spacing, minimal design, professional appearance

### Components Structure

- **Navigation**: Fixed header with smooth scroll navigation
- **Hero Section**: Full viewport height with animated Prism background
- **How It Works**: 4-step process explanation
- **Features**: 6 key platform capabilities
- **Trust Section**: Responsible AI messaging
- **Call to Action**: Clear conversion section
- **Footer**: Minimal, professional footer

### Background Animation

- **Prism Component**: WebGL-based 3D animated background using OGL library
- **Configurable**: Rotation animation, customizable colors and effects
- **Performance**: Optimized with proper cleanup and resize handling

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation & Development

```bash
# Navigate to frontend directory
cd deepfake-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server runs on `http://localhost:5173/`

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: 768px (tablet), 480px (mobile)
- **Adaptive layouts**: Grid systems collapse to single column on mobile
- **Typography scaling**: Font sizes reduce appropriately on smaller screens
- **Navigation**: Simplified mobile navigation

## 🎯 Design Principles Followed

- **Human-Centric**: Professional, trustworthy appearance suitable for AI/security product
- **Minimal & Clean**: No clutter, strong visual hierarchy using typography only
- **Consistent**: Unified spacing, alignment, and rhythm throughout
- **Accessible**: Proper contrast, readable fonts, semantic HTML structure
- **Performance**: Optimized animations, efficient component structure

## 🛠 Technology Stack

- **React 19.2.0**: Modern React with hooks
- **Vite 7.2.4**: Fast build tool and dev server
- **OGL 1.0.11**: WebGL library for 3D background animation
- **CSS3**: Custom CSS with modern features (Grid, Flexbox, CSS Variables)
- **Inter Font**: Professional typography via Google Fonts

## 📁 Project Structure

```
src/
├── components/
│   ├── Navigation.jsx      # Fixed header navigation
│   ├── Hero.jsx           # Hero section with Prism background
│   ├── HowItWorks.jsx     # 4-step process section
│   ├── Features.jsx       # Platform features grid
│   ├── Trust.jsx          # Responsible AI messaging
│   ├── CallToAction.jsx   # Conversion section
│   ├── Footer.jsx         # Site footer
│   ├── Prism.jsx          # WebGL animated background
│   └── Prism.css          # Prism component styles
├── App.jsx                # Main app component
├── App.css                # Main stylesheet
├── index.css              # Base styles
└── main.jsx               # App entry point
```

## 🎨 Color Palette

- **Primary Text**: #1a1a1a (near black)
- **Background**: #ffffff (white)
- **Secondary Background**: #fafafa (light gray)
- **Accent Background**: #f8f8f8 (lighter gray)
- **Button Primary**: #1a1a1a (dark)
- **Button Secondary**: Transparent with border

## ✨ Key Features Implemented

1. **Animated Hero Background**: WebGL-powered 3D prism animation
2. **Smooth Navigation**: Fixed header with smooth scroll to sections
3. **Responsive Grid Layouts**: Adaptive layouts for all screen sizes
4. **Professional Typography**: Consistent Inter font family usage
5. **Clean Component Architecture**: Reusable, maintainable React components
6. **Performance Optimized**: Efficient rendering and animation cleanup

---

**Built following Industry 5.0 principles: Human-centric, trustworthy, and professional design.**
