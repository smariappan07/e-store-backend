var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, dbse ) => {
  if (err) throw err;
  var dbObject = dbse.db("eStore");
  dbObject.collection("brands").find({}).toArray( (err, result) => {
    if (err) throw err;
    console.log(result);
    dbse.close();
  });
});