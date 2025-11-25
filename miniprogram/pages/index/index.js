Page({
  data: {
    // =========================================================================
    // 🚀 DEPLOYMENT CONFIGURATION
    // =========================================================================
    
    // OPTION 1: Local Development (npm run dev)
    // Use this when running on your computer.
    // Ensure "Does not verify valid domain names" is CHECKED in Local Settings.
    url: 'http://localhost:5173'

    // OPTION 2: Production (Deploy)
    // 1. Comment out the line above.
    // 2. Uncomment the line below.
    // 3. Replace with your actual HTTPS website URL.
    // url: 'https://YOUR-APP-URL.vercel.app'
    
    // =========================================================================
  },
  onLoad: function (options) {
    console.log('WebView loading:', this.data.url);
  },
  onMessage: function(e) {
    // Capture messages sent from the web app (if any)
    console.log('Message from Webview:', e.detail);
  },
  onShareAppMessage(options) {
    return {
      title: 'WhimsyLists',
      path: '/pages/index/index'
    }
  }
})