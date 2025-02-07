// webpack.config.js
const path = require('path');

module.exports = {
  // other configurations
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // This makes '@' point to your 'src' folder
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Extensions to resolve
  },
};
