const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: process.env.NODE_ENV !== 'production', // Only lint in dev mode
  
  // Configure webpack for better compatibility
  configureWebpack: {
    resolve: {
      fallback: {
        "path": false,
        "os": false,
        "crypto": false,
        "process": require.resolve("process/browser")
      }
    }
  },

  // CSS configuration
  css: {
    loaderOptions: {
      sass: {
        // This is the new syntax for sass-loader v13+
        additionalData: `@import "~@/assets/saas/partials/_variables.scss";`
      }
    }
  },

  // DevServer configuration for modern Node.js
  devServer: {
    port: 8080,
    host: 'localhost',
    historyApiFallback: true,
    allowedHosts: 'all'
  },

  // Disable source maps in production for better performance
  productionSourceMap: false,

  // Modern bundle for better performance
  chainWebpack: config => {
    // Fix for PerfectScrollbar and process global usage
    config
      .plugin('provide')
      .use(require('webpack').ProvidePlugin, [{
        PerfectScrollbar: 'perfect-scrollbar',
        process: 'process/browser'
      }])
  }
})