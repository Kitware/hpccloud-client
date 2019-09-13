module.exports = {
  chainWebpack: (config) => {
    // Add project name as alias
    config.resolve.alias.set('hpccloud-client', __dirname);
  },
  devServer: {
    proxy: {
      '/proxy': {
        target: 'ws://localhost:8888/',
        ws: true,
        changeOrigin: true,
        proxyTimeout: 100000,
      },
      '/api': {
        target: 'http://localhost:8888',
      },
    },
  },
};
