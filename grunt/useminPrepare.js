module.exports = {
  html: 'app/index.html',
  options: {
    dest: 'dist',
    flow: {
      html: {
        steps: {
          js: ['concat'],
          css: ['cssmin']
        },
        post: {}
      }
    }
  }
};
