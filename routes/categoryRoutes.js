import express from 'express'

const router = express.Router()
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js';
import { createCategoryController, updateCategoryController, getAllCategorycontroller,getSingleCategory ,deleteCategoryController} from '../controllers/CategoryController.js';

///Crerate category Routes ..//
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//// Update Category Route ..///
router.put('/update-category/:id', requireSignIn, isAdmin , updateCategoryController )

///// Get All Categories  ..//
////yahan hum koi b middleware isi liya q k user login ho ya na ho lakin hamain category show krwani e hain..///
router.get('/get-category', getAllCategorycontroller)

//// single Category ..//
////yahan hum koi b middleware isi liya q k user login ho ya na ho lakin hamain category show krwani e hain..///
router.get('/single-category/:slug', getSingleCategory);


//// Category delete ..///
router.delete('/delete-category/:id' , requireSignIn , isAdmin , deleteCategoryController)

export default router;