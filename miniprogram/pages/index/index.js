Page({
  data: {
    // -------------------------------------------------------------------------
    // DEPLOYMENT CONFIGURATION
    // -------------------------------------------------------------------------
    
    // STEP 1: For Local Development (npm run dev)
    // Keep this uncommented while developing on your computer.
    url: 'http://localhost:5173'

    // STEP 2: For Production Deployment
    // 1. Comment out the localhost line above.
    // 2. Uncomment the line below and replace with your actual HTTPS URL.
    // url: 'https://your-deployed-website.com'
    
    // -------------------------------------------------------------------------
  },
  onLoad: function (options) {
    console.log('WebView loading:', this.data.url);
  },
  onMessage: function(e) {
    // Capture messages sent from the web app (if any)
    console.log('Message from Webview:', e.detail);
  },
  onShareAppMessage(options) {
    // Enable sharing the page to friends
    return {
      title: 'WhimsyLists',
      path: '/pages/index/index'
    }
  }
})