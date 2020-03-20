const fs                = require('fs'),
      path              = require('path'),
      articleController = require('./controllers/article.controller')

module.exports = (app, site) => {
    // Serve site-specific files
    app.get('/site/assets/:filename', (req, res) => {
        var filepath = path.join(__dirname, '../site/assets', req.params.filename)
        if(fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            res.status(404)
        }
    })
    
    // Serve article-specific files
    app.get('/:id/assets/:filename', (req, res) => {
        var filepath = path.join(__dirname, '../site/articles', req.params.id, 'assets', req.params.filename)
        if(fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            res.status(404)
        }
    })

    // Serve articles
    app.get('/:id', (req, res) => articleController.show(req, res, site))

    // root - go to article index
    app.get('/', (req, res) => articleController.index(req, res, site))
}