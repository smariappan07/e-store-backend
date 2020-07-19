const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, dbse) => {
    if( err ) throw err;
    dbObject = dbse.db('eStore');
       let data = [
       {"brand": "apple"},
       {"brand": "huawei"},
       {"brand": "meizu"},
       {"brand": "samsung"},
       {"brand": "vestel"},
       {"brand": "xiaomi"},
       {"brand": "asus"}
]
        dbObject.collection("brands").insertMany( data ,( err, res ) => {
        if ( err ) throw err;
        console.log(`Data inserted ${res.insertedCount}`);
        dbse.close();
    } );
});