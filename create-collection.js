const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/eStore";

MongoClient.connect(url, ( err, dbse ) => {
    if ( err ) throw err;
    console.log('DataBase Created');
    dbObject = dbse.db('eStore');

    dbObject.createCollection("mobilesList", ( err, res ) => {
        if( err ) throw err;
        console.log(`collection created`);
        dbse.close();
    });
});



