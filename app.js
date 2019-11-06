// サーバー起動
const express = require('express')
//const fs = require('fs')
//const https = require('https')
const app = express()

/*
const options = {
  key: fs.readFileSync('./private/real-kure.key'),
  cert: fs.readFileSync('./private/real-kure.crt')
}

https.createServer(options, app).listen(443)
*/

app.listen(3010, () => console.log('demo server open'))

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

var PlaceList = Bookshelf.Model.extend({
  tableName: 'place_list'
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

app.get('/api/hotel', (req, res) => {
  new PlaceList().where('gnere', '=', '宿泊').fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

app.get('/api/other', (req, res) => {
  new PlaceList().where('gnere', '=', 'その他').fetchAll()
  .then((collection) => {
    var collection_place = collection.toArray()
    new StoreList().where('gnere', '=', 'その他').fetchAll()
      .then((collection) => {
        var collection_store = collection.toArray()
        var collection_concat = collection_place.concat(collection_store)
        res.json({status: true, content: collection_concat})
      })
      .catch((err) => {
      })
  })
  .catch((err) => {
    res.json({status: false})
  })
})

// 静的ファイルを自動的に返すようルーティングする
app.use('/public', express.static('./public'))
app.use('/camera', express.static('./public'))
app.use('/', express.static('./public'))

