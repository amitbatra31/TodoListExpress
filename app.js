const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Date = require(__dirname + "/date.js");
const app = express();
const _ = require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 3000;
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
  itemName: String,
});
const Item = mongoose.model("Item", itemsSchema);

// const listItems = ["Read Book", "Learn EJS", "Make Project"];
// const workItems = [];
const item1 = new Item({
  itemName: "Read Book",
});
const item2 = new Item({
  itemName: "Learn EJS",
});
const item3 = new Item({
  itemName: "Make Project",
});
const defaultArray = [item1, item2, item3];
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});
const List = mongoose.model("List", listSchema);
app.get("/", (req, res) => {
  const Day = Date.getDate();
  Item.find(function (err, results) {
    if (err) {
      console.log(err);
    } else {
      if (results.length == 0) {
        Item.insertMany(defaultArray, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Initialised items Successfully");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", Items: results });
      }
    }
  });
});

app.get("/:catId", (req, res) => {
  const customListName = _.capitalize(req.params.catId);
  List.findOne({ name: req.params.catId }, function (err, result) {
    if (err) {
      console.log("err");
    } else {
      if (result) {
        res.render("list", { listTitle: result.name, Items: result.items });
      } else {
        const list = new List({
          name: customListName,
          items: defaultArray,
        });
        list.save();
        res.redirect("/" + customListName);
      }
    }
  });
});
app.post("/", (req, res) => {
  const Name = req.body.item;
  const listName = req.body.button;
  const newItem = new Item({
    itemName: Name,
  });
  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, result) {
      result.items.push(newItem);
      result.save();
      res.redirect("/" + result.name);
    });
  }
  // if (req.body.button == "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   listItems.push(item);
  //   res.redirect("/");
  // }
});
app.post("/delete", (req, res) => {
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully removed");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } },
      function (err, result) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.listen(port, function () {
  console.log("Server started successfully");
});
