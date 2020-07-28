const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = 4599;
const url = "mongodb://localhost:27017/eStore";
//
// let allowCrossDomain = ( req, res, next ) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
// //    intercept OPTIONS method
//     if ( 'OPTIONS' === req.method ) {
//         res.sendStatus(200);
//     }
//     else {
//         next();
//     }
// };

// app.use(allowCrossDomain);
app.use(cors());
app.use(express.json());

app.get('/brands', ( req, res ) => {

    let responseObject = {};
    MongoClient.connect(url, (err, dbse ) => {

        if (err) throw err;
        let dbObject = dbse.db("eStore");

        dbObject.collection("brands").find({}).toArray( (err, result) => {
            if (err){
                console.log(err);
                responseObject.status = "Failure";
            }
            else {
                responseObject.status = "Success";
                responseObject["data"] = result;
                console.log(responseObject);
                res.send(responseObject);
            }
            dbse.close();
        });
    });
});

app.get('/mobilesList', ( req, res ) => {
    console.log(req.query);
    let responseObject = {};
    let query = {};
    let sortVal = {};
    let filterStatus = req.query.isBrandFilter;
    let sortFilterStatus = req.query.isSortFilter;
    let filterValue = req.query.brandFilterValue;
    let searchStatus = req.query.searchFor;
    let searchValue = req.query.searchValue;
    let mobileId = req.query.mobileId;
    let mobId = new ObjectId(mobileId);
    let sortFilterValue = parseInt(req.query.sortValue);
    console.log(sortFilterValue,'sfv')
    console.log(mobileId,'id')

    if(filterStatus === 'true' && sortFilterStatus === 'true' ){
        console.log('both filter applied')
         query = {brand: {$in: filterValue}};
        sortVal = {price: sortFilterValue };
    }
    else if(filterStatus === 'true' && sortFilterStatus === 'false'  ){
        console.log('f-a s-na')
        query = {brand: {$in: filterValue}};
        sortVal = {};
    }
    else if ( filterStatus === 'false' && sortFilterStatus === 'true' ){
        console.log('f-na s-a');
        query = {};
         sortVal = {price: sortFilterValue };
    }
    else if( searchStatus === 'true' ) {
        query = {title: {$regex: new RegExp(".*"+  searchValue +".*", "i") }}
    }
    else if(mobileId){
        console.log('else-if');
        query = {_id: mobId};
    }
    else {
        console.log('else');
        query = {};
        sortVal = {};
    }

    MongoClient.connect(url, (err, dbse ) => {
        console.log('md');
       if (err) throw err;
         let dbObject = dbse.db("eStore");

        dbObject.collection("mobilesInfm").find(query).sort(sortVal).toArray( (err, result) => {
            if (err){
                 console.log(err);
                responseObject.status = "Failure";
            }
             else {
                 responseObject.status = "Success";
                responseObject["data"] = result;
                // console.log(responseObject);
                res.send(responseObject);
             }
           dbse.close();
        });
     });
});

app.post('/addItems', ( req, res ) => {
    console.log(req.body);

    let responseObject = {};

    let tit = req.body.title;
    let title = tit.toLowerCase();
    let br = req.body.brand;
    let brand = br.toLowerCase();
    console.log(title);
    console.log(brand)
    let getData = {
        brand: brand,
        title: title,
        price: Number(req.body.price)
    }

    let items = getData;
    MongoClient.connect(url, (err, dbse ) => {

        if (err) throw err;
        let dbObject = dbse.db("eStore");

        dbObject.collection('mobilesInfm').insertOne(items, ( err, result ) => {
            if (err){
                console.log(err);
                responseObject.status = "Failure";
                res.json(responseObject);
            }
            else {
                responseObject.status = "Success";
                // responseObject["data"] = result;
                console.log(responseObject);
                res.json(responseObject);
            }
            dbse.close();
        });
    });

});


app.listen(port, () => {
  console.log(`App Listening to Port ${port}`);
});



