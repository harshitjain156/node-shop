const express = require('express');
const mongoose=require('mongoose')
const Product=require('../models/product');
const multer=require('multer');
const productController=require('../controllers/product')
const checkAuth=require('../middleware/check-auth')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null, new Date().getHours().toString()+file.originalname)
    }
})
const filefilter=(req,file,cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
        cb(null,true);
        
    } else {
        cb(null,false)
    }
}
const upload=multer({storage:storage,limits:{
    fileSize:1024*1024*10
    },
    fileFilter:filefilter

});



const router=express.Router();
router.get('/',productController.get_all_products)


router.post('/',checkAuth,upload.single('productImage'),productController.create_new_product)


router.get('/:productId',productController.get_product)


router.patch('/:productId',productController.update_product);

router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Product Deleted'
        });
    })
    .catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        });
    });       
});
module.exports=router;