module.exports = {
  chainWebpack: (config) => {
    // Add project name as alias
    config.resolve.alias.set('hpccloud-client', __dirname);
  },
  devServer: {
    proxy: 'http://localhost:8888',
  },
};
