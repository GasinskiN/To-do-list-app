const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Task = require("./Task");
const date = require(__dirname + "/date.js");
const app = express();

const pathList = __dirname + "/view/list.ejs";
const pathAbout = __dirname + "/view/about.ejs";
const itemArray = ["example task"];

app.use(express.static(__dirname + '/public/'));

app.use(express.urlencoded({extended: true}));

const task1 = new Task({
    toDo: "This is a list"
});
const task2 = new Task({
    toDo: "Click the plus to add a new task"
});
const task3 = new Task({
    toDo: "<--- this is a button to delete a task "
});




main().catch((err) => console.log(err.message));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/toDoDB");
    
    app.get("/", async function(req, res){
        
        // let tasks = getTaskArray();

        let tryout = await Task.find();
        // let tasks = Task.find().catch((err) => console.log(err.message));
        if (tryout.length === 0){
            Task.insertMany([task1, task2, task3])
            .then(() => console.log("input into a list was succesfull"))
            .catch((err) => console.log(err.message));  
        }
        console.log(tryout[0]);
        let todayDate = date.getDate();
        ejs.renderFile(pathList, {currentDate: todayDate, newItems: tryout}, function(err, data){
            res.send(data);
        
        });
    })
    
    app.get("/about", function(req, res){
        ejs.renderFile(pathAbout,function(err, data){
            res.send(data);
        })
    })
    
    app.post("/", function(req, res){
    
        itemArray.push(req.body.newItem);
        res.redirect("/");
    
    })
    
    app.listen(3000, function(){
        console.log("Server running on port 3000");
    })
}

async function getTaskArray(){
    const tasks = await Task.find();
    console.log(tasks);
    return tasks;
}
