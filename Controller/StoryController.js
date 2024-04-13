const express = require('express');
const router = express.Router();
const Story = require('../Model/StoryModel');
const jwt = require('jsonwebtoken');

// Create story API
router.post('/create', async (req, res) => {
    try {
        // Check if Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing. Please provide a valid JWT token."
            });
        }

        // Extract user ID from JWT token
        const token = req.headers.authorization.split(' ')[1];
        console.log("abhay:-",token)
        const decodedToken = jwt.verify(token, 'surya');
        const userId = decodedToken.userId;

        const { title, description, date, location } = req.body;
        
        // Create new story with user ID
        const story = new Story({
            title,
            description,
            date,
            location,
            createdBy: userId
        });
        await story.save();

        return res.status(201).json({
            success: true,
            message: "Story created successfully",
            data: story
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/fetch', async (req, res) => {
    try {
        let stories;

        const { year } = req.query;

        if (year) {
            const parsedYear = parseInt(year);
            stories = await Story.find({ date: { $gte: new Date(parsedYear, 0, 1), $lte: new Date(parsedYear, 11, 31) } });
        } else {
            stories = await Story.find();
        }

        return res.status(200).json({
            success: true,
            message: "Stories fetched successfully",
            data: stories
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}); 



router.put('/update/:id', async (req, res) => {
    try {
        // Check if Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing. Please provide a valid JWT token."
            });
        }

        // Extract user ID from JWT token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'abhay');
        const userId = decodedToken.userId;

        // Trim any whitespace characters, including newline characters, from the story ID
        const storyId = req.params.id.trim();

        // Find the story by ID
        const story = await Story.findOne({ _id: storyId });

        // Check if the story exists
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        // Check if the user is the creator of the story
        if (!story.createdBy || story.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this story"
            });
        }

        // Update the story fields
        const { title, description, date, location } = req.body;
        story.title = title;
        story.description = description;
        story.date = date;
        story.location = location;

        // Save the updated story
        await story.save();

        return res.status(200).json({
            success: true,
            message: "Story updated successfully",
            data: story
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});






module.exports = router;
