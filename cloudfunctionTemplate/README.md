# Cloud Function Template

This directory is defined in `project.config.json` as `cloudfunctionTemplateRoot`.
You can place cloud function templates here.

# WhimsyLists - WeChat Mini Program (Hybrid)

A collaborative list-making app with a Sanrio x Ghibli aesthetic.

## 🚀 Quick Start (Local Dev)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start React Server**:
    ```bash
    npm run dev
    ```

3.  **Open WeChat DevTools**:
    *   Import this folder.
    *   **Settings -> Local Settings**: Check "Does not verify valid domain names".
    *   The app should load `http://localhost:5173`.

---

## 🚢 How to Deploy (Production)

Since this is a Hybrid App (Web View), you **do not** use "Build NPM".

### Step 1: Deploy Web App
1.  Run `npm run build`.
2.  Upload the `dist/` folder to a secure host (Vercel, Netlify, etc.).
3.  **Result**: You get a URL like `https://myapp.com`.

### Step 2: Whitelist Domain
1.  Log in to [WeChat Admin](https://mp.weixin.qq.com/).
2.  Go to **Development Settings** > **Business Domain**.
3.  Add `myapp.com`.

### Step 3: Update Wrapper
1.  Open `miniprogram/pages/index/index.js`.
2.  Change `url` to your production URL:
    ```javascript
    url: 'https://myapp.com'
    ```

### Step 4: Upload
1.  In WeChat DevTools, click **Upload** (Top Right).
2.  Submit for audit in WeChat Admin.

---

## ❓ Troubleshooting

### "NPM packages not found"
*   **Ignore this.** Do not click "Build NPM". 
*   Your dependencies are managed by Vite (`npm install`), not WeChat.

### White Screen?
*   **Dev**: Check "Does not verify valid domain names" in Local Settings.
*   **Prod**: Ensure your domain is whitelisted in WeChat Admin.
