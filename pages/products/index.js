import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer_components';
import Contacts from '../../components/contacts_components';
import { useRouter } from 'next/router';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null); // Trạng thái lưu sản phẩm được chọn
  const [selectedImage, setSelectedImage] = useState({}); // Trạng thái lưu ảnh được chọn theo sản phẩm
  const router = useRouter();
    const [language, setLanguage] = useState('vi'); // Ngôn ngữ mặc định là tiếng Việt
  
      // Hàm thay đổi ngôn ngữ
      useEffect(() => {
        if (router.query.language) {
          setLanguage(router.query.language);
        }
      }, [router.query.language]);
      const handleLanguageChange = (lang) => {
        setLanguage(lang);
        router.push({
          pathname: router.pathname,
          query: { ...router.query, language: lang },
        });
      };
      const titles = {
        vi: 'Danh sách sản phẩm',
        en: 'List Products',
    };
  useEffect(() => {
    axios.get('/api/products').then((res) => {
      setProducts(res.data.data);

      // Đặt ảnh đầu tiên làm mặc định cho mỗi sản phẩm
      const initialSelectedImages = {};
      res.data.data.forEach((product) => {
        if (product.images.length > 0) {
          initialSelectedImages[product.id] = product.images[0];
        }
      });
      setSelectedImage(initialSelectedImages);
    });
  }, []);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId === selectedProductId ? null : productId); // Toggle hiển thị chi tiết
  };

  const handleImageClick = (productId, image) => {
    setSelectedImage((prevState) => ({
      ...prevState,
      [productId]: image, // Cập nhật ảnh được chọn cho sản phẩm cụ thể
    }));
  };

  return (
    <div className="w-full p-4">
      <Header 
       language={language}
       onLanguageChange={handleLanguageChange}
      />
      <h1 className="text-3xl font-bold mb-4">{titles[language]}</h1>
      <div
  className={`grid ${
    selectedProductId ? 'grid-cols-1' : 'grid-cols-2'
  } gap-4`}
>
  {products.map((product) => (
    <div
      key={product.id}
      className={`p-4 border rounded relative ${
        selectedProductId && selectedProductId !== product.id
          ? 'hidden'
          : selectedProductId === product.id
          ? 'w-full'
          : ''
      }`}
    >
      {/* Nút Chi tiết/Đóng */}
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
        onClick={() => handleProductClick(product.id)}
      >
     { language === 'vi' 
  ? (selectedProductId === product.id ? 'Đóng' : 'Chi tiết') 
  : (selectedProductId === product.id ? 'Close' : 'More')}

      </button>

      {/* Nội dung sản phẩm */}
      <div className="flex items-start space-x-4">
        {/* Ảnh lớn */}
        <div className="mt-4">
          {product.images.length > 0 ? (
            <img
              src={selectedImage[product.id]} // Hiển thị ảnh được chọn hoặc ảnh đầu tiên
              alt="Ảnh lớn"
              className="w-48 h-48 object-cover mx-0 rounded"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border border-gray-300 rounded bg-gray-100 text-gray-500">
             {language === 'vi'? 'Chưa có ảnh' : 'No image'}
            </div>
          )}
          {/* Danh sách ảnh nhỏ */}
          {product.images.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Hình ảnh ${index + 1}`}
                  className={`w-16 h-16 object-cover cursor-pointer ${
                    selectedImage[product.id] === image
                      ? 'border-2 border-blue-500'
                      : ''
                  }`}
                  onClick={() => handleImageClick(product.id, image)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h2 className="text-xl font-bold">{language === 'vi' ? product.name : product.en_name}</h2>
          <p>{language === 'vi' ? product.description : product.en_description}</p>
          <p className="text-green-500">{product.price} VND</p>
        </div>
      </div>

      {/* Hiển thị chi tiết sản phẩm nếu được chọn */}
      {selectedProductId === product.id && (
        <>
          <h3 className="text-lg font-bold mt-4">{language === 'vi' ? 'Chi tiết sản phẩm' : 'Product details'}</h3>
          {product.productDetails.map((detail, index) => (
            <div key={index} className="mt-2">
              <h4 className="text-md font-semibold">{language === 'vi' ? detail.title : detail.en_title}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: language === 'vi' 
                    ? detail.description 
                    : detail.en_description,
                }}
              ></p>
              {/* Kiểm tra nếu mảng imageUrl không rỗng thì hiển thị danh sách ảnh */}
              {detail.imageUrl.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {detail.imageUrl.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={image}
                      alt={`Chi tiết ${index + 1} - Ảnh ${imgIndex + 1}`}
                      className="w-full h-auto rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  ))}
</div>
      <Footer language={language}/>
      <Contacts language={language}/>
    </div>
  );
}