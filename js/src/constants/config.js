if (window.CONFIG) {
  module.exports = window.CONFIG
} else {
  throw new Error('window.config not exist')
}
