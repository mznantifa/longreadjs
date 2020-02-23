const articleController = require('./controllers/article.controller')

module.exports = (app, site) => {
    app.get('/:id', (req, res) => articleController.show(req, res, site))
    app.get('/', (req, res) => articleController.index(req, res, site))
}