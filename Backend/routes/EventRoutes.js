const router = require("express").Router();
const mongoose = require("mongoose");
const events = require('../models/events');
const auth = require("./users/auth");

// GET ROUTES

// get request for displaying all events
router.get("/", async (req, res) => {
  try {
    const data = await events.find({}).select("title date website");
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
router.get("/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const data = await events.findOne({ title });
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
// data required in the request body- title, date, website, details
router.post("/addroom", auth, async (req, res) => {
  try {
    const { title, date, website, details } = req.body;
    const newEvent = new events({
      user: req.userdata,
      title,
      date,
      website,
      details,
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

// UPDATE ROUTES
// All the update routes will be written here

//This route will edit particular event
router.put('/edit/:title', async (req, res) => {
  const event = req.params.title;
  events.findOne({ title: event }, (err, eve) => {
    if (err) {
      res.json({ error: true, message: `Error while finding this event`, errMessage: err });
    } else if (eve) {

      const { title, date, website, details } = req.body;
      eve.title = title != "" ? title : eve.title;
      eve.date = date != "" ? date : eve.date;
      eve.website = website != "" ? website : eve.website;
      eve.details = details != "" ? details : eve.details;
      eve.save((err, result) => {
        if (err) {
          res.json({
            error: true,
            message: err
          });
        } else if (result) {
          res.json({
            error: false,
            message: "Event updated successfully",
            title: result.title,
            date: result.date,
            website: result.website,
            details: result.details,
          });
        } else {
          res.json({
            error: true,
            message: 'Error updating event'
          });
        }
      });
    }
  })
})


// DELETE ROUTES
// All the delete routes will be written here

//This route will delete particular event
router.delete('/delete/:id', auth, async (req, res) => {
        const id = req.params.id;

        let event = await events.findOne({ });
        if (!title) {
          return res.status(404).send("Not Found");
        }

        event = await events.findByIdAndDelete(event._id);
        res.json({ message: "Deleted Successfully", event });

}
);


module.exports = router;
