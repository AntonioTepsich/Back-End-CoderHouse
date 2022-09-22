const path = require('path');
const express = require('express');
const Contenedor = require("./src/contenedor");
const contenedor = new Contenedor("productos.json");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

const router = express.Router();

app.use('/api/productos',router);

//GET
router.get('/',async(req,res)=>{
    const products=await contenedor.getAll();
    res.status(200).json(products);
})

//GET 2
router.get('/:id',async(req,res)=>{
    const {id}=req.params;
    const product=await contenedor.getById(id);

    product ? res.status(200).json(product) : res.status(404).json(product);
})

//POST
router.post('/',async(req,res)=>{
    const {body} = req;
    const newProductId = await contenedor.save(body);
    res.status(200).send(`Producto agregado con el ID: ${newProductId}`);
})

//PUT
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const subido = await contenedor.updateById(id,body);
    subido ? res.status(200).send(`El producto de ID: ${id} fue actualizado`) : res.status(404).send(`El producto no fue actualizado porque no se encontró el ID: ${id}`);
})

//DELETE
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const borrado = await contenedor.deleteById(id);
    borrado ? res.status(200).send(`El producto de ID: ${id} fue borrado`) : res.status(404).send(`El producto no fue borrado porque no se encontró el ID: ${id}`);
})





const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`>>>> Server started at http://localhost:${PORT}`);
})

server.on('error', (error) => console.log(error));