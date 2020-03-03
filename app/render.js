const fs   = require('fs'),
      path = require('path')

module.exports = (article_id, section, config) => {
    var content_path = path.join(__dirname, '../site/articles', article_id, 'content.xml')
    try {
        if(fs.existsSync(content_path)) {
            return cacheOrConvert(article_id, content_path)
        } else {
            throw new Error("No such file")
        }
    } catch(err) {
        return '<p><i>The content for this article could not be found or an error occurred.</i></p><p style="color:#aaaaaa"><i>If you are the systems administrator, please check the system logs for more information.</i></p>'
    }
}

const cacheOrConvert = (article_id, content_path) => {
    var cache_path = path.join(__dirname, '../site/articles', article_id, '.cache')
    try {
        if(fs.existsSync(cache_path)) {
            cache_time = getFileUpdatedDate(cache_path)
            conte_time = getFileUpdatedDate(content_path)
            if(cache_time >= conte_time) {
                return fs.readFileSync(cache_path)
            }
        }
    } finally {
        return convertFile(content_path)
    }
}

const convertFile = (content_path) => {
    try {
        return fs.readFileSync(content_path)
    } catch(err) {
        return '<p><i>The content for this article could not be found or an error occurred.</i></p><p style="color:#aaaaaa"><i>If you are the systems administrator, please check the system logs for more information.</i></p>'
    }
}

const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path)
    return stats.mtime
}