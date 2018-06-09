const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {

let agent = req.headers["user-agent"].replace(',','')
let time = new Date().toISOString()
let method = req.method            
let resource = req.url
let version = 'HTTP/'+req.httpVersion
let status = '200'
let csvLog = `${agent},${time},${method},${resource},${version},${status}\n`

fs.appendFile('./log.csv',csvLog,err => {
    if (err) {
        throw err
    }
    console.log(csvLog)
    next()
    })
});

app.get('/', (req, res) => {

res.send('ok')
});

app.get('/logs', (req, res) => {

    fs.readFile('./log.csv', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let line = data.split('\n');
        line.shift();

        let Data = [];
        line.forEach(line => {
            let contents = line.split(',');
            let lineJson = {
                "Agent": contents[0],
                "Time": contents[1],
                "Method": contents[2],
                "Resource": contents[3],
                "Version": contents[4],
                "Status": contents[5],
            };
            if (contents[0] !== "") {
                Data.push(lineJson);
            }
        });
        res.json(Data);
    });
});
module.exports = app;