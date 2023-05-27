import { Router } from "express";
import { ProductManager } from "../services/ProductManager.js";
import path from 'path';

const router = Router();
const service = new ProductManager();

await service.customConstructor(path.resolve() + "\\src\\db\\products.json");

router.get('/', async (req, res) => {
    let products = await service.getProducts();
    if (!!products){
        if (!!req.query.limit && req.query.limit >= 0 && products.length > req.query.limit) products = products.slice(0, req.query.limit);
        return res.status(200).render("home", { products });
    }else return res.status(404).json({
            status: "Error",
            message: "Products not found",
            data: null
    })

})

export default router;