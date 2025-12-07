# GitHub Pages Deployment Commands

## Quick Setup
```bash
# 1. Initialize and commit
git init
git add .
git commit -m "Deploy: Numérologie de Pythagore v1.8.0 with all latest features"

# 2. Add your GitHub repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 3. Push to GitHub
git push -u origin main
```

## Update Existing Repository
```bash
# Add changes
git add .
git commit -m "Update: Latest numerology calculations and UI improvements"
git push origin main
```

## Features Included in This Deployment
- ✅ 3-tab interface (Piliers, Cycles, Phase de réalisation)
- ✅ Cycle calculations with digit reduction
- ✅ 4 realization results with optimal spacing
- ✅ Professional PDF generation
- ✅ Responsive design
- ✅ French language interface
- ✅ Complete numerology calculations

## Live URL
After deployment, your site will be available at:
`https://YOUR_USERNAME.github.io/REPO_NAME/`

## Troubleshooting
- Ensure repository is public for free GitHub Pages
- Check that `index.html` is in the root directory
- Verify all CSS/JS files are properly linked
- GitHub Pages may take 5-10 minutes to update after push