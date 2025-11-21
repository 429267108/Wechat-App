# WhimsyLists - WeChat Mini Program (H5)

A collaborative list-making app with a Sanrio x Ghibli aesthetic.

## 🚀 Setup & Run Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set Environment Variable**:
    Create a `.env` file in the root directory (or set it in your deployment platform) to enable AI suggestions:
    ```
    VITE_API_KEY=your_google_gemini_api_key
    ```
    *Note: If testing strictly locally without a build server, you may need to manually set `process.env.API_KEY = '...'` in the `index.html` script tag for quick testing, though this is not recommended for production.*

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📦 Build for WeChat Deployment

To deploy this as a WeChat Mini Program, we use the **Web-View** method, as this is a React Web App.

1.  **Build the Project**:
    ```bash
    npm run build
    ```
    This will generate a `dist` folder.

2.  **Host the App**:
    Upload the contents of the `dist` folder to a secure web server (must be **HTTPS**).
    *Examples: Vercel, Netlify, GitHub Pages, or your own server.*

3.  **WeChat Mini Program Setup**:
    *   Open **WeChat DevTools**.
    *   Create a new Mini Program project.
    *   In `app.json`, ensure you have permission to use web-views.
    *   In your main page (e.g., `pages/index/index.wxml`), add:
        ```xml
        <web-view src="https://your-deployed-url.com"></web-view>
        ```
    *   **Important**: Log in to the WeChat Official Accounts Platform (mp.weixin.qq.com), go to **Development > Development Settings > Business Domain**, and add your website's domain to the allowlist.

## 🛠 Project Structure

*   `src/` (Implied root): React source code.
*   `services/storageService.ts`: Handles data persistence (simulating a database using LocalStorage).
*   `services/geminiService.ts`: Google Gemini AI integration.
*   `project.config.json`: Configuration for WeChat DevTools recognition.
