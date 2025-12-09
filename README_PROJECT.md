# 🚀 Business Builder

> **From Zero to Hero in Four Simple Steps**

A comprehensive web application that guides non-technical users through the entire process of establishing a digital business presence - from naming their business to launching their website.

## 📋 Project Overview

**Business Builder** is a Final Year Project (FYP) developed under the organization **Doxfen**. This platform democratizes entrepreneurship by providing an all-in-one solution that takes users from having a simple business idea to establishing a complete digital presence.

### 🎯 Mission

We believe everyone deserves the opportunity to bring their business dreams to life, regardless of their technical expertise. Business Builder removes the barriers and complexity, making the journey from idea to launch simple, exciting, and achievable.

## 👥 Team

**Project Supervisor:** Muhammad Saqib

**Development Team:**
- **Muhammad Talha** - Team Lead / Front-End Developer
- **Muhammad Noman** - UI/UX Designer
- **Ehtisham Akram** - Front-End Developer
- **Jafar Hussain** - Business Analyst / Tester

## ✨ Key Features

### 🎨 Design Philosophy

- **High Energy & Motivational**: Uplifting UI that matches the excitement of starting a business
- **Professional**: Clean, modern design using Royal Blues, Whites, and Grays
- **Mobile-First**: Responsive design that works beautifully on all devices
- **Guided Journey**: Motivational quotes and clear guidance at every step

### 🛤️ The Zero-to-Hero Journey

#### 1️⃣ **Idea** - Business Name
- Simple, intuitive business name input
- Built-in tips for choosing a great name
- Real-time validation

#### 2️⃣ **Identity** - Logo Creation
Three options available:
- **Upload Your Own**: Simple file upload for existing logos
- **AI Generation**: Free AI-powered logo creation (Coming Soon)
- **Custom Design**: Professional custom logo service (Work in Progress)

#### 3️⃣ **Social Presence** - Social Media Setup
- Guided setup for TikTok, Instagram, Facebook, and WhatsApp Business
- Visual tracking of completed platforms
- Smart validation with friendly skip confirmation
- External links to platform signup pages

#### 4️⃣ **Website** - Launch Your Online Presence
Three pathways:
- **Default Templates**: Choose from professionally designed templates
  - Modern Shop
  - Classic Store
  - Minimal Boutique
  - Bold Market
- **WordPress**: Premium WordPress websites (Paid Feature - Coming Soon)
- **Custom Code**: Fully custom development (Contact Us - Coming Soon)

### 📊 User Dashboard

Comprehensive overview featuring:
- Business setup progress (percentage complete)
- Status of all four key areas (Name, Logo, Social, Website)
- Quick access to edit and preview
- Next steps recommendations
- Phase 2 previews (Domain, Hosting, Products)
- Motivational quotes

### 🔐 Authentication

- Email/Password authentication via Firebase
- Google Sign-In integration
- Automatic routing:
  - New users → Onboarding Wizard
  - Returning users → Dashboard
- Persistent session management

### 🎯 Smart Onboarding

- 5-step guided wizard
- Progress tracking with visual indicators
- Auto-save functionality (localStorage)
- Resume from where you left off
- Step validation
- Motivational quotes between steps

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animations)

### Backend & Services
- **Firebase Authentication**
- **Firestore** (database)
- **Firebase Storage** (file uploads)

### Development Tools
- **ESLint** (code quality)
- **PostCSS** (CSS processing)
- **React Hot Toast** (notifications)
- **React Icons** (icon library)

## 📁 Project Structure

```
business-builder/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/          # Authentication pages
│   │   └── sign-up/
│   ├── dashboard/             # User dashboard
│   ├── onboarding/            # 5-step onboarding wizard
│   ├── templates/             # Template browsing & preview
│   ├── about/                 # About Us page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── layout/                # Header, Footer
│   ├── onboarding/            # Onboarding step components
│   └── templates/             # Template components
├── lib/
│   ├── context/
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── BrandContext.tsx   # Brand & onboarding state
│   ├── firebase/              # Firebase configuration
│   └── types/                 # TypeScript interfaces
├── hooks/
│   └── useAuthActions.ts      # Authentication hooks
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saqib-developer/business-builder.git
   cd business-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 User Flow

```
Landing Page → Sign Up → Onboarding Wizard → Dashboard
     ↓
   About Us

Onboarding Wizard Steps:
1. Introduction (Roadmap Overview)
2. Business Name Input
3. Logo Setup (Upload/AI/Custom)
4. Social Media (4 platforms)
5. Website Builder (Template/WordPress/Custom)
```

## 🎨 Design Features

### Color Palette

- **Primary**: Royal Blue (#2563EB)
- **Secondary**: Indigo (#6366F1)
- **Accent**: Yellow (#FBBF24)
- **Success**: Green (#10B981)
- **Neutrals**: Grays (50-900)

### Typography

- **Headings**: Geist Sans (Bold)
- **Body**: Geist Sans (Regular)
- **Code**: Geist Mono

## 🔄 State Management

### BrandContext
- Business name
- Logo information
- Primary/secondary colors
- Selected template ID
- Onboarding completion status

### AuthContext
- User authentication state
- User profile data
- Loading states
- Logout functionality

### localStorage
- Onboarding progress (per user)
- Brand settings
- Auto-save and resume capability

## 🎯 Phase 2 Features (Coming Soon)

- 🌐 **Domain & Hosting**: Register and connect custom domains
- 📦 **Product Management**: Add and manage products
- 🛒 **E-commerce Integration**: Full shopping cart and checkout
- 📊 **Analytics Dashboard**: Track visitors and sales
- 🎨 **Advanced Customization**: Deep template editing
- 💳 **Payment Processing**: Accept payments online
- 📧 **Email Marketing**: Built-in email campaigns
- 🤖 **AI Logo Generation**: Free AI-powered logo creation

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

This is a Final Year Project (FYP) for educational purposes.

## 🙏 Acknowledgments

- **Doxfen** - Project Organization
- **Muhammad Saqib** - Project Supervisor
- All team members for their dedication and hard work
- The open-source community for amazing tools and libraries

## 📞 Contact

For custom development, feature requests, or inquiries:
- Email: contact@businessbuilder.com
- Organization: Doxfen

---

**Built with ❤️ by the Business Builder Team**

*"The secret of getting ahead is getting started." - Mark Twain*
