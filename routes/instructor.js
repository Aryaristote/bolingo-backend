const { Router } = require('express');
const instructorController = require('../controllers/instructorController');

const router = Router();

router.post('/instructor', instructorController.create); 
router.get('/banned-instructors', instructorController.banned);
router.get('/instructor', instructorController.reads);
router.put('/instructor/:id', instructorController.update);
router.get('/instructor/:id', instructorController.read);
// router.delete('/instructor/:id', instructorController.deletePodcast);

module.exports = router;