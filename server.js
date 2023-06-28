const express = require('express');
const app = express();
var cors = require('cors');
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded())
app.use(bodyparser.json())
const fs = require('fs')

// enabling cors
app.use(cors());

// common function for read and write files
const readFile = (filePath) => {
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
};

const writeFile = (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data);
        fs.writeFileSync(filePath, jsonData, 'utf8');
        console.log('File has been saved successfully.');
    } catch (error) {
        console.error('Error writing file:', error);
    }
};


//Get file information
app.get('/', (req, res) => {
    try {
        const fileData = fs.readFileSync('data.js', 'utf8');
        res.send({
            Total:JSON.parse(fileData).length, 
            data:JSON.parse(fileData)
        });
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
});


//insert info into files
app.post('/insert', (req, res) => {
    const filePath = 'data.js';
    const request = req.body
    let dataArray = readFile(filePath);
    const newItem = {
        "userId": request.userId,
        "id": request.id,
        "title": request.title,
        "body": request.body
    }
    dataArray.push(newItem);
    writeFile(filePath, dataArray);         // inserting object
    res.send(dataArray);
})


// update info 
app.put('/update', (req, res) => {
    const request = req.body
    const filePath = 'data.js';
    let dataArray = readFile(filePath);
    const itemToUpdate = dataArray.find(item => item.id === request.id);
    if (itemToUpdate) {
        itemToUpdate.title = request.title;
        itemToUpdate.body = request.body;            // updating title and body 
        writeFile(filePath, dataArray);
        res.send(dataArray)
    }
})

// delete info
app.delete('/delete/:id', (req, res) => {
    const request = req.params
    const filePath = 'data.js';
    let dataArray = readFile(filePath);
    dataArray = dataArray.filter(item => item.id !== request.id);    //delete by using unique id 
    writeFile(filePath, dataArray);
    res.send(dataArray)
})


app.listen(8000, () => {
    console.log(`Server runing in port ${8000}`)
})

