const Dotenv = require('dotenv-webpack');

module.exports = {
  // ... other config options
  node: {
    crypto: true
  },
  plugins: [
    new Dotenv()
  ]
};