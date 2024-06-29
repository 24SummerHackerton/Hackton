const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// 모든 종목 가져오기
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 종목 추가하기
router.post('/', async (req, res) => {
  const event = new Event({
    eventName: req.body.eventName,
    teams: req.body.teams
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 종목 삭제하기
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.remove();
    res.json({ message: 'Deleted Event' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
