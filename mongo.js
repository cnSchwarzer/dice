'use strict';

const { MongoClient } = require('mongodb');

// 获取数据库相关的静态数据
const config = require('./config');

let _db = null;

/**
 * 连接到数据库，并将连接保存到 _db 中
 * 
 * @returns {Promise<MongoClient>} 生成 mongoClient 的 promise
 */
let mongoConnect = async () => {
  try {
    let { url, databaseName } = config.mongo; 
    _db = (await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })).db(databaseName);

    // 绑定快捷路径
    exports.User = _db.collection('user');
    exports.Save = _db.collection('save');
    exports.WhiteList = _db.collection('whiteList');

    return _db;
  } catch (err) {
    /* istanbul ignore next */
    console.error(err);
    /* istanbul ignore next */
    process.exit(10);
  }
};
let connection = mongoConnect();

/**
 * 一个 Promise
 * 数据库连接完成后会被 resolve
 *
 * @returns {Promise<Null>} 无意义
 */
let prepare = async () => {
  /* istanbul ignore else */
  if (!_db) await connection;
};

exports = module.exports = {
  get client() {
    return _db;
  },

  prepare: prepare,
};
