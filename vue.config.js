module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/DBL-Project/'
    : '/',
  devServer: {
    proxy: 'http://localhost:8080',
  }
}