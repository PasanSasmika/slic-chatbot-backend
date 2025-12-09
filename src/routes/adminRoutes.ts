import { Router } from 'express';
import multer from 'multer';
import { AdminController } from '../controllers/adminController';

const adminrouter = Router();
const upload = multer({ dest: 'uploads/' }); 

adminrouter.post('/upload', upload.single('file'), AdminController.uploadDataset);

export default adminrouter;