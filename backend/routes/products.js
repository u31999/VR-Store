import express from 'express'
import Product from '../models/productsModels.js'
import expressAsyncHandler from 'express-async-handler'
const router = express.Router()

router.get('/', expressAsyncHandler( async (req, res) => {
    const products = await Product.find({}) 

    res.json(products)
}))

router.get('/:id', expressAsyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        res.json(product)
    }else{
        res.status(404).json({message: 'Product not found'})
    }
}))

export default router