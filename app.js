const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Task = require(__dirname + "/Task");
const List = require(__dirname + "/List");
const date = require(__dirname + "/date.js");
const capitalize = require('lodash/capitalize');
const app = express();

const pathList = __dirname + "/view/list.ejs";
const pathAbout = __dirname + "/view/about.ejs";

app.use(express.static(__dirname + '/public/'));

app.use(express.urlencoded({extended: true}));

// make default tasks
const task1 = new Task({
    toDo: "This is a list"
});
const task2 = new Task({
    toDo: "Click the plus to add a new task"
});
const task3 = new Task({
    toDo: "<--- this is a delete button "
});

main().catch((err) => console.log(err.message));

async function main(){
    // connect to the mongodb database
    await mongoose.connect("mongodb://127.0.0.1:27017/toDoDB");
    
    app.get("/", async function(req, res){

        // get tasks array and check if it is empty
        let tasks = await Task.find();
        if (tasks.length === 0){
            // if empty insert into the task collection default tasks
            Task.insertMany([task1, task2, task3])
            .then(() => console.log("input into a list was succesfull"))
            .catch((err) => console.log(err.message));  
        }

        // get tasks array once again in case it has changed
        tasks = await Task.find();
        // get date
        let todayDate = date.getDate();
        // render the page provided arguments are todays date and the tasks
        ejs.renderFile(pathList, {listTitle: todayDate, newItems: tasks}, function(err, data){
            res.send(data);
            if(err){
                console.log(err.message);
            }
        });
    })
    
    // render about page
    app.get("/about", function(req, res){
        ejs.renderFile(pathAbout, function(err, data){
            res.send(data);
        })
    })

    // Delete a task by id and render homepage again
    app.post("/del", async function(req, res){
        const todayDate = date.getDate();
        const listName = req.body.nameOfList;
        // check if i should delete from the default list
        if(listName === todayDate){
            // if so delete from the task collection
            await Task.deleteOne({_id: req.body.itemToDelete});
            res.redirect("/")
        } else{
            // else get list to delete from and delete from the array by id
            const listToDeleteFrom = await List.findOne({name: listName});
            listToDeleteFrom.items.pull({_id: req.body.itemToDelete});
            await listToDeleteFrom.save();
            // redirect to the page we were posted from
            res.redirect("/" + listName)
        }
        

    })
    
    // Add task to a list and render page again
    app.post("/", async function(req, res){
        // get date and create new Task item with input provided by the user
        const todayDate = date.getDate();
        const newItem = await new Task({
            toDo: req.body.newItem
        });
        // if list title is equal to todays date save new item to default Task collection
        if(req.body.list === todayDate){
            try {            
                await newItem.save();
            } catch (err) {
                console.log(err.message);
            } finally {
                res.redirect("/");
            }
            // if the title is different then save to our lists collection ito subdocument items
        } else{
            try {
                const listToAddTo = await List.findOne({name: req.body.list});
                listToAddTo.items.push(newItem);
                await listToAddTo.save();
            } catch (error) {
                console.log(error.message);
            } finally{
                // redirect to the same page that is being used
                res.redirect("/" + req.body.list);
            }
        }
    
    })

    app.get("/:userMadeList", async function(req, res){
        // get name of path and set first letter to capital and the rest to lowercase
        const nameOfUserList = capitalize(req.params.userMadeList);
        // check if list exists
        let myList = await List.findOne({name: nameOfUserList})
        if (!myList){
            // if the list doesn't exist create it with some default values
            try { 
                const list = await List.create({
                    name: nameOfUserList,
                    items: [task1, task2, task3],
                });
                // update myList value
                myList = list;
            } catch (err) {
                console.log(err.message);
            }
        }
        
        ejs.renderFile(pathList, {listTitle: nameOfUserList, newItems: myList.items}, function(err, data){
            res.send(data);
        
        });
    })
    
    // start server
    app.listen(3000, function(){
        console.log("Server running on port 3000");
    })
} 

