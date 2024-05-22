import {Schema, model} from 'mongoose';

const nameCollection = 'Producto';

const ProductoSchema = new Schema({
    title:{type:String, required:[true, 'El titulo del producto es obligatorio']},
    description:{type:String, required:[true, 'El descripcion del producto es obligatorio']},
    price:{type:Number, required:[true, 'El precio del producto es obligatorio']},
    thumbnails:[{type:String}],
    code:{type:String, required:[true, 'El codigo del producto es obligatorio'], unique:true},
    stock:{type:Number, required:[true, 'El stock del producto es obligatorio']},
    category:{type:String, required:[true, 'La categoria del producto es obligatorio']},
    status:{type:Boolean, default:true},
});

ProductoSchema.set('toJSON', {
    transform: function(doc,ret){
        delete ret.__v;
        return ret;
    }
});

export const productModel = model(nameCollection, ProductoSchema);