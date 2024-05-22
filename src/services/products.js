import { productModel } from "../dao/models/products.js";

export const getProductsService = async ({limit = 10, page = 1, sort, query}) => {
    try{
        page = page == 0 ? 1 : page;
        page = Number(page);
        limit = Number(limit);
        const skip = (page-1) * limit;
        const sortOrderOptions = {'asc': -1, 'desc': 1}
        sort = sortOrderOptions[sort] || null;

        try {
            if(query)
                query = JSON.parse(decodeURIComponent(query))
        } catch (error) {
            console.log('Error al parsear: ', error);
            query = {}
        }

        const queryProducts = productModel.find(query).limit(limit).skip(skip).lean();
        if (sort !== null)
        queryProducts.sort({price:sort});
        const [productos, totalDocs] = await Promise.all([queryProducts, productModel.countDocuments(query)]);

        const totalPages = Math.ceil(totalDocs/limit);
        const hastNextPage = page < totalPages;
        const hastPrePage = page > 1;
        const prevPage = hastPrePage ? page -1 : null;
        const nextPage = hastNextPage ? page +1 : null;
        
        return {
            totalDocs,
            page,
            limit,
            query:JSON.stringify(query),
            totalPages,
            hastPrePage,
            hastNextPage,
            prevPage,
            nextPage,
            payload: productos,
            prevLink: '',
            nextLink: '',
        }
    } catch (error) {
        console.log('getProductsService -> ', error);
        throw error;
    }
}

export const getProductsByIdService = async (pid) => {
    try{
        return await productModel.findById(pid);
    } catch (error) {
        console.log('getProductsByIdService -> ', error);
        throw error;
    }
}

export const addProductService = async ({title, description, price, thumbnails, code, stock, category, status}) => {
    try{
        return await productModel.create({title, description, price, thumbnails, code, stock, category, status});
    } catch (error) {
        console.log('addProductService -> ', error);
        throw error;
    }
}

export const deleteProductsByIdService = async (pid) => {
    try{
        return await productModel.findByIdAndDelete(pid);
    } catch (error) {
        console.log('deleteProductsByIdService -> ', error);
        throw error;
    }
}

export const modificarProductsService = async (pid, rest) => {
    try{
        return await productModel.findByIdAndUpdate(pid,{...rest},{new:true});
    } catch (error) {
        console.log('modificarProductsService -> ', error);
        throw error;
    }
}