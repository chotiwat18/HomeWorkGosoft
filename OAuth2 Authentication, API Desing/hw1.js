const express = require('express');
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')

const jwtsecret = "dkalskdjlasdlkasjdlkas.djaslfjasl;kjflaskfl;ask;ga"

const sqlpool = mysql.createPool({
    namedPlaceholders: true,
    charset: 'utf8',
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "homework1",
})

const app = express();
app.use(express.json());

app.use((req, response, next)=>{
    if(req.path == "/login") return next()

    const authheader = req.headers.authorization

    if(!authheader) return response.json({msg: "error unauthorize"})

    jwt.verify(authheader.split(' ')[1], jwtsecret, (err, result) => {
        if (err) {
            return response.json({msg: "error unauthorize"})
        }
        next()
    })
})

app.post('/login', (req, response) => {
    if (req.body.user == "admin" && req.body.pass == "1234") {
        const token = jwt.sign({ username: "admin" }, jwtsecret)
        return response.json({token})
    }
    return response.status(400).send("error invalid data");
})

app.get('/getData', (req, response) => {
    const sql = 'select * from employee'
    sqlpool.query(sql, (err, result) => {
        if(err) {
            return response.status(400).json(err)
        }
        return response.json({ data: result })
    })
})

app.post('/createData', (req, response) => {
    if(
        !req.body.Fname ||
        !req.body.Lname ||
        !req.body.ID ||
        !req.body.Pos ||
        !req.body.Tel ||
        !req.body.Email
        ) {
        return response.status(400).send("error invalid data");
    }

    const sql = 'insert into employee value (:Fname, :Lname, :ID, :Pos, :Tel, :Email)'
    sqlpool.query(sql, {
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        ID: req.body.ID,
        Pos: req.body.Pos,
        Tel: req.body.Tel,
        Email: req.body.Email
    }, (err, result) => {
        if(err) {
            return response.status(400).json(err)
        }
        return response.json({ data: "ok" })
    })
})

app.put('/updateData', (req, response) => {
    if(
        !req.body.ID ||
        !req.body.Pos ||
        !req.body.Tel ||
        !req.body.Email
        ) {
        return response.status(400).send("error invalid data");
    }
    
    const sql = 'UPDATE employee SET Pos =:Pos, Tel =:Tel, Email =:Email where ID =:ID'
    sqlpool.query(sql, {
        ID: req.body.ID,
        Pos: req.body.Pos,
        Tel: req.body.Tel,
        Email: req.body.Email
    }, (err, result) => {
        if(err) {
            return response.status(400).json(err)
        }
        if(result.affectedRows == 0) return response.status(400).json({data: "Employee not found"})
        return response.json({ data: "ok" })
    })
})

app.delete('/deleteData', (req, response) => {
    if(!req.body.ID) return response.status(400).send("error invalid data");
    
    const sql = 'DELETE from employee where ID =:ID'
    sqlpool.query(sql, {
        ID: req.body.ID
    }, (err, result) => {
        if(err) {
            return response.status(400).json(err)
        }
        if(result.affectedRows == 0) return response.status(400).json({data: "Employee not found"})
        return response.json({ data: "ok" })
    })
})

app.listen(3000 , () => {
    console.log(`Listening on port: 3000`);
});
