//@ts-check
import { Router } from "express";
import { ProductManager } from "../services/ProductManager.js";

const router = Router();
const service = new ProductManager();
await service.customConstructor();

router.get("/", async (req, res) => {
    let products = await service.getProducts();
    if (!!products){
        if (!!req.query.limit && Number(req.query.limit)>=0 && products.length > req.query.limit) products = products.slice(0, req.query.limit)
        else if (Number(req.query.limit)<0) return res.status(400).json({
            status: "Error",
            message: "Invalid limit specified",
            data: null
        })
        return res.status(200).json(products);
    }else return res.status(404).json({
            status: "Error",
            message: "Products not found",
            data: null
    });
});

router.get('/:pid', async (req, res) => {
    const id = Number.parseInt(req.params.pid);
    const response = service.getProductById(id);
    if (!!response.data) return res.status(200).json({
        status: "Success",
        message: "Product found",
        data: response.data
    })
    else return res.status(404).json({
        status: "Error",
        message: `Product with id=${id} not found`,
        data: null
    });
});

router.post("/", async (req, res) => {
    if (!!req.body){
        const product = req.body;
        const response = await service.addProduct(product);
        if (!!response.data){
            return res.status(201).json({
                status: "Success",
                message: `Product created successfully with id=${response.data.id}`,
                data: response.data
            });
        }else if (response.error==-1){ 
            return res.status(400).json({
                status: "Error",
                message: `Error adding product with code ${req.body.code}: Repeated code.`,
                data: null
            });
        }else if (response.error==-2){
            return res.status(400).json({
                status: "Error",
                message: response.message,
                data: null
            });
        }
    } else return res.status(400).json({
        status: "Error",
        message: "No product found to add on body request.",
        data: null
    });
});

router.put("/:pid", async (req, res) => {
    if (!!req.body){
        const id = Number.parseInt(req.params.pid);
        const product = req.body;
        const response = await service.updateProduct(id, product);
        if (!!response.data){
            return res.status(200).json({
                status: "Success",
                message: "Products found",
                data: response.data
            });
        }else if (response == -1) { 
            return res.status(400).json({
            status: "Error",
            message: `The product ${JSON.stringify(product)} does not contain any valid property to update.`,
            data: null
            });
        }else if (response == -2) { 
            return res.status(400).json({
            status: "Error",
            message: `Product with id: ${id} not found.`,
            data: null
            });
        }else if (response == -3) { 
            return res.status(400).json({
            status: "Error",
            message: `The product code is repeated. Please try again with a different product code.`,
            data: null
            });
        }else if (response == -4) {
            return res.status(400).json({
                status: "Error",
                message: `The product id cannot be modified.`,
                data: null
            });
        }else if (response == -5) {
            return res.status(400).json({
                status: "Error",
                message: `The product doesn't allow new properties.`,
                data: null
            });
        }
    } else return res.status(400).json({
        status: "Error",
        message: "No product found to add on body request.",
        data: null
    });
});

router.delete('/:pid', async (req, res) => {
    const id = Number.parseInt(req.params.pid);
    const response = await service.deleteProduct(id);
    if (!!response.data) return res.status(200).json({
        status: "Success",
        message: `Product with id=${response.data.id} was successfully deleted`,
        data: response.data
    })
    else return res.status(404).json({
        status: "Error",
        message: `Product with id=${id} not found`,
        data: response
    });
});

export default router;