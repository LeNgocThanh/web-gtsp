import { productsDb } from '@/utils/db'; // Đảm bảo bạn đã khai báo đúng đường dẫn đến database
import { v4 as uuidv4 } from 'uuid'; // Thư viện để tạo UUID

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // Lấy id từ query nếu có

  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Lấy sản phẩm theo ID
          productsDb.findOne({ id }, (err, doc) => {
            if (err) {
              console.error('Error fetching product by ID:', err);
              return res.status(500).json({ success: false, error: 'Failed to fetch product' });
            }
            if (!doc) {
              return res.status(404).json({ success: false, error: 'Product not found' });
            }
            return res.status(200).json({ success: true, data: doc });
          });
        } else {
          // Lấy danh sách sản phẩm
          productsDb.find({}, (err, docs) => {
            if (err) {
              console.error('Error fetching products:', err);
              return res.status(500).json({ success: false, error: 'Failed to fetch products' });
            }
            return res.status(200).json({ success: true, data: docs });
          });
        }
        break;

      case 'POST':
        // Tạo sản phẩm mới
        const product = {
          ...req.body,
          id: uuidv4(), // Thêm trường id tự động
          productDetails: req.body.productDetails || [], // Mặc định là mảng rỗng nếu không có
        };
        productsDb.insert(product, (err, newDoc) => {
          if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ success: false, error: 'Failed to insert product' });
          }
          res.status(201).json({ success: true, data: newDoc });
        });
        break;

      case 'PUT':
        // Cập nhật sản phẩm dựa trên id từ query hoặc body
        const updateId = id || req.body.id; // Lấy id từ query hoặc body
        const updateData = req.body; // Dữ liệu cập nhật từ body

        if (!updateId) {
          return res.status(400).json({ success: false, error: 'ID is required for update' });
        }

        productsDb.update({ id: updateId }, { $set: updateData }, {}, (err, numReplaced) => {
          if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ success: false, error: 'Failed to update product' });
          }
          if (numReplaced === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
          }
          res.status(200).json({ success: true, message: 'Product updated successfully' });
        });
        break;

      case 'DELETE':
        // Xóa sản phẩm dựa trên id từ query hoặc body
        const deleteId = id || req.body.id; // Lấy id từ query hoặc body

        if (!deleteId) {
          return res.status(400).json({ success: false, error: 'ID is required for delete' });
        }

        productsDb.remove({ id: deleteId }, {}, (err, numRemoved) => {
          if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ success: false, error: 'Failed to delete product' });
          }
          if (numRemoved === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
          }
          res.status(200).json({ success: true, message: 'Product deleted successfully' });
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}