# Deploy to GitHub Pages

## Step-by-Step Guide

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right corner
3. Select **"New repository"**
4. Name your repository: `salah-times-app`
5. Make it **Public** (required for free GitHub Pages)
6. Click **"Create repository"**

### 2. Upload Your Files

**Option A: Using Git (Recommended)**

```bash
# Navigate to your project folder
cd salah-site

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"

# Set the main branch
git branch -M main

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/salah-times-app.git

# Push to GitHub
git push -u origin main
```

**Option B: Using GitHub Web Interface**

1. Go to your new repository on GitHub
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop all your project files:
   - `index.html`
   - `script.js`
   - `manifest.json`
   - `pwabuilder-sw.js`
   - `README.md`
4. Click **"Commit changes"**

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab (top navigation)
3. Scroll down to **"Pages"** section (left sidebar)
4. Under **"Source"**, select **"Deploy from a branch"**
5. Under **"Branch"**, select **"main"** and **"/(root)"**
6. Click **"Save"**

### 4. Wait for Deployment

- GitHub will build and deploy your site
- This usually takes 1-2 minutes
- You'll see a green checkmark when it's ready

### 5. Access Your Live Site

Your app will be available at:
```
https://YOUR_USERNAME.github.io/salah-times-app/
```

## Custom Domain (Optional)

1. Go to your repository **Settings** → **Pages**
2. Under **"Custom domain"**, enter your domain
3. Click **"Save"**
4. Add a `CNAME` file to your repository with your domain:
   ```
   yourdomain.com
   ```
5. Configure your domain's DNS to point to `YOUR_USERNAME.github.io`

## Troubleshooting

### Site not showing up?
- Check if GitHub Pages is enabled in repository settings
- Wait 5-10 minutes for initial deployment
- Check the **Actions** tab for deployment status

### Files not updating?
- Make sure you've pushed changes to the main branch
- Clear your browser cache
- Wait a few minutes for GitHub to rebuild

### 404 errors?
- Ensure `index.html` is in the root directory
- Check file names and paths are correct
- Make sure repository is public

## Next Steps

Once deployed, you can:
- Share your live URL with others
- Add a custom domain
- Set up automatic deployments
- Monitor site analytics in GitHub Pages settings
