// General Imports
const express = require("express");
const app = express();
const fs = require('fs')

// Hive Imports
const hive = require('hive-driver');

// Declarations for hive
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);
const utils = new hive.HiveUtils(
    TCLIService_types
);

const port = 3000
app.use(express.json());

app.listen(8080, () => {console.log("Server listening ...")})

app.engine('ntl', function (filePath, options, callback) { // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err)
        // this is an extremely simple template engine
        let rendered;
        if(options.result){
            rendered = content.toString()
                .replace('#result#', '<p style="background-color: green"> Found Address </p>')
        } else {
            rendered = content.toString()
                .replace('#result#', '<p style="background-color: red"> Found no Address </p>')
        }
        return callback(null, rendered)
    })
})
app.set('views', './views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine

app.get("/", (req, res) => {
    app.render("index", {"title": "peter", "message":"works"}, ((err, html) => {
        if(err) throw err;
        res.send(html);
    }));
})

app.post("/checkDatabase", (req, res) => {
    console.log(req.body);
    let place = {
        "street": req.body.street,
        "number": req.body.number,
        "city": req.body.city,
        "state":req.body.state,
        "postcode":req.body.postcode
    }

    client.connect(
        {
            host: 'localhost',
            port: 10000
        },
        new hive.connections.TcpConnection(),
        new hive.auth.PlainTcpAuthentication({
            username: 'hadoop',
            password: ' '
        })
    ).then(async client => {
        const session = await client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
        });
        console.log("Executing statement ...")
        const operation = await session.executeStatement(
            `SELECT * FROM final_addresses 
                    WHERE street LIKE '${place.street}' 
                    AND housenumber LIKE '${place.number}' 
                    AND city LIKE '${place.city}' 
                    AND region LIKE '${place.state}' 
                    AND postcode LIKE '${place.postcode}'`
        );
        await utils.waitUntilReady(operation, true, () => { console.log("Retrieved Result ...")});
        await utils.fetchAll(operation);

        console.log("Closing database connections ...")
        await operation.close();
        await session.close();

        let result = await utils.getResult(operation).getValue();

        console.log(result.length);
        if(result.length > 0){
            app.render("index", {"result": result}, ((err, html) => {
                if(err) throw err;
                res.send(html);
            }));
        } else {
            app.render("index", {"result": null}, ((err, html) => {
                if(err) throw err;
                res.send(html);
            }));
        }


    }).catch(console.log)
})






