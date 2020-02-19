# longreadjs
This is a Node.js web-server that serves long-read articles according to a simple template.

**Please note that it is very early in development! A lot of features have not yet been implemented!**

## Setup
```
git clone https://github.com/mznantifa/longreadjs.git
cd longreadjs
```
Then make sure to edit all the right bits of configuration. You can use the sample config in the `app/config` folder, just make sure you remove the `.sample` part of their filename (thus `site.config.sample.json` should just become `site.config.json`).

Once you're ready to start the server, just use the following command.
```
node server
```

## Add an article to your site
Articles are contained within their own directory in the `site/articles` folder. Each article folder should contain the following:
* article.config.json
* content.xml

Optionally, you may also want an `assets` folder for any images you include, or for any custom stylesheets which can be included in your `article.config.json`

## Customise the style
You can change the overall style of longread articles by editing the Pug templates in the `templates` directory. It's recommended that you do not edit the default template as is, but rather copy it as a new template. Templates are simply directories within the `templates` directory, and you can change which template you are using via the `site.config.json`.