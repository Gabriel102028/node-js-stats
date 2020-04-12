// INDEX FROM API

const http = require('http')
const URL = require('url')
const fs = require('fs')
const data = require('./urls.json')
const path = require('path')


function writeFile(cb) {

    fs.writeFile(
        path.join(__dirname, 'urls.json'),
        JSON.stringify(data, null, 2),
        err => {
            if (err) throw err

            cb(JSON.stringify({ message: 'OK' }))
        }
    )
}


http.createServer((req, res) => {
    // res.end(JSON.stringify(data))
    const { name, url, del } = URL.parse(req.url, true).query

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    })

    // All resources
    if (!name || !url)
        return res.end(JSON.stringify(data))

    if (del) {
        data.urls = data.urls.filter(item => String(item.url) !== String(url))
        return writeFile((message) =>  res.end(message))
    }

    data.urls.push({ name, url})

    return writeFile((message) => res.end(message))


}).listen(3000, () => console.log('Api is running'))


/*
/?name=Google&url=http://google.com&del=1

/?name=Google&url=http://google.com.br&del=1
*/