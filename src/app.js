import express from "express";
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import path from 'path';
import session from "express-session"; 
import MongoStore from "connect-mongo";
import passport from "passport";
import 'dotenv/config';

import products from './routers/products.js';
import carts from './routers/carts.js';
import views from './routers/views.js';
import { dirname } from './utils.js'; 
import { dbConnection } from "./database/config.js";
import { messageModel } from "./dao/models/messages.js";
import { addProductService, getProductsService } from "./services/products.js";
import { initializaPassport } from "./config/passport.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(dirname, 'public'))); 

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://tomasrepetto:tomas2315@codercluster.qtz5cyl.mongodb.net/ecommerce`,
        ttl: 3600
    }),
    secret: "tomas22",
    resave: true,
    saveUninitialized: false
}));

initializaPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine());
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', views);
app.use('/api/products', products);
app.use('/api/carts', carts);

await dbConnection();

const expressServer = app.listen(PORT, () => {console.log(`Corriendo aplicación en el puerto ${PORT}`);});
const io = new Server(expressServer);

io.on('connection', async(socket) => {
    const {payload} = await getProductsService({});
    const productos = payload;
    socket.emit('productos', payload);
    socket.on('agregarProducto', async(producto) => {
        const newProduct = await addProductService({...producto});
        if(newProduct){
            productos.push(newProduct)
            socket.emit('productos', producto);
        }
    });

    const messages = await messageModel.find();
    socket.emit('message', messages);

    socket.on('message', async(data) => {
        const newMessage = await messageModel.create({...data});
        if (newMessage){
            const messages = await messageModel.find();
            io.emit('messageLogs', messages);
        }
    });

    socket.broadcast.emit('nuevo_user');
});


