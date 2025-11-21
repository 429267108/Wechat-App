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

## 📦 Deployment

To deploy to production:

1.  **Deploy the Web App**:
    Run `npm run build` and host the `dist` folder on a secure server (HTTPS), e.g., Vercel, Netlify.

2.  **Update the Wrapper**:
    Open `miniprogram/pages/index/index.js` and update the `url` variable to your production URL:
    ```javascript
    url: 'https://your-whimsy-list-app.vercel.app'
    ```
    *Note: In production, you must add this domain to your WeChat Admin Console whitelist.*

3.  **Upload Mini Program**:
    In WeChat DevTools, click **Upload** to submit the Mini Program shell.

## 🛠 Project Structure

*   `src/`: **The React Web App** (UI, Logic, AI).
*   `miniprogram/`: **The Native Wrapper**. Contains the `app.json` and `web-view` bridge required by WeChat.
*   `project.config.json`: Tells WeChat DevTools to use `miniprogram/` as the root.