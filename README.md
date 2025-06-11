# 🚀 Demo ERP - Enterprise Resource Planning System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A comprehensive, modern Enterprise Resource Planning (ERP) system demo built with Next.js 15, TypeScript, and Tailwind CSS. This frontend-only demo showcases a complete ERP solution with realistic data and full functionality without requiring a backend database.

## 🌟 Live Demo

🔗 **[View Live Demo](https://your-username.github.io/demo-erp)** *(Update this link after deployment)*

## ✨ Features

This comprehensive ERP demo includes all major business modules:

### 🏢 Core Modules
- **Company Management** - Business overview, settings, and configuration
- **Human Resources** - Employee management, tracking, and HR operations
- **Inventory Management** - Stock tracking, product management, and warehouse operations
- **Sales & Finance** - Revenue tracking, financial reporting, and transaction management
- **Project Management** - Task tracking, team collaboration, and project oversight
- **Analytics Dashboard** - Real-time insights, KPIs, and business intelligence

### 🎯 Key Features
- **Multi-role Authentication** - Admin, Manager, and Employee access levels
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes for better user experience
- **Real-time Charts** - Interactive data visualization with Recharts
- **Export Functionality** - Export data to PDF and Excel formats
- **Modern UI/UX** - Clean, intuitive interface built with Radix UI components

## 🎯 Demo Credentials

Use these credentials to explore different user roles and permissions:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@demo.com` | `demo123` | Full system access |
| **Manager** | `manager@demo.com` | `demo123` | Department management |
| **Employee** | `employee@demo.com` | `demo123` | Limited access |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/demo-erp.git
   cd demo-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

1. **Build the application**
   ```bash
   npm run build
   npm start
   ```

### GitHub Pages Deployment

1. **Build for static export**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to GitHub Pages**
   - Enable GitHub Pages in repository settings
   - Choose "Deploy from a branch" and select `gh-pages`
   - Or use the included GitHub Actions workflow

## 📁 Project Structure

```
demo-erp/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Login/Landing page
│   ├── dashboard/         # Main dashboard pages
│   ├── analytics/         # Analytics and reporting
│   ├── finance/           # Financial management
│   ├── hr/                # Human resources
│   ├── inventory/         # Inventory management
│   ├── projects/          # Project management
│   ├── sales/             # Sales management
│   ├── settings/          # System settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── dashboard/        # Dashboard-specific components
│   ├── analytics/        # Analytics components
│   ├── finance/          # Finance components
│   ├── hr/               # HR components
│   ├── inventory/        # Inventory components
│   ├── projects/         # Project components
│   ├── sales/            # Sales components
│   └── theme-provider.tsx # Theme management
├── contexts/              # React contexts
│   ├── demo-context.tsx  # Demo data management
│   └── notification-context.tsx # Notifications
├── data/                  # Mock/Demo data
│   └── demo-data.json    # All placeholder data
├── lib/                   # Utility functions
│   ├── utils.ts          # Helper functions
│   └── export-utils.ts   # Export functionality
├── types/                 # TypeScript type definitions
│   └── forms.ts          # Form types
└── public/               # Static assets
```

## 🎨 Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with latest features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **shadcn/ui** - Beautiful, reusable components
- **Lucide React** - Beautiful & consistent icons
- **next-themes** - Dark/light mode support

### Data & Charts
- **Recharts** - Composable charting library
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 📊 Demo Data

The demo includes comprehensive, realistic placeholder data:

### 🏢 Company Information
- **TechCorp Solutions** - A modern technology company
- Complete business profile with contact information
- Department structure and organizational hierarchy

### 👥 Human Resources
- **5 Sample Employees** across different departments
- Employee profiles with roles, departments, and contact info
- Salary information and employment history

### 🛒 Customer Management
- **5 Business Customers** with detailed profiles
- Purchase history and transaction records
- Customer relationship tracking

### 📦 Inventory System
- **5 Product Categories** with comprehensive stock data
- Real-time inventory levels and product information
- Supplier details and pricing information

### 💰 Financial Records
- **Sales Transactions** with detailed revenue data
- Income and expense tracking
- Financial reporting and analytics

### 📋 Project Management
- **4 Projects** in various stages (ongoing and completed)
- Task assignments and team collaboration
- Project timelines and milestone tracking

## 🌐 Deployment Options

### 🚀 GitHub Pages (Recommended for Demo)
- ✅ Free hosting
- ✅ Automatic static export
- ✅ No server required
- ✅ Perfect for demonstrations
- ✅ Easy setup with GitHub Actions

### ⚡ Vercel (Recommended for Production)
- ✅ One-click deployment
- ✅ Automatic builds from Git
- ✅ Custom domains
- ✅ Edge functions support
- ✅ Built-in analytics

### 🌊 Netlify
- ✅ Drag-and-drop deployment
- ✅ Form handling
- ✅ Split testing
- ✅ Custom domains

### 🏠 Self-hosted
- ✅ Full control over infrastructure
- ✅ Custom server configurations
- ✅ Build static files and serve with any web server

## 🔧 Configuration

### Environment Variables

For different deployment environments, you can configure:

```bash
# For GitHub Pages deployment
GITHUB_PAGES=true
BASE_PATH=/demo-erp  # Your repository name

# For custom domain
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# For development
NODE_ENV=development
```

### Customization Options

#### 🎨 Branding & Theming
1. **Company Information**: Edit `data/demo-data.json` to update company details
2. **Color Scheme**: Modify CSS variables in `app/globals.css`
3. **Logo & Assets**: Replace files in the `public/` directory
4. **Theme Configuration**: Update `tailwind.config.ts` for custom styling

#### 📊 Data Customization
1. **Demo Data**: Modify `data/demo-data.json` with your own sample data
2. **User Roles**: Update authentication logic in demo context
3. **Modules**: Enable/disable specific ERP modules as needed

#### 🔧 Feature Extensions
1. **New Modules**: Add new ERP modules by creating pages and components
2. **Additional Charts**: Extend analytics with more chart types
3. **Export Options**: Add new export formats (CSV, XML, etc.)
4. **Integrations**: Add mock API integrations for demonstrations

## 🎯 Use Cases

### 💼 Business Applications
- **Sales Demonstrations** - Showcase ERP capabilities to potential clients
- **Client Presentations** - Demonstrate features in business meetings
- **Proof of Concept** - Validate ERP concepts before full development
- **Vendor Evaluation** - Compare ERP solutions and features

### 🎓 Educational & Training
- **User Training** - Onboard new users with realistic, safe data
- **Educational Demos** - Teach ERP concepts in academic settings
- **Skill Development** - Practice with ERP systems without real data risks
- **Certification Training** - Provide hands-on experience for certifications

### 👨‍💻 Development & Portfolio
- **Portfolio Showcase** - Demonstrate full-stack development skills
- **UI/UX Testing** - Test interface changes without backend dependencies
- **Frontend Development** - Develop and test UI components independently
- **Code Examples** - Provide reference implementation for ERP systems

## 🔒 Security & Limitations

### ⚠️ Important Security Notes
- **Demo Only**: This is a frontend-only demonstration with no real authentication
- **No Data Persistence**: All data is stored in JSON files and browser localStorage
- **Not Production Ready**: Do not use with real business or sensitive data
- **No Backend**: No server-side validation or security measures

### 🚫 Limitations
- **Static Data**: All data is predefined and doesn't persist between sessions
- **No Real Authentication**: Login is simulated for demonstration purposes
- **No Database**: No real data storage or retrieval capabilities
- **Limited Functionality**: Some features are simulated for demo purposes

## 🤝 Contributing

We welcome contributions to improve this ERP demo! Here's how you can help:

### 🚀 Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/demo-erp.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### 💻 Development Process
1. **Make your changes** following the existing code style
2. **Test thoroughly** to ensure everything works
3. **Update documentation** if needed
4. **Commit your changes** with clear, descriptive messages
   ```bash
   git commit -m "Add: new analytics dashboard feature"
   ```
5. **Push to your fork** and submit a pull request

### 🎯 Contribution Ideas
- 🐛 **Bug Fixes** - Report and fix any issues you find
- ✨ **New Features** - Add new ERP modules or functionality
- 🎨 **UI Improvements** - Enhance the user interface and experience
- 📚 **Documentation** - Improve README, add code comments
- 🧪 **Testing** - Add unit tests and integration tests
- 🌐 **Internationalization** - Add support for multiple languages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📋 License Summary
- ✅ **Commercial Use** - Use in commercial projects
- ✅ **Modification** - Modify and adapt the code
- ✅ **Distribution** - Distribute copies of the software
- ✅ **Private Use** - Use for private projects
- ❗ **Liability** - No warranty or liability provided
- ❗ **Attribution** - Include original license and copyright

## 🆘 Support & Help

### 📞 Getting Help
- 🐛 **Bug Reports**: [Open an issue](https://github.com/your-username/demo-erp/issues) with detailed information
- 💡 **Feature Requests**: [Create a feature request](https://github.com/your-username/demo-erp/issues) with your ideas
- ❓ **Questions**: Check existing issues or start a new discussion
- 📧 **Contact**: Reach out to the development team for urgent matters

### 📚 Resources
- 📖 **Documentation**: Comprehensive guides in the `/docs` folder
- 🎥 **Video Tutorials**: Coming soon - video walkthroughs
- 💬 **Community**: Join our discussions and share your experience
- 🔗 **Related Projects**: Check out other ERP and business management tools

## 🌟 Acknowledgments

### 🙏 Special Thanks
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible, unstyled UI primitives
- **shadcn/ui** - For beautiful, reusable components
- **Recharts** - For powerful charting capabilities

### 🎨 Design Inspiration
- Modern ERP systems and business dashboards
- Material Design and Apple Human Interface Guidelines
- Open source design systems and component libraries

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/demo-erp?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/demo-erp?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/demo-erp)
![GitHub license](https://img.shields.io/github/license/your-username/demo-erp)

**⭐ If you find this project helpful, please consider giving it a star on GitHub! ⭐**

---

**📝 Note**: This is a demonstration version with placeholder data designed for showcasing ERP system capabilities. For production use, integrate with a proper backend database and implement real authentication and security measures.
