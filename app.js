const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Task = require("./Task");
const date = require(__dirname + "/date.js");
const app = express();

const pathList = __dirname + "/view/list.ejs";
const pathAbout = __dirname + "/view/about.ejs";
// const itemArray = ["example task"];

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

        let tasks = await Task.find();
        if (tasks.length === 0){
            Task.insertMany([task1, task2, task3])
            .then(() => console.log("input into a list was succesfull"))
            .catch((err) => console.log(err.message));  
        }
        tasks = await Task.find();
        let todayDate = date.getDate();
        ejs.renderFile(pathList, {currentDate: todayDate, newItems: tasks}, function(err, data){
            res.send(data);
        
        });
    })
    
    app.get("/about", function(req, res){
        ejs.renderFile(pathAbout, function(err, data){
            res.send(data);
        })
    })

    app.post("/del", async function(req, res){
        await Task.deleteOne({_id: req.body.itemToDelete});
        res.redirect("/");

    })
    
    app.post("/", async function(req, res){
        try {            
            await Task.create({
                toDo: req.body.newItem
            });
        } catch (err) {
            console.log(err.message);
        }
        res.redirect("/");
    
    })
    
    app.listen(3000, function(){
        console.log("Server running on port 3000");
    })

    // mongoose.connection.close();
}

