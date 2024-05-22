import { request, response } from "express";
import { addProductService, deleteProductsByIdService, getProductsByIdService, getProductsService, modificarProductsService } from "../services/products.js";

export const getProducts = async (req=request, res=response) => {
    try{
        const result = await getProductsService({...req.query});
        return res.json({ result });
    } catch (error) {
        return res.status(500).json({msg:'Hablar con un administrador'});
    }
}

export const getProductsById = async (req=request, res=response) => {
    try{
        const {pid} = req.params;
        const producto = await getProductsByIdService(pid);
        if(!producto)
            return res.status(404).json({msg:`El producto con id ${pid} no existe`});
        return res.json({producto});
    } catch (error) {
        console.log('getProductsById -> ', error);
        return res.status(500).json({msg:'Hablar con un administrador'});
    }
}

export const addProduct = async (req=request, res=response) => {
    try{
        const {title, description, price, code, stock, category} = req.body;
        if (!title, !description, !price, !code, !stock, !category)
            return res.status(404).json({msg:'El campos [title, description, price, code, stock, category] son obligatorios'});
        const producto = await addProductService({...req.body});
        return res.json({producto});
    } catch (error) {
        return res.status(500).json({msg:'Hablar con un administrador'});
    }
}

export const deleteProductsById = async (req=request, res=response) => {
    try{
        const {pid} = req.params;
        const producto = await deleteProductsByIdService(pid);
        if(producto)
            return res.json({msg:'Producto eliminado', producto});
        return res.status(404).json({msg:`No se pudo eliminar el producto con id ${pid}`})
    } catch (error) {
        console.log('addProduct -> ', error);
        return res.status(500).json({msg:'Hablar con un administrador'});
    }
}

export const modificarProducts = async (req=request, res=response) => {
    try{
        const {pid} = req.params;
        const {_id, ...rest} = req.body;
        const producto = await modificarProductsService(pid, rest);
        if(producto)
            return res.json({msg:'Producto actualizado', producto});
        return res.status(404).json({msg:`No se pudo actualizar el producto con id ${pid}`})
    } catch (error) {
        return res.status(500).json({msg:'Hablar con un administrador'});
    }
}
