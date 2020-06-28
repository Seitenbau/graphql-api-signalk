require('fs')
  .readdirSync(__dirname + '/')
  .forEach(function(file) {
    if (file.match(/.+\.js$/g) !== null && file !== 'index.js' && file !== 'database.js') {
      const name = file.replace('.js', '')
      exports[name] = require('./' + file)
    }
  })
