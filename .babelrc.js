module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-private-methods', { 'loose': true }]
  ]
}
