const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    // Add reference to the user who created the story
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    // Add more fields as needed
});

module.exports = mongoose.model('Story', StorySchema);
