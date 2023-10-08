const router = require("express").Router();
const mongoose = require("mongoose");
const events = require('../models/events');
const auth = require("./users/auth");

// GET ROUTES

// get request for displaying all events
router.get("/", auth, async (req, res) => {
  try {
    const id = req.userid;
    // const data = await events.find({user:id}).select("title date website");
    const data = await events.find({user:id});
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
    const data = await events.findOne({ title, user: id});
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
    const newEvent = new events({
      user: req.userid,
      title,
      website,
      start,
      end,
      organisation,
      location
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
      msg: "Something went wrong",
    });
  }
});

// UPDATE ROUTES
// All the update routes will be written here

//This route will edit particular event
router.put('/edit/:id', auth, async (req, res) => {
  try {
  const eventId = req.params.id;
        const userId = req.userid;
        let event = await events.findById(eventId);
        console.log(event);

        if (!event) {
          return res.status(404).send("Not Found");
        }
        if(userId != event.user.toString()){
          return res.status(401).send("Not ALlowed");
        }

      const { title, website, start, end, organisation, location} = req.body;
      const newEvent = {};
      if(title) { newEvent.title = title; }
      if(website) { newEvent.website = website; }
      if(start) { newEvent.start = start; }
      if(end) { newEvent.end = end; }
      if(organisation) { newEvent.organisation = organisation; }
      if(location) { newEvent.location = location; }
      event = await events.findByIdAndUpdate( eventId, {$set: newEvent}, {new : true});
          res.json({message: "Event updated successfully",
            event});
         
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal Server", error});
  }

})


// DELETE ROUTES
// All the delete routes will be written here

//This route will delete particular event
router.delete('/delete/:id', auth, async (req, res) => {
        const eventId = req.params.id;
        const userId = req.userid;
        let event = await events.findById(eventId);
        if (!event) {
          return res.status(404).send("Not Found");
        }
        if(userId != event.user.toString()){
          return res.status(401).send("Not ALlowed");
        }

        event = await events.findByIdAndDelete(eventId);
        res.json({ message: "Deleted Successfully", event });

}
);


module.exports = router;
