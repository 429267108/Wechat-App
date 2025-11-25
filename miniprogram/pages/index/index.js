Page({
  data: {
    // =========================================================================
    // 🚀 CONFIGURATION
    // =========================================================================
    
    // 💻 FOR COMPUTER SIMULATOR:
    // Keep as 'http://localhost:5173'
    // IMPORTANT: In DevTools > Details > Local Settings, CHECK "Does not verify valid domain names"
    
    // 📱 FOR REAL PHONE PREVIEW:
    // 1. Find your computer's Local IP (e.g., 192.168.1.5)
    // 2. Your phone and computer MUST be on the same WiFi.
    // 3. Change the URL below:
    // url: 'http://192.168.1.5:5173'
    
    url: 'http://localhost:5173'

    // ☁️ FOR PRODUCTION DEPLOYMENT:
    // url: 'https://your-app-name.vercel.app'
    
    // =========================================================================
  },
  onLoad: function (options) {
    console.log('WebView loading:', this.data.url);
  },
  onMessage: function(e) {
    console.log('Message from Webview:', e.detail);
  },
  onShareAppMessage(options) {
    return {
      title: 'WhimsyLists',
      path: '/pages/index/index'
    }
  }
})