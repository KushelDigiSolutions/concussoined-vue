module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  env: {
    development: {
      // Fast refresh transformations for better dev experience
      plugins: []
    },
    production: {
      plugins: [
        // Add production-specific optimizations if needed
      ]
    }
  }
}
