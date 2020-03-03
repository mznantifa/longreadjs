const fs   = require('fs'),
      path = require('path')

module.exports = (article_id, section, config) => {
    var content_path = path.join(__dirname, '../site/articles', article_id, 'content.txt')
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

// Retrieve file from cache if not modified, or send to be converted
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

// Convert file from simple XML to styleable HTML
const convertFile = (content_path) => {
    try {
        raw_content = fs.readFileSync(content_path, "utf-8")

        // Convert pages and add them to page index
        pages = []
        raw_content = raw_content.replace(/\=\=\= (.*)([\s\S]*?)\=\=\=/g, (matched, p1, p2, index, original) => {
            page_san = p1.replace(/[\s+]/gi, '-').toLowerCase()
            pages.push(page_san)
            return '<div class="page-section" id="'+page_san+' title="'+p1+'">'+p2+'</div>'
        })

        // Convert text sections
        raw_content = raw_content.replace(/\@\@([\s\S]*?)\@\@/g, '<div class="text-slide">$1</div>')

        // Convert paragraphs
        raw_content = raw_content.replace(/^(\s*)-(.*)$/gm, '<p>$2</p>')

        // Convert headers
        raw_content = raw_content.replace(/^(\s*)\#(.*)$/gm, '<div class="big-header-slide"><h1>$2</h1></div>')
        
        // Prepend page-selection menu to output
        raw_content = '<div class="menu-slide">'+pages+'</div>' + raw_content

        return raw_content
    } catch(err) {
        return '<p><i>The content for this article could not be found or an error occurred.</i></p><p style="color:#aaaaaa"><i>If you are the systems administrator, please check the system logs for more information.<br>'+err+'</i></p>'
    }
}

// Get 'last updated' attribute from file metadata
const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path)
    return stats.mtime
}