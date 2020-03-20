const fs           = require('fs'),
      path         = require('path'),
      articleModel = require('../models/article.model')

module.exports.index = (req, res, site) => {
    var articles = articleModel.list()
    console.log(articles)
    res.render('index', {site: site, articles: articles})
}

module.exports.show = (req, res, site) => {
    var article = articleModel.find(req.params.id)
    if(article) {
        res.render('article', {article: article, site: site, Render: require('../render')})
    } else {
        res.status(404).render('notfound', {attempted_id: req.params.id, site: site})
    }
}