const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const dbPath = path.resolve(__dirname, '../models/db.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

module.exports = db;
