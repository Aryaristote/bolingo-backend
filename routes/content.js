const { Router } = require('express');
const ContentController = require('../controllers/contentController');

const router = Router();

router.post('/content', ContentController.create); 
router.get('/content', ContentController.reads);
router.put('/content/:id', ContentController.approved);
router.put('/content-disapproved/:id', ContentController.disapproved);
router.put('/content-removed/:id', ContentController.removed);

module.exports = router;