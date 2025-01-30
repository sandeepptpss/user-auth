const model = require('../model/product');
const Product = model.Product;
// const getSymbolFromCurrency = require('currency-symbol-map')
const path = require('path');
exports.createProduct = async (req, res) => {
    const { title, description, price, category, stock } = req.body;
  // Ensure a file is uploaded
    if (!req.files || !req.files.image) {
        return res.status(400).send('No image file uploaded.');
    }
    const image = req.files.image;
  // Set the upload path
    const uploadPath = path.join(__dirname, '..', 'uploads', 'images', image.name);
  // Move the uploaded file to the desired location
    image.mv(uploadPath, async (err) => {
    if(err){
      return res.status(500).send(err);
      }
    const exitsTitle = await Product.findOne({title});
    if(exitsTitle){
      return res.status(409).send({code:409 , message:'Title Already Use'})
  }

// Create the new product with the file path
     const newProduct = new Product({
            title,
            description,
            price,
            category,
            stock,
            image: uploadPath,
      });
// Save the product to the database
    const success = await newProduct.save();
      if(success) {
            return res.send({
                code: 200,
                message: 'Product Data Inserted Successfully',
            });
          }else{
            return res.send({
                code: 404,
                message: 'Service error',
            });
        }
    });
};
// Get All products data
exports.showProduct = async(req, res)=>{
const showAllProduct = await Product.find();
try {
  return res.status(200).send({ message:200, showAllProduct});
} catch (error){
return res.send({ code: 404, message: 'Service error'})
}
}
// Get specific product data
exports.getProduct = async(req, res)=>{
try {
  const { id } = req.params;
  const getProduct = await Product.findById(id);
  if (!getProduct) {
    return res.status(404).json({ message: `No product found with ID ${id}` });
  }
 return res.status(200).json(getProduct);
} catch (error) {
  return res.status(500).json({ message: "Server error", error: error.message });
}
}
// Delete product function
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      return res.status(200).json({
        code: 200,
        message: 'Product deleted',
        product: deletedProduct
      });
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

 try {
    const updateProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updateProduct) {
      return res.status(404).json({ message: `No product found with ID ${id}` });
    }
    return res.status(200).json({ message: 'Product updated successfully', product: updateProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}