const express = require("express");
const { Router } = require("express");
const router = Router();
const locationModel = require("./location.model");

router.get("/", async (req, res) => {
  try {
    const response = await locationModel.find();
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:id", async (req, res) => {
  const location = req.params.id;
  if (location) {
    await locationModel.find({ id: id }, (err, docs) => {
      console.log(`[${new Date()}] Retrieved data from API: ${location.id}`);
      res.json(docs[0]);
    });
  }
});

module.exports = router;
