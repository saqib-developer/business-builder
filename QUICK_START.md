# 🚀 Quick Start Guide - Business Builder

## For Team Members

Welcome to the Business Builder project! This guide will help you get up and running quickly.

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- A code editor (**VS Code** recommended)

---

## 🏃 Getting Started in 5 Minutes

### 1. Clone the Repository
```bash
git clone https://github.com/saqib-developer/business-builder.git
cd business-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Firebase (Ask Team Lead for credentials)

Create a file named `.env.local` in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

> **Note**: Muhammad Talha (Team Lead) has the Firebase credentials

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to: [http://localhost:3000](http://localhost:3000)

---

## 📂 Important Files & Folders

### **Pages** (in `app/` directory)
- `page.tsx` - Landing page
- `about/page.tsx` - About Us page
- `onboarding/page.tsx` - Onboarding wizard
- `dashboard/page.tsx` - User dashboard
- `(auth)/sign-in/page.tsx` - Sign in page
- `(auth)/sign-up/page.tsx` - Sign up page

### **Components** (in `components/` directory)
- `onboarding/` - All 5 onboarding step components
- `layout/Header.tsx` - Navigation header
- `layout/Footer.tsx` - Site footer

### **State Management** (in `lib/context/`)
- `AuthContext.tsx` - User authentication
- `BrandContext.tsx` - Business settings & onboarding data

### **Types** (in `lib/types/`)
- `onboarding.ts` - Onboarding interfaces
- `user.ts` - User interfaces
- `template.ts` - Template interfaces

---

## 🎨 Design System

### **Colors**
- **Primary Blue**: `#2563EB` (blue-600)
- **Dark Blue**: `#1E40AF` (blue-800)
- **Yellow Accent**: `#FBBF24` (yellow-400)
- **Success Green**: `#10B981` (green-500)

### **Fonts**
- **Headings**: Geist Sans Bold
- **Body**: Geist Sans Regular

### **Common Classes**
```jsx
// Gradient button
className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl"

// Card
className="bg-white rounded-xl p-6 shadow-md border border-gray-200"

// Badge
className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold"
```

---

## 🔧 Common Development Tasks

### **Add a New Component**
1. Create file in `components/` folder
2. Use TypeScript and "use client" if needed
3. Import in the page where you need it

Example:
```tsx
"use client";

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### **Add a New Page**
1. Create folder in `app/` directory
2. Add `page.tsx` inside that folder

Example:
```
app/
  my-new-page/
    page.tsx
```

### **Update Types**
Edit the appropriate file in `lib/types/`:
```typescript
// lib/types/onboarding.ts
export interface MyNewType {
  id: string;
  name: string;
}
```

---

## 🧪 Testing Your Changes

### **Check for Errors**
```bash
npm run lint
```

### **Build for Production**
```bash
npm run build
```

### **Test Different Users**
1. Sign up with different emails
2. Complete onboarding
3. Check dashboard
4. Sign out and sign back in

---

## 🚨 Common Issues & Solutions

### **Issue: Port 3000 already in use**
```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### **Issue: Firebase errors**
- Check if `.env.local` file exists
- Verify all Firebase credentials are correct
- Ask team lead for latest credentials

### **Issue: npm install fails**
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Testing on Mobile

### **Using Your Phone**
1. Find your computer's local IP address
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. On your phone, navigate to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

3. Make sure phone and computer are on same WiFi

---

## 🎯 Feature Checklist

When implementing a new feature, make sure to:

- [ ] Create TypeScript interfaces
- [ ] Add "use client" if using React hooks
- [ ] Make it responsive (mobile-first)
- [ ] Add error handling
- [ ] Test on multiple browsers
- [ ] Check for TypeScript errors
- [ ] Test the user flow
- [ ] Add appropriate comments

---

## 📞 Team Contacts

**Questions? Reach out to:**

- **Muhammad Talha** (Team Lead) - For overall architecture, Firebase setup
- **Muhammad Noman** (UI/UX) - For design decisions, layout questions
- **Ehtisham Akram** (Frontend) - For component implementation
- **Jafar Hussain** (BA/Tester) - For testing, user flows

---

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Check for errors
npm run lint

# Build for production
npm run build

# Run production build locally
npm start

# Clear all data (node_modules, cache)
rm -rf node_modules package-lock.json .next
npm install
```

---

## 🎓 Learning Resources

### **Next.js**
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Tutorial](https://nextjs.org/learn)

### **TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### **Tailwind CSS**
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### **Firebase**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)

---

## 🎉 You're Ready!

Now you can:
1. ✅ Run the project locally
2. ✅ Make changes to pages and components
3. ✅ Test your work
4. ✅ Commit and push to GitHub

Happy coding! 🚀

---

**Questions?** Create an issue on GitHub or message the team on WhatsApp!

*Built with ❤️ by the Business Builder Team*
