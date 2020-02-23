const fs   = require('fs'),
      path = require('path')

module.exports = (article_id, section, config) => {
    var content_path = path.join(__dirname, '../site/articles', article_id, 'content.xml')
    try {
        return fs.readFileSync(content_path)
    } catch(err) {
        return '<p><i>The content for this article could not be found or an error occurred.</i></p><p style="color:#aaaaaa"><i>If you are the systems administrator, please check the system logs for more information.</i></p>'
    }
}