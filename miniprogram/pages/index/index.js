Page({
  data: {
    // FOR DEVELOPMENT: Point to your local Vite server
    // Ensure you check "Does not verify valid domain names..." in DevTools settings
    url: 'http://localhost:5173' 
    
    // FOR PRODUCTION: Change this to your deployed URL (e.g. Vercel)
    // url: 'https://your-app.vercel.app'
  },
  onLoad: function (options) {
    console.log('WebView loading:', this.data.url);
  }
})