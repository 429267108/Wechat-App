# WhimsyLists - WeChat Mini Program (Hybrid)

A collaborative list-making app with a Sanrio x Ghibli aesthetic.

## 🚀 Setup & Run Locally

1.  **Install Dependencies**:
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
    *   **Important**: In the DevTools toolbar, go to **Details (详情) > Local Settings (本地设置)** and check **"Does not verify valid domain names, web-view (domains), TLS versions and HTTPS certificates"**.
    *   The simulator should now show your React app running inside the shell.

## ❓ Troubleshooting

### Blank White Screen?
*   **Check Server**: Is `npm run dev` running in your terminal?
*   **Check Settings**: Did you enable "Does not verify valid domain names..." in Local Settings?
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

3.  **Upload Mini Program**:
    In WeChat DevTools, click **Upload** to submit the Mini Program shell.

## 🛠 Project Structure

*   `src/`: **The React Web App** (UI, Logic, AI).
*   `miniprogram/`: **The Native Wrapper**. Contains the `app.json` and `web-view` bridge required by WeChat.
*   `project.config.json`: Tells WeChat DevTools to use `miniprogram/` as the root.