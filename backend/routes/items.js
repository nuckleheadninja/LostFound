const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

// @route   POST /api/items
// @desc    Add new item
// @access  Private
router.post('/', protect, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;
  try {
    const item = await Item.create({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      postedBy: req.user._id,
    });
    const populated = await item.populate('postedBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error: error.message });
  }
});

// @route   GET /api/items/search?name=xyz
// @desc    Search items by name or type
// @access  Private
// NOTE: This route MUST be before /:id to avoid 'search' being treated as an ID
router.get('/search', protect, async (req, res) => {
  const { name } = req.query;
  try {
    const items = await Item.find({
      itemName: { $regex: name, $options: 'i' },
    }).populate('postedBy', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/items
// @desc    Get all items
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('postedBy', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating item', error: error.message });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
