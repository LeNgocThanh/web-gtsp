import React, { useState, useEffect } from 'react';
import Header_admin from '../../components/header_admin';

const AdminHome = () => {
    const [newsList, setNewsList] = useState([]);
    const [newNews, setNewNews] = useState({
        title: '',
        en_title: '',
        details: '',
        en_details: '',
        imagesUrl: [],
        videoUrl: '',
    });
    const [editingNews, setEditingNews] = useState(null); // Tin tức đang được chỉnh sửa

    // Lấy danh sách tin tức
    useEffect(() => {
        fetch('/api/home')
            .then((res) => res.json())
            .then((data) => {
                // Sắp xếp danh sách tin tức theo createTime từ gần nhất đến xa nhất
                const sortedData = data.sort((a, b) => {
                    const dateA = new Date(a.createTime || '2000-01-01').getTime();
                    const dateB = new Date(b.createTime || '2000-01-01').getTime();
                    return dateB - dateA; // Sắp xếp giảm dần
                });
                setNewsList(sortedData);
            })
            .catch((err) => console.error(err));
    }, []);

    // Xử lý thêm tin tức mới
    const handleAddNews = async () => {
        if (!newNews.title || !newNews.details) {
            alert('Vui lòng nhập đầy đủ tiêu đề và nội dung chi tiết!');
            return;
        }
    
        try {
            let imagesUrl = [];
    
            // Nếu có ảnh, upload chúng trước
            if (newNews.imagesUrl.length > 0) {
                const formData = new FormData();
                Array.from(newNews.imagesUrl).forEach((file) => {
                    formData.append('images', file);
                });
    
                const uploadResponse = await fetch('/api/uploads?folder=home', {
                    method: 'POST',
                    body: formData,
                });
    
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    imagesUrl = uploadResult.filePaths; // Lấy đường dẫn ảnh đã upload
                } else {
                    alert('Lỗi khi upload ảnh!');
                    return;
                }
            }         
    
            // Gửi thông tin tin tức đến API
            const response = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newNews.title,
                    en_title: newNews.en_title,
                    details: newNews.details,
                    en_details: newNews.en_details,
                    imagesUrl, // Đường dẫn ảnh đã upload
                    videoUrl: newNews.videoUrl || '',
                }),
            });             
                if (response.ok) {
                const addedNews = await response.json();
                setNewsList((prev) => [...prev, addedNews]);
                setNewNews({ title: '', en_title : '', details: '', en_details: '', imagesUrl: [], videoUrl: '' });
            } else {
                alert('Lỗi khi thêm tin tức!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi thêm tin tức!');
        }
    };

    // Xử lý chỉnh sửa tin tức
    const handleEditNews = async () => {
        if (!editingNews.title || !editingNews.details) {
            alert('Vui lòng nhập đầy đủ tiêu đề và nội dung chi tiết!');
            return;
        }
    
        try {
            let imagesUrl = editingNews.imagesUrl.filter((file) => typeof file === 'string'); // Giữ lại các URL cũ
    
            // Nếu có ảnh mới, upload chúng
            const newFiles = editingNews.imagesUrl.filter((file) => file instanceof File);
            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach((file) => {
                    formData.append('images', file);
                });
    
                const uploadResponse = await fetch('/api/uploads?folder=home', {
                    method: 'POST',
                    body: formData,
                });
    
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    imagesUrl = [...imagesUrl, ...uploadResult.filePaths]; // Kết hợp URL cũ và mới
                } else {
                    alert('Lỗi khi upload ảnh!');
                    return;
                }
            }
            console.log('abc',imagesUrl);
    
            // Gửi thông tin cập nhật đến API
            const response = await fetch('/api/home', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: editingNews._id,
                    title: editingNews.title,
                    en_title: editingNews.en_title,
                    details: editingNews.details,
                    en_details: editingNews.en_details,
                    imagesUrl,
                    videoUrl: editingNews.videoUrl || '',
                }),
            });
    
            if (response.ok) {
                const updatedNews = await response.json();
                setNewsList((prev) =>
                    prev.map((news) => (news._id === updatedNews._id ? updatedNews : news))
                );
                setEditingNews(null);
            } else {
                alert('Lỗi khi chỉnh sửa tin tức!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi chỉnh sửa tin tức!');
        }
    };

    const handleDeleteNews = async (id) => {
        try {
            const newsToDelete = newsList.find((news) => news._id === id);

            // Gọi API xóa ảnh
            if (newsToDelete && newsToDelete.imagesUrl.length > 0) {
                await fetch('/api/uploads', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filePaths: newsToDelete.imagesUrl }),
                });
            }

            // Gọi API xóa tin tức
            const response = await fetch(`/api/home?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setNewsList((prev) => prev.filter((news) => news._id !== id));
                alert('Xóa tin tức thành công!');
            } else {
                alert('Lỗi khi xóa tin tức!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi xóa tin tức!');
        }
    };

    return (
        <div className="p-4">
            <Header_admin /> 
            <h1 className="text-2xl font-bold mb-4">Quản lý Tin tức</h1>

            {/* Form thêm hoặc chỉnh sửa tin tức */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    {editingNews ? 'Chỉnh sửa Tin tức' : 'Thêm Tin tức mới'}
                </h2>
                <input
                    type="text"
                    placeholder="Tiêu đề"
                    value={editingNews ? editingNews.title : newNews.title}
                    onChange={(e) =>
                        editingNews
                            ? setEditingNews({ ...editingNews, title: e.target.value })
                            : setNewNews({ ...newNews, title: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                />
 <input
                    type="text"
                    placeholder="Tiêu đề tiếng Anh"
                    value={editingNews ? editingNews.en_title : newNews.en_title}                  
                    onChange={(e) =>
                        editingNews
                            ? setEditingNews({ ...editingNews, en_title: e.target.value })
                            : setNewNews({ ...newNews, en_title: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                />

                <textarea
                    placeholder="Nội dung chi tiết"
                    value={editingNews ? editingNews.details : newNews.details}
                    onChange={(e) =>
                        editingNews
                            ? setEditingNews({ ...editingNews, details: e.target.value })
                            : setNewNews({ ...newNews, details: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                    rows="6"
                />
                <textarea
                    placeholder="Nội dung chi tiết tiếng Anh"
                    value={editingNews ? editingNews.en_details : newNews.en_details}                   
                    onChange={(e) =>
                        editingNews
                            ? setEditingNews({ ...editingNews, en_details: e.target.value })
                            : setNewNews({ ...newNews, en_details: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                    rows="6"
                />

                <input
                    type="file"
                    multiple
                    onChange={(e) =>
                        editingNews
                            ? setEditingNews({ ...editingNews, imagesUrl: e.target.files })
                            : setNewNews({ ...newNews, imagesUrl: e.target.files })
                    }
                    className="block w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="URL Video"
                    value={editingNews ? editingNews.videoUrl : newNews.videoUrl}
                    onChange={(e) =>
                        editingNews
                            ? setEditingNews({ ...editingNews, videoUrl: e.target.value })
                            : setNewNews({ ...newNews, videoUrl: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                />
                <button
                    onClick={editingNews ? handleEditNews : handleAddNews}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {editingNews ? 'Lưu chỉnh sửa' : 'Thêm Tin tức'}
                </button>
                {editingNews && (
                    <button
                        onClick={() => setEditingNews(null)}
                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                )}
            </div>

            {/* Danh sách tin tức */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Danh sách Tin tức</h2>
                <ul>
                    {newsList.map((news) => (
                        <li key={news._id} className="mb-4 p-4 border rounded">
                            <h3 className="text-lg font-bold">{news.title}</h3>
                            <h3 className="text-lg font-bold">{news.en_title}</h3>
                            <p className="whitespace-pre-line text-gray-700">{news.details}</p>
                            <p className="whitespace-pre-line text-gray-700">{news.en_details}</p>
                            {news.imagesUrl && news.imagesUrl.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {news.imagesUrl.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            className="w-16 h-16 object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                            {news.videoUrl && (
                                <a
                                    href={news.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline mt-2 block"
                                >
                                    Xem video
                                </a>
                            )}
                            <div className="mt-2">
                                <button
                                    onClick={() => setEditingNews(news)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeleteNews(news._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminHome;