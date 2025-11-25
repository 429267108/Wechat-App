# WhimsyLists - WeChat Mini Program (Hybrid)

A collaborative list-making app with a Sanrio x Ghibli aesthetic.

## 🚀 Setup & Run Locally

1.  **Install Dependencies**:
    **Crucial Step**: You must run this command to install Vite and React.
    ```bash
    npm install
    ```

2.  **Start the React App**:
    You must start the local server first so the Mini Program wrapper can load it.
    ```bash
    npm run dev
    ```
    *Runs on http://localhost:5173*

3.  **Open in WeChat DevTools**:
    *   Open WeChat DevTools.
    *   Import this project folder.
    *   **CRITICAL STEP (Fixing White Screen)**: 
        1.  In the DevTools Top Toolbar, click **"Details" (详情)** (usually on the top right).
        2.  Click the **"Local Settings" (本地设置)** tab.
        3.  Check the box: **"Does not verify valid domain names, web-view (domains), TLS versions and HTTPS certificates"** (不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书).
    *   The simulator should now show your React app running inside the shell.

## ❓ Troubleshooting

### "sh: vite: command not found"
This means you haven't installed the project dependencies yet.
*   Open your terminal in the project folder.
*   Run `npm install`.
*   Then try `npm run dev` again.

### Blank White Screen?
*   **Check Local Settings**: This is the #1 cause. Ensure you checked "Does not verify valid domain names..." (see step 3 above). The Mini Program blocks `localhost` connections otherwise.
*   **Check Server**: Is `npm run dev` running in your terminal?
*   **Check URL**: Ensure `miniprogram/pages/index/index.js` has the correct port (default is 5173).

### "Trace is not defined" or Render Layer Errors?
*   Ensure your `project.config.json` has `"libVersion": "3.2.5"` (or higher).
*   Ensure `miniprogram/pages/index/index.wxml` exists and contains the `<web-view>` tag.

### NPM Error in WeChat DevTools?
*   Ignore the "Build NPM" button in WeChat DevTools. 
*   This is a hybrid app; all dependencies are managed by Vite (`npm install` in terminal), not by WeChat.

## 📦 Deployment Guide

To deploy this app to real users, follow these 4 steps:

### 1. Build & Host the React App
The "brains" of your app (the React code) must be hosted on a secure web server.
1.  Run `npm run build`. This creates a `dist` folder.
2.  Upload the `dist` folder to a static hosting provider (e.g., Vercel, Netlify, or Tencent Cloud Static Hosting).
3.  **Result**: You get a URL like `https://my-app.com`.

### 2. Whitelist Domain in WeChat
1.  Log in to [WeChat Official Accounts Platform](https://mp.weixin.qq.com/).
2.  Go to **Development Management (开发管理)** > **Development Settings (开发设置)**.
3.  Find **Business Domain (业务域名)**.
4.  Add your website URL (e.g., `my-app.com`).
5.  *Note: You must download the verification file provided by WeChat and upload it to the root of your web server.*

### 3. Update Mini Program Code
1.  Open `miniprogram/pages/index/index.js`.
2.  Comment out the `localhost` line.
3.  Uncomment and set your production URL:
    ```javascript
    url: 'https://my-app.com'
    ```

### 4. Upload via DevTools
1.  In WeChat DevTools, click **Upload (上传)** in the top right.
2.  Enter version number and notes.
3.  Go to the WeChat Admin panel to submit the version for audit.

## 🛠 Project Structure

*   `src/`: **The React Web App** (UI, Logic, AI).
*   `miniprogram/`: **The Native Wrapper**. Contains the `app.json` and `web-view` bridge required by WeChat.
*   `project.config.json`: Tells WeChat DevTools to use `miniprogram/` as the root.