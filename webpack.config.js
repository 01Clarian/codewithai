const Dotenv = require('dotenv-webpack');
const { ProvidePlugin } = require('webpack');

module.exports = {
  // ... other config options
  resolve: {
    fallback: {
      stream: false,
      buffer: require.resolve('buffer/'),
    },
  },
  plugins: [
    new Dotenv(),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};