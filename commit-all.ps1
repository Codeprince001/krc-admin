# Package Files
git add package.json; git commit -m "chore: update package.json dependencies"
git add package-lock.json; git commit -m "chore: update package-lock.json"

# Core App Files
git add app/layout.tsx; git commit -m "feat(app): update root layout"
git add app/globals.css; git commit -m "feat(app): update global styles"
git rm app/page.tsx; git commit -m "refactor(app): remove root page (using dashboard)"

# App Routes
git add "app/(auth)/"; git commit -m "feat(auth): add authentication routes"
git add "app/(dashboard)/"; git commit -m "feat(dashboard): add dashboard routes and pages"

# Components
git add components/; git commit -m "feat(components): add shared components"

# Libraries and Utilities
git add lib/; git commit -m "feat(lib): add utility libraries and helpers"
git add proxy.ts; git commit -m "feat(proxy): add API proxy configuration"
git add types/; git commit -m "feat(types): add TypeScript type definitions"

# Configuration
git add tailwind.config.ts; git commit -m "feat(config): add Tailwind CSS configuration"

# Documentation
git add README.md; git commit -m "docs: update README"
git add COMPLETE_GAMES_ADMIN_SYSTEM.md; git commit -m "docs: add games admin system guide"
git add DESIGN_SYSTEM_GUIDE.md; git commit -m "docs: add design system guide"
git add GAMES_ADMIN_COMPLETE_GUIDE.md; git commit -m "docs: add games admin complete guide"
git add GAMES_ADMIN_IMPLEMENTATION.md; git commit -m "docs: add games admin implementation"
git add STRUCTURE.md; git commit -m "docs: add project structure documentation"

