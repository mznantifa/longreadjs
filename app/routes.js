module.exports = (app, site) => {
    app.get('*', (req, res) => renderSimple('index', res, site))
}

renderSimple = (template, res, site) => res.render(template, { site: site })
renderStory  = (storyid, res, site) => {
    res.sendStatus(404)
}