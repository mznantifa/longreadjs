const express    = require('express'),
      morgan     = require('morgan'),
      bodyParser = require('body-parser'),
      path       = require('path'),
      app        = express()

const config     = require('./app/config/app.config.json'),
      site       = require('./app/config/site.config.json')

app.set('views', path.join(__dirname, 'app', 'templates', site.template))
app.set('view engine', 'pug')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/assets', express.static(path.join(__dirname, 'app/assets')))

require('./app/routes')(app, site)

app.listen(config.port, () => console.log(`[longreadjs] Running on port ${config.port}`))