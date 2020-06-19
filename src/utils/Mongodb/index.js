const { MongoClient } = require('mongodb')
// import Config from './Config'
const Config = require('./Config')

class MongoDb {

  static getInstance() {
    if (!MongoDb.instance) {
      MongoDb.instance = new MongoDb()
    }
    return MongoDb.instance
  }
  constructor() {
    this.dbClient = null
  }

  connect = (url, dbName) => {
    return new Promise((resolve, reject) => {
      if (!this.dbClient) {
        MongoClient.connect(url, (err, client) => {
          if (err) {
            reject(err)
          } else {
            this.dbClient = client.db(dbName)
            resolve(this.dbClient)
          }
        })
      } else {
        resolve(this.dbClient)
      }

    })

  }

  toArray = (data) => {
    return new Promise((resolve, reject) => {
      data.toArray((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  find = async (collectionName, json) => {
    const db = await this.connect(Config.url, Config.dbName)
    const collection = db.collection(collectionName)
    const data = collection.find(json)
    const res = await this.toArray(data)
    return res
  }

  promise = async (collection, type, json) => {
    return new Promise((resolve, reject) => {
      console.log(type)
      console.log({ ...json })
      collection[type]({ ...json }, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  insertOne = async (collectionName, json) => {
    const db = await this.connect(Config.url, Config.dbName)
    const collection = db.collection(collectionName)
    const res = await this.promise(collection, 'insertOne', json)
    console.log(res)
  }

  getCollection = async (collectionName) => {
    const db = await this.connect(Config.url, Config.dbName)
    const collection = db.collection(collectionName)
    return collection
  }
  update = async (collectionName, oldJson, newJson) => {
    const collection = this.getCollection(collectionName)
    console.log(collection)
    return new Promise((resolve, reject) => {
      collection.updateOne(oldJson, { $set: newJson }, (err, res) => {
        if (err) {
          reject(err)
        }
        console.log(res)
        resolve(res)
      })
    })
  }
  remove = async (collectionName, json) => {
    const collection = this.getCollection(collectionName)
    return new Promise((resolve, reject) => {
      collection.removeOne(json, (err, res) => {
        if (err) {
          reject(err)
        }
        console.log(res)
        resolve(res)
      })
    })
  }
}


module.exports = MongoDb.getInstance()