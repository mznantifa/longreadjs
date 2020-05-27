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
    var cache_path  = path.join(__dirname, '../site/articles', article_id, '.cache')
    var config_path = path.join(__dirname, '../site/articles', article_id, 'article.config.json')
    if(fs.existsSync(cache_path)) {
        cache_time = getFileUpdatedDate(cache_path)
        conte_time = getFileUpdatedDate(content_path)
        if(cache_time >= conte_time) {
            console.log('Loading article ' + article_id + ' from cache!')
            return fs.readFileSync(cache_path)
        }
    }
    console.log('Rendering article ' + article_id)
    return convertFile(cache_path, content_path)
}

// Convert file to styleable HTML and save it in cache
const convertFile = (cache_path, content_path) => {
    try {
        raw_content = fs.readFileSync(content_path, "utf-8")

        // Convert pages and add them to page index
        pages = []
        raw_content = raw_content.replace(/\=\=\= (.*)([\s\S]*?)\=\=\=/g, (matched, p1, p2, index, original) => {
            page_san = p1.replace(/^\[(.*)\](\s*)/, '').replace(/[\s+]/gi, '-').replace(/[^a-zA-Z0-9\-]/gi, '').toLowerCase()
            pages.push([p1, page_san])
            return '<div class="page-section" id="'+page_san+'" data-page-title="'+p1+'">'+p2+'</div>'
        })

        // Convert text sections
        raw_content = raw_content.replace(/\@\@([\s\S]*?)\@\@/g, '<div class="text-slide">$1</div>')

        // Convert multi-line paragraphs
        raw_content = raw_content.replace(/\-\-([\s\S]*?)\-\-/g, (matched, p1, index, original) => {
            return '<p>'+p1.replace(/^(.+?)$/gm, '$1<br>')+'</p>'
        })

        // Convert paragraphs
        raw_content = raw_content.replace(/^(\s*)-(.*)$/gm, '<p>$2</p>')

        // Convert quotes
        raw_content = raw_content.replace(/^(\s*)\@(.*)$/gm, '<p class="para-quote">$2</p>')

        // Convert headers
        raw_content = raw_content.replace(/^(\s*)\#\#(.*)$/gm, '<div class="small-header-slide"><h2>$2</h2></div>')
        raw_content = raw_content.replace(/^(\s*)\#(.*)$/gm, '<div class="big-header-slide"><h1>$2</h1></div>')
        
        // Convert links
        raw_content = raw_content.replace(/\[([^\]]+?)\|([^\]]+?)\]/gi, '<a href="$2" target="_blank">$1</a>')

        // Convert references
        raw_content = raw_content.replace(/\[([0-9]+)\]/g, '<span class="reference">[$1]</span>')

        // Convert formatting (bold, italic, etc)
        raw_content = raw_content.replace(/\[\*\*([^\]]+?)\*\*\]/g, '<strong>$1</strong>')
        raw_content = raw_content.replace(/\[\*([^\]]+?)\*\]/g, '<i>$1</i>')

        // Prepend page-selection menu to output
        menu_dom = '<div class="menu-slide"><ul class="menu-slide-menu">'
        pages.forEach(element => {
            page_link = element[0].replace(/^\[(.+)\]/i, '<span>$1</span>')
            menu_dom += '<li><a href="#'+element[1]+'">'+page_link+'</a></li>'
        })
        menu_dom += '</ul></div>'
        raw_content = menu_dom + '<div id="all-pages-container">' + raw_content + '</div>'

        let a = new Date()

        fs.writeFile(cache_path, raw_content, (err) => {
            if(err) {
                console.log('COULD NOT SAVE ARTICLE TO CACHE AT ' + cache_path)
            } else {
                console.log('SUCCESSFULLY SAVED ARTICLE TO CACHE AT ' + cache_path)
            }
        })
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