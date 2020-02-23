const fs   = require('fs'),
      path = require('path')

module.exports.list = () => {
    var articles = getDirectories(path.join(__dirname, '../../site/articles'))
    return articles.map(a => module.exports.find(a))
}

module.exports.find = article_id => {
    var article = {
        config: false,
        article_id: article_id
    }

    try {
        article.config = JSON.parse(
            fs.readFileSync(path.join(articlePathFromId(article_id), 'article.config.json'))
        )
    } catch(err) {
        return false
    }
    
    return article
}

const articlePathFromId = article_id => {
    return path.join(__dirname, '../../site/articles', article_id)
}

const getDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())