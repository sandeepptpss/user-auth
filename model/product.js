const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    title: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    min: 0
  },
  category: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max:1000
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
exports.Product = mongoose.model('Product' ,productSchema);
