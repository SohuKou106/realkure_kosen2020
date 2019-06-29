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

// 静的ファイルを自動的に返すようルーティングする
app.use('/public', express.static('./public'))
app.use('/camera', express.static('./public'))
app.use('/', express.static('./public'))

