import { database } from "../di/index.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ProductMapper } from "../repository/Mapper/mapper.js";

export class Product {
    #product;
    constructor(productSchema, dto) {
      this.#product = ProductMapper.mapToSchema(productSchema, dto);
    }
    async insertProductToDatabase(productId) {
        try{
            if(productId){
                this.#product._id = new ObjectId(productId);
            }
            await this.#product.save();
            console.log("Product created");
            this._id = this.#product._id;
            this.title = this.#product.title;
            this.price = this.#product.price;
            this.description = this.#product.description;
            this.categories = this.#product.categories;
            this.avatar = this.#product.avatar;
        }catch (error) {
            throw error;
        }
    }
    
    static async getAllProducts() {
        const productRecords = await database.getRecordsByQuery({}, "products");
        return productRecords;
    }

    // static async getAllProductsLatest() { //use to display on the landing page
    //     const productRecords = await database.getRecordsByQuery({}, "products");
    //     const reversedProductRecords = productRecords.reverse();
    //     return reversedProductRecords;
    //   }
}