const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Date = require(__dirname + "/date.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 5000;
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
  itemName: String,
});
const Item = mongoose.model("Item", itemsSchema);

// const listItems = ["Read Book", "Learn EJS", "Make Project"];
// const workItems = [];
const task1 = new Item({
  itemName: "Read Book",
});
const task2 = new Item({
  itemName: "Learn EJS",
});
const task3 = new Item({
  itemName: "Make Project",
});
const defaultArray = [task1, task2, task3];
Item.insertMany(defaultArray, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Inserted Items successfully");
  }
});
app.get("/", (req, res) => {
  const Day = Date.getDate();
  res.render("list", { listTitle: Day, Items: listItems });
});
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", Items: workItems });
});
app.post("/", (req, res) => {
  var item = req.body.item;

  if (req.body.button == "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    listItems.push(item);
    res.redirect("/");
  }
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.listen(port, function () {
  console.log("Server started successfully");
});
