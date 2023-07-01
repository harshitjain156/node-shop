const mongoose=require('mongoose')
const Product=require('../models/product');

exports.get_all_products=(req,res,next)=>{
    Product.find().select('name price _id productImage').exec()
    .then(docs=>{
        const response={
            count: docs.length,
            products:docs.map(
                doc=>{
                    return{
                        name:doc.name,
                        price:doc.price,
                        _id:doc._id,
                        productImage:doc.productImage,
                        request:{
                            method:"GET",
                            url:"http://localhost:3000/products/"+doc._id
                        }
                    }
                }
            )
        }

        res.status(200).json(response
        )
    })
    .catch(err=>{console.log(err);
            res.status(500).json({
                error:err
            })
        });
}

exports.create_new_product=(req,res,next)=>{
    console.log(req.file);
const product=new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price:req.body.price,
    productImage:req.file.path
})
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Product added Succesfully',
            details:{
                name:result.name,
                price:result.price,
                id:result._id,
                request:{
                    method:"GET",
                    url:"http://localhost:3000/products/"+result._id
                }
            }
        })
    }).catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        })
    })

   
}

exports.get_product=(req,res,next)=>{
    const id=req.params.productId;
   Product.findById(id).select('name price _id productImage').exec().then(
    doc=>{
        console.log(doc);
    if(doc){
        res.status(200).json(doc);
    }else{
        res.status(404).json({
            message: "Invalid Id"
        });
    }
    })
   .catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    })
   });
}

exports.update_product=(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        res.status(200).json(result)
    })
        .catch(err=>{console.log(err+"++");
            res.status(400).json({
                error:err
            });
        }); 
}