const Instructor = require("../models/Instructor");
const sequelize = require('../config/database');

const handleErrors = (error, req, res, next) => {
    console.error(error.message);
};

const create = async (req, res) => {
    const { fname, email, countryCode, phoneNumber, language, section } = req.body; 
    try {
        const instructor = await Instructor.create({ fname, email, countryCode, phoneNumber, language, section });
        console.log("Instructor created successfully");
        
        res.status(200).json('Instructor created successfully');
    } catch (error) {
        handleErrors(error, req, res);
    }
}

const reads = async (req, res) => { 
    try {
        const instructor = await Instructor.findAll();
        res.json(instructor)
    } catch (error) {
        handleErrors(error, req, res);
        res.status(500).json('Internal server error');
    }
}

// Return Banned Instructors 
const banned = async (req, res) => {
    try {
      const instructors = await Instructor.findAll({
        where: { status: 'Banned' }, // Define your condition here
      });
      res.json(instructors);
    } catch (error) {
      handleErrors(error, req, res);
      res.status(500).json('Internal server error');
    }
  };
  

const read = async (req, res) => {
    const instructorId = req.params.id;
    try{
        const instructor = await Instructor.findById(instructorId);
        if(!instructor){
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    } catch(error){
        console.error('Error retrieving instructor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update / Ban 
const update = async (req, res) => {
    const instructorId = req.params.id;
  
    try {
      const instructor = await Instructor.findByPk(instructorId);
  
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }
      instructor.status = instructor.status === 'Active' ? 'Banned' : 'Active'; 
      await instructor.save();
  
      res.json({ message: 'Status updated successfully', newStatus: instructor.status });
    } catch (error) {
      console.error('Error toggling instructor status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// Delete
const delet = async (req, res) => {
    const podcastId = req.params.id;

    try {
        const deletedPodcast = await Podcast.findByIdAndDelete(podcastId);
    
        if (!deletedPodcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
    
        return res.status(204).json({ message: 'Podcast deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    create,
    reads,
    read,
    update,
    banned,
    delet
};