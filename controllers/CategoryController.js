
import Category from "../models/CategoryModel.js";
import slugify from "slugify";

////Create Category Controller ..////
export const createCategoryController =async(request, response)=>{
    try{

        ////validation ,,////
        console.log(request)
        const {name} = request.body;
        console.log(request.body)
        if(!name){
            return response.status(400).send({message : 'Name is required'})
        }

        ////... find name in Database to verify its existing in DB or not  ..////
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            response.status(200).send({
                success : true,
                message : 'Category already Exist'
            })
        }

        ///// category ko Database main save krwany kliya  ..////
        const category = await new Category({name , slug :slugify(name) });
        category.save();
        response.status(201).send({
            success : true ,
            message : 'Category save successfully',
            category
        })

    }
    catch(error){
        console.log(error);
        response.status(500).send({
            success : false,
            error,
            message : 'Error in category '
        })
    }
}


///.../////For Update category ...//////

export const updateCategoryController = async(request, response)=>{
    try{
        const {name} = request.body;
        const {id} = request.params;
        const category = await Category.findByIdAndUpdate(id,{name, slug : slugify(name)}, {new : true});
        response.status(200).send({
            success : true,
            message : 'Category Updated Successfully',
            category

        })

    }
    catch(error){
        console.log(error)
        response.status(500).send({
            success : false,
            message : 'Error in Updatecategory controller',
            error

        })
    }

}


///// getting all categories  ..//
export const getAllCategorycontroller =async (request, response)=>{
    try{

        const category = await Category.find({});
        response.status(200).send({
            success: true,
            message : "All Categories List",
            category
        })

    } catch(error){
        console.log(error)
        response.status(500).send({
            success: false,
            message : 'Error in Allcategory controller',
            error
        })
    }
}

///// getting single catagory basis on slug ..//
export const getSingleCategory =async(request, response)=>{
    try{
        const category = await Category.findOne({slug : request.params.slug});
        response.status(200).send({
            success: true,
            message : 'Single Category get successfully ',
            category
        })

    }
    catch(error){
        console.log(error);
        response.status(500).send({
            success : false,
            message : 'Error in single category controller',
            error
        })
    }

}

////// Category delete controller basis on Id /..////   
export const deleteCategoryController = async(request, response)=>{
    try{
        const {id} = request.params;
        await Category.findByIdAndDelete(id);
        response.status(200).send({
            success : true,
            message : 'Category deleted successfully'
        })

    }
    catch(error){
        console.log(error)
        response.status(500).send({
            success: false,
            message : 'Error in deletecategory controller',
            error
        })
    }

}