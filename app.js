// サーバー起動
const express = require('express')
const fs = require('fs')
const https = require('https')
const app = express()

const options = {
  pfx: fs.readFileSync('./private/server.pfx'),
  passphrase: 'k1gea25a'
}

https.createServer(options, app).listen(443)

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'realkure.sqlite3'
  },
  useNullAsDefault: true
})

var Bookshelf = require('bookshelf')(knex)

var StoreList = Bookshelf.Model.extend({
  tableName: 'store_list'
})

app.get('/api/restaurant', (req, res) => {
  new StoreList().where('gnere', '=', '食事').fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

app.get('/api/cafe', (req, res) => {
  new StoreList().where('gnere', '=', 'カフェ').fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

app.get('/api/tavern', (req, res) => {
  new StoreList().where('gnere', '=', '居酒屋').fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

// 静的ファイルを自動的に返すようルーティングする
app.use('/public', express.static('./public'))
app.use('/camera', express.static('./public'))
app.use('/', express.static('./public'))

