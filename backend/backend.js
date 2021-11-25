// General Imports
const express = require("express");
const app = express();
const fs = require('fs');
const upload = require("multer")();
const Pool = require("pg").Pool;

const pool = new Pool({
    user:"postgres",
    host:"database",
    database:"default",
    password:"example",
    port:"5432"
})

app.use(express.urlencoded());

app.listen(8080, () => {console.log("Server listening ...")})

app.engine('ntl', function (filePath, options, callback) { // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err)
        // this is an extremely simple template engine
        let rendered;
        if(options.result){
            rendered = content.toString()
                .replace('#result#', '<p class="success"> Found Address </p>')
        } else {
            rendered = content.toString()
                .replace('#result#', '<p class="error"> Found no Address </p>')
        }
        return callback(null, rendered)
    })
})
app.set('views', './views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine

app.get("/", (req, res) => {
    app.render("index", {"result" : null}, ((err, html) => {
        if(err) throw err;
        res.send(html);
    }));
})

app.post("/checkDatabase", (req, res) => {
    let place = {
        "street": req.body.street,
        "number": req.body.number,
        "city": req.body.city,
        "state":req.body.state,
        "postcode":req.body.postcode
    }

    console.log("Place", place)

    pool.query(
        `SELECT * FROM addresses WHERE street LIKE '${place.street}'  
        AND housenumber LIKE '${place.number}' 
        AND city LIKE '${place.city}' 
        AND region LIKE '${place.state}' 
        AND postcode LIKE '${place.postcode}'`,
        (error, result) => {
            if(error) console.log(error);

            if(result.rowCount > 0){
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
        });
})






