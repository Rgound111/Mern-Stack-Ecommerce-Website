import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from 'fs'

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case (!name):
                return res.status(500).send({ error: "Name is Required" });
            case (!description):
                return res.status(500).send({ error: "description is Required" });
            case (!price):
                return res.status(500).send({ error: "price is Required" });
            case (!category):
                return res.status(500).send({ error: "category is Required" });
            case (!quantity):
                return res.status(500).send({ error: "quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({
                        error: "Photo  is required  and value should be less then 1Mb "
                    })
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Products Created Successfully",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Creating Product",
            error
        })
    }
};
// Get all Product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({})
            .limit(12)
            .populate('category')
            .select("-photo")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Get all Products",
            TotalCount: products.length,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: " Error in Get Product"
        })
    }
}

// Get single Product
export const getṢingleProductController = async (req, res) => {
    try {
        const slug = req.params;
        const product = await productModel.findOne(slug)
            .select("-photo")
            .populate("category")

        res.status(200).send({
            success: true,
            message: "Single product",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: " Error in Getting single Product"
        })
    }
}

// get product photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('Content-Type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            Message: "Error in Product Photo"
        })
    }
}

// delete product photo

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product deleted "
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: " Error in Deleting Product"
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case (!name):
                return res.status(500).send({ error: "Name is required" })
            case (!description):
                return res.status(500).send({ error: "description is required" })
            case (!price):
                return res.status(500).send({ error: "price is required" })
            case (!category):
                return res.status(500).send({ error: "category is required" })
            case (!quantity):
                return res.status(500).send({ error: "quantity is required" })
            case photo && photo.size > 10000000:
                return res.status(500).send({
                    message: "Photo is required and photo size must be less then 1mb"
                })
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) },
            { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        res.status(201).send({
            success: true,
            message: "Products Update Successfully",
            products,
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: " Error in Updating"
        })
    }
}

// Product filter Controller
export const filterProductController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in Filtering Product"
        })
    }
}

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: " Error in Product count",
            success: false,
            error
        })
    }
}

export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in per page ctrl",
            error,
        });
    }
};

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-photo");
        res.json(results);
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: " Error in Product Search",
            error
        })
    }
}

export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while getting related product"
        })
    }
}

// get product by category
export const productCategoryController = async (req,res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: " Error in product category"
        })
    }
}