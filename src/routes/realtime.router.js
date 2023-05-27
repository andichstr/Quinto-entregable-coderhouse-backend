import { Router } from "express";
import { ProductManager } from "../services/ProductManager.js";

const router = Router();
const service = new ProductManager();

await service.customConstructor();

router.get('/', async (req, res) => {
    let products = await service.getProducts();
    if (!!products){
        if (!!req.query.limit && req.query.limit >= 0 && products.length > req.query.limit) products = products.slice(0, req.query.limit);
        return res.status(200).render("realTimeProducts",{ products });
    }
    else return res.status(404).json({
            status: "Error",
            message: "Products not found",
            data: null
    })
    
})

export default router;