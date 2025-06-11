# Contributing to Demo ERP

Thank you for your interest in contributing to Demo ERP! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/demo-erp.git
   cd demo-erp
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🎯 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide browser and OS information
- Include screenshots if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide mockups or examples if possible

### Code Contributions

#### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

#### 2. Make Changes
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

#### 3. Test Your Changes
```bash
npm run lint        # Check code style
npm run type-check  # Check TypeScript types
npm run build       # Test build process
```

#### 4. Commit Changes
```bash
git add .
git commit -m "Add: descriptive commit message"
```

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code refactoring
- `test:` for adding tests

#### 5. Push and Create PR
```bash
git push origin your-branch-name
```
Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Follow naming conventions (PascalCase for components)
- Keep components small and focused

### Styling
- Use Tailwind CSS classes
- Follow responsive design principles
- Maintain consistent spacing and colors

### File Organization
- Group related files in folders
- Use descriptive file names
- Keep imports organized

## 🧪 Testing

Currently, the project focuses on manual testing. Future contributions for automated testing are welcome:

- Unit tests for utility functions
- Component testing with React Testing Library
- E2E tests with Playwright or Cypress

## 📚 Documentation

When contributing:
- Update README.md if needed
- Add JSDoc comments for functions
- Update type definitions
- Include examples in documentation

## 🎨 Design Guidelines

- Follow modern UI/UX principles
- Maintain consistency with existing design
- Ensure accessibility (WCAG guidelines)
- Test on different screen sizes

## 🔍 Review Process

1. **Automated Checks**: All PRs run automated linting and type checking
2. **Manual Review**: Maintainers review code quality and functionality
3. **Testing**: Changes are tested in different environments
4. **Approval**: PRs need approval before merging

## 📞 Getting Help

- **Questions**: Open a GitHub discussion
- **Issues**: Use the issue tracker
- **Chat**: Join our community discussions

## 🏆 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Invited to join the maintainers team (for significant contributions)

Thank you for contributing to Demo ERP! 🎉
