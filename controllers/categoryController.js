import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({
                message: 'Name is required'
            })
        }
        const existingCategory = await categoryModel.findOne({ name })

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exisits"
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save()

        res.status(200).send({
            success: true,
            message: "New category Created",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: " error in Category",
            error
        })
    }
}

// get category 
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })

        res.status(200).send({
            success: true,
            message: "category updated successfully",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in update-category",
            error
        })
    }
}

// get category
export const getCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})

        res.status(200).send({
            success: true,
            message: "get all categories",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: " Error in get category",
            error
        })
    }
}

// single category
export const singleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });
        res.status(200).send({
            success: true,
            message: "Get single category",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in single Category",
            error
        })
    }
}

// delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: " category deleted Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: " error in deleteCategory",
            error
        })
    }
}