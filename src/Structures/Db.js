const { MongoClient, Collection } = require("mongodb"),
  config = require("../Structures/Config"),
  mongoClient = new MongoClient(config.db.url);

/**
 * @return {Promise}
 */
Collection.prototype.findOneOrNew = function (filter) {
  return this.findOne(filter).then((r) => r ?? filter);
};

/**
 * @return {Promise}
 */
Collection.prototype.findMany = function (filter = null) {
  return this.find(filter).toArray();
};

/**
 * @return {Promise}
 */
Collection.prototype.aggregateOne = async function (pipeline) {
  let cur = this.aggregate(pipeline);
  if (!(await cur.hasNext())) return null;
  return await cur.next();
};

/**
 * @return {Promise}
 */
Collection.prototype.save = function (object) {
  if (object._id) return this.updateOne({ _id: object._id }, { $set: object });
  return this.insertOne(object);
};

/**
 * @param {string} collection
 * @return {Promise<Collection>}
 */

module.exports = async function (collection) {
  return mongoClient.connect().then(() => mongoClient.db(config.db.name).collection(collection));
};
