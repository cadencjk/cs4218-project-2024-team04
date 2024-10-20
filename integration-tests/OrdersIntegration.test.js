import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../server.js';
import users from "../test-db-utils/sample-data/sampleUsers.js";
import orders from "../test-db-utils/sample-data/sampleOrders.js";
import products from "../test-db-utils/sample-data/sampleProducts.js";
import categories from "../test-db-utils/sample-data/sampleCategories.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import JWT from "jsonwebtoken";

let jwtToken;

beforeEach(async () => {
    // Clear the database and populate it with sample users and orders
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('orders').deleteMany({});
    await mongoose.connection.db.collection('products').deleteMany({});
    await mongoose.connection.db.collection('categories').deleteMany({});

    const category = await Category.create(categories[0]);
    const user = await User.create(users[0]);
    const product = await Product.create({...products[0], category: category._id});
    await Order.create({...orders[0], buyer: user._id, products: [product._id]});
    jwtToken = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
});

describe('Orders API Test', () => {
    it('should get individual user orders successfully via API', async () => {
        const response = await supertest(app)
            .get('/api/v1/auth/orders')
            .set('Authorization', jwtToken)
            .expect(200);
        console.log(response.body);
        expect(response.body).toHaveLength(1);
    });
});