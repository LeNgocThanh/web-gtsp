import axios from 'axios';
import { useState, useEffect } from 'react';
import Header_admin from '../../components/header_admin';

export default function AdminProducts() {
  const [name, setName] = useState('');
  const [en_name, setEnName] = useState('');
  const [en_description, setEnDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Trạng thái lưu sản phẩm đang chỉnh sửa

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data.data);
  };

  const handleImageSelection = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  const addProductDetail = () => {
    setProductDetails([...productDetails, { title: '', en_title: '', description: '', en_description: '', imageFiles: [], imageUrl: [] }]);
  };

  const updateProductDetail = (index, field, value) => {
    const updatedDetails = [...productDetails];
    updatedDetails[index][field] = value;
    setProductDetails(updatedDetails);
  };

  const handleDetailImageSelection = (index, files) => {
    const updatedDetails = [...productDetails];
    updatedDetails[index].imageFiles = Array.from(files);
    setProductDetails(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload ảnh sản phẩm trước
    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    const uploadRes = await axios.post('/api/uploads?folder=products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const uploadedImagePaths = uploadRes.data.filePaths;

    // Upload ảnh của productDetails
    for (let i = 0; i < productDetails.length; i++) {
      const detailFormData = new FormData();
      productDetails[i].imageFiles.forEach((file) => detailFormData.append('images', file));

      const detailUploadRes = await axios.post('/api/uploads?folder=products/details', detailFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      productDetails[i].imageUrl = detailUploadRes.data.filePaths;
    }

    // Nếu đang chỉnh sửa, gọi API update
    if (editingProductId) {
      await axios.put(`/api/products?id=${editingProductId}`, {
        name,
        en_name,
        description,
        en_description,
        price,
        images: uploadedImagePaths,
        productDetails,
      });
      alert('Sản phẩm đã được cập nhật!');
    } else {
      // Nếu không, thêm sản phẩm mới
      await axios.post('/api/products', {
        name,
        en_name,
        description,
        en_description,
        price,
        images: uploadedImagePaths,
        productDetails,
      });
      alert('Sản phẩm đã được thêm!');
    }

    // Reset form và tải lại danh sách sản phẩm
    setName('');
    setEnName('');
    setDescription('');
    setEnDescription('');
    setPrice('');
    setImages([]);
    setProductDetails([]);
    setEditingProductId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setEnName(product.en_name);
    setDescription(product.description);
    setEnDescription(product.en_description);
    setPrice(product.price);
    setImages([]); // Không cần ảnh cũ
    setProductDetails(product.productDetails);
  };

  const handleDelete = async (productId) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await axios.delete(`/api/products?id=${productId}`);
      alert('Sản phẩm đã được xóa!');
      fetchProducts();
    }
  };

  const handleDeleteProductDetail = (index) => {
    if (confirm('Bạn có chắc chắn muốn xóa chi tiết này?')) {
      const updatedDetails = [...productDetails];
      updatedDetails.splice(index, 1); // Xóa phần tử tại vị trí index
      setProductDetails(updatedDetails); // Cập nhật lại state
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Header_admin />
      <h1 className="text-3xl font-bold mb-4">Quản lý sản phẩm</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />   
        <input
          type="text"
          placeholder="Tên sản phẩm bằng tiếng Anh"
          value={en_name}
          onChange={(e) => setEnName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Mô tả sản phẩm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
          <textarea
          placeholder="Mô tả sản phẩm bằng tiếng Anh"
          value={en_description}
          onChange={(e) => setEnDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Giá sản phẩm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          multiple
          onChange={handleImageSelection}
          className="w-full p-2 border rounded"
        />

        <h3 className="text-xl font-bold mt-4">Chi tiết sản phẩm</h3>
        {productDetails.map((detail, index) => (
  <div key={index} className="space-y-2 border p-4 rounded mb-4">
    <input
      type="text"
      placeholder="Tiêu đề"
      value={detail.title}
      onChange={(e) => updateProductDetail(index, 'title', e.target.value)}
      className="w-full p-2 border rounded"
    />
    <input
      type="text"
      placeholder="Tiêu đề bằng tiếng Anh"
      value={detail.en_title}     
      onChange={(e) => updateProductDetail(index, 'en_title', e.target.value)}
      className="w-full p-2 border rounded"
    />
    <textarea
      placeholder="Mô tả (hỗ trợ HTML)"
      value={detail.description}
      onChange={(e) => updateProductDetail(index, 'description', e.target.value)}
      className="w-full p-2 border rounded"
    />
<textarea
      placeholder="Mô tả bằng tiếng Anh (hỗ trợ HTML)"
      value={detail.en_description}
      onChange={(e) => updateProductDetail(index, 'en_description', e.target.value)}
      className="w-full p-2 border rounded"
    />

    <input
      type="file"
      multiple
      onChange={(e) => handleDetailImageSelection(index, e.target.files)}
      className="w-full p-2 border rounded"
    />
    <div className="flex space-x-2 mt-2">
      {detail.imageUrl.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Chi tiết ${index + 1} - Hình ảnh ${i + 1}`}
          className="w-16 h-16 object-cover"
        />
      ))}
    </div>
    <button
      type="button"
      onClick={() => handleDeleteProductDetail(index)}
      className="p-2 bg-red-500 text-white rounded"
    >
      Xóa chi tiết
    </button>
  </div>
))}
        <button
          type="button"
          onClick={addProductDetail}
          className="p-2 bg-green-500 text-white rounded"
        >
          Thêm chi tiết sản phẩm
        </button>

        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {editingProductId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Danh sách sản phẩm</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-4 p-4 border rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <h3 className="text-xl font-bold">{product.en_name}</h3>
            <p>{product.description}</p>
            <p>{product.en_description}</p>
            <p className="text-green-500">{product.price} VND</p>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Hình ảnh ${index + 1}`}
                  className="w-16 h-16 object-cover"
                />
              ))}
            </div>
            <h4 className="text-lg font-bold mt-4">Chi tiết sản phẩm</h4>
            {product.productDetails.map((detail, detailIndex) => (
              <div key={detailIndex} className="mt-2">
                <h5 className="text-md font-semibold">{detail.title}</h5>
                <h5 className="text-md font-semibold">{detail.en_title}</h5>
                <div dangerouslySetInnerHTML={{ __html: detail.description }}></div>
                <div dangerouslySetInnerHTML={{ __html: detail.en_description }}></div>
                <div className="flex space-x-2 mt-2">
                  {detail.imageUrl.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Chi tiết ${detailIndex + 1} - Hình ảnh ${i + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 bg-yellow-500 text-white rounded"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}