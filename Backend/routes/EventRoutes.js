const router = require("express").Router();
const mongoose = require("mongoose");
const events = require("../models/events");
const event = require("../models/events");
const auth = require("./users/auth");
const form = require("../models/form");

// GET ROUTES

// get request for displaying all events
router.get("/", auth, async (req, res) => {
  try {
    const id = req.userid;
    const data = await events.find({user: id});
    console.log(data);
    res.send({
      msg: "data fetched successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
});

//get request for displaying single event
router.get("/:title", auth, async (req, res) => {
  try {
    const id = req.userid;
    const title = req.params.title;
    const data = await event.findOne({ title, user: id });
    res.send({
      msg: "data fetched successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// POST ROUTES

// post request for adding event
// data required in the request body- title, website, start, end, organisation, location
router.post("/addroom", auth, async (req, res) => {
  try {
    const { title, website, start, end, organisation, location } = req.body;
    const newEvent = new event({
      user: req.userid,
      title,
      website,
      start,
      end,
      organisation,
      location,
    });
    //saving data in db
    const newEventInfo = await newEvent.save();
    console.log(newEventInfo);
    res.send({
      message: "new event added",
      event: newEventInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "something went wrong",
    });
  }
});

//Adding an api to extract the data from the form
router.post('/submit-form',async (req , res) => {
  try {
    const {name , email , message} = req.body;
    const Form = new form({
      name, email, message
    });
    //Saving data in Database
    const data = await Form.save();
    res.send({
      message: "Form sent successfully",
      data
    });
  } catch (error) {
    res.status(500).send({
      msg: "something went wrong"
    })
  }
 
});





// UPDATE ROUTES
// All the update routes will be written here

//This route will edit particular event
router.put("/edit/:title", auth, async (req, res) => {
  const event = req.params.title;
  events.findOne({ title: event }, (err, eve) => {
    if (err) {
      res.json({
        error: true,
        message: `Error while finding this event`,
        errMessage: err,
      });
    } else if (eve) {
      const { title, website, start, end, organisation, location } = req.body;
      eve.title = title != "" ? title : eve.title;
      eve.website = website != "" ? website : eve.website;
      eve.start = start != "" ? start : eve.start;
      eve.end = end != "" ? end : eve.end;
      eve.organisation = organisation != "" ? organisation : eve.organisation;
      eve.location = location != "" ? location : eve.location;
      eve.save((err, result) => {
        if (err) {
          res.json({
            error: true,
            message: err,
          });
        } else if (result) {
          res.json({
            error: false,
            message: "Event updated successfully",
            title: result.title,
            website: result.website,
            start: result.start,
            end: result.end,
            organisation: result.website,
            location: result.website,
          });
        } else {
          res.json({
            error: true,
            message: "Error updating event",
          });
        }
      });
    }
  });
});

// DELETE ROUTES

// Route for Deleting an event
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
    return data;
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

module.exports = router;
