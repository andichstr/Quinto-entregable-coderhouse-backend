//@ts-check
import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import homeRouter from './routes/home.router.js';
import realtimeRouter from './routes/realtime.router.js';
import { ProductManager } from './services/ProductManager.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port = 8080;

const service = new ProductManager();
service.customConstructor();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '\\views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '\\public'));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/home", homeRouter);
app.use("/realtimeproducts", realtimeRouter);

io.on('connection', (socket) => {
  socket.on('add_product', async (newProduct) => {
    try {
      const addedProduct = await service.addProduct(newProduct);
      io.emit("new_item", addedProduct.data);
    } catch (err){
      console.log(err);
    }
  });
})

app.get('*', (req, res) => {
  res.json({"error": "Page not found."});
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});