const Content = require('../models/Content');
const Instructor = require('../models/Instructor');
const sequelize = require('../config/database');
const { update } = require('./instructorController');

const handleErrors = (error, req, res, next) => {
    console.error(error.message);
};

const create = async (req, res) => {
    try {
      const { title, description, contentType, price, content } = req.body; 
      const instructorId = 5;
      const instructor = await Instructor.findByPk(instructorId);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        const newContent = await Content.create({
            title,
            description,
            contentType,
            price,
            content,
            instructorId,
        });
  
        return res.status(201).json(newContent);
    } catch (error) {
        console.error('Error creating content:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
  
//Get all contents.
const reads = async (req, res) => {
    try {
        const contents = await Content.findAll({
            // where: {
            //     instructorId: 14,
            // },
            include: [
                {
                    model: Instructor,
                    as: 'Instructor',
                },
            ],
        });
        return res.json({ contents });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Update to Approved
const approved = async (req, res) => {
    const contentId = req.params.id;
  
    try {
      const content = await Content.findByPk(contentId);
  
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      content.status = content.status === 'Pending' ? 'Approved' : 'Pending'; 
      await content.save();
  
      res.json({ message: 'Status updated successfully', newStatus: content.status });
    } catch (error) {
      console.error('Error toggling instructor status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// update to Disapproved 
const disapproved = async (req, res) => {
    const contentId = req.params.id;
  
    try {
      const content = await Content.findByPk(contentId);
  
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      content.status = "Disapproved"; 
      await content.save();
  
      res.json({ message: 'Status updated successfully', newStatus: content.status });
    } catch (error) {
      console.error('Error toggling instructor status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// update to Remove 
const removed = async (req, res) => {
    const contentId = req.params.id;
  
    try {
      const content = await Content.findByPk(contentId);
  
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      content.status = "Removed"; 
      await content.save();
  
      res.json({ message: 'Status updated successfully', newStatus: content.status });
    } catch (error) {
      console.error('Error toggling instructor status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Read one content 
// const read = async (req, res) => {
//     const instructorId = req.params.id;
//     try{
//         const instructor = await Instructor.findById(instructorId);
//         if(!instructor){
//             return res.status(404).json({ message: 'Instructor not found' });
//         }
//         res.json(instructor);
//     } catch(error){
//         console.error('Error retrieving instructor:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

module.exports = {
    create,
    reads,
    approved,
    disapproved,
    removed,
};