const express = require('express');

const app = express();
app.use(express.json());

let Employees = []

app.get('/getEmployee', (req, res) => {
    res.status(200).json({
        data: Employees
    })
})

app.post('/postEmployee', (req, res) => {
    if (
        !req.body.Firstname ||
        !req.body.Lastname ||
        !req.body.ID ||
        !req.body.Pos ||
        !req.body.Tel ||
        !req.body.Email
    ) {
        return res.status(400).json({ Message : "Error" })
    }

    for (let i = 0; i < Employees.length; i++) {
        if (
            Employees[i].ID == req.body.ID ||
            Employees[i].Tel == req.body.Tel ||
            Employees[i].Email == req.body.Email
        ) {
            return res.status(400).json({ Message : "Error: ข้อมูลซ้ำ" })
        }
    }

    const newData = {
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        ID: req.body.ID,
        Pos: req.body.Pos,
        Tel: req.body.Tel,
        Email: req.body.Email
    };

    Employees.push(newData)

    res.status(200).json({ Message : "Success" })
})

app.put('/editEmployee', (req, res) => {
    if (
        !req.body.ID ||
        (
            !req.body.Pos &&
            !req.body.Tel &&
            !req.body.Email
        )
    ) {
        return res.status(400).json({ Message : "Error" })
    }

    for (let i = 0; i < Employees.length; i++) {
        if (Employees[i].ID == req.body.ID) {

            if (req.body.Pos) Employees[i].Pos = req.body.Pos
            if (req.body.Tel) Employees[i].Tel = req.body.Tel
            if (req.body.Email) Employees[i].Email = req.body.Email

            return res.status(200).json({ Message : "Success" })
        }
    }

    return res.status(400).json({ Message : "Error: หาไม่เจอ" })
})

app.delete('/deleteEmployee', (req, res) => {
    if (!req.body.ID) {
        return res.status(400).json({ Message : "Error" })
    }
    for (let i = 0; i < Employees.length; i++) {
        if (Employees[i].ID == req.body.ID) {
            Employees.splice(i, 1);
            return res.status(200).json({ Message : "Success" })
        }
    }
    return res.status(400).json({ Message : "Error: หาไม่เจอ" })
})

app.listen(3000, () => {
    console.log('Listening on port: 3000');
});