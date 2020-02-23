const fs = require('fs')

module.exports.list = () => {
    // read directories in ../../site/articles and try to return an array of Article objects for each
}

module.exports.find = (article_id) => {
    var article = {
        content: '',
        config: {},
        article_id: article_id
    }
    var valid_find = false

    fs.readFile('../../site/articles/' + this.article_id + '/article.config.json', (err, data) => {
        if(err) return false
        article.config = JSON.parse(data)
        fs.readFile('../../site/articles/' + this.article_id + '/content.xml', (err, data) => {
            if(err) return false
            article.content = data
            valid_find = true
        })
    })
    if(valid_find) return article
    return false
}
