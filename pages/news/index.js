import React, { useState, useEffect } from 'react';
import Headers from '../../components/header';
import Footer from '../../components/footer_components';
import Contacts from '../../components/contacts_components';
import { useRouter } from 'next/router';

const NewsPage = () => {
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null); 
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
            vi: 'Tin tức',
            en: 'List News',
        };

    // Lấy danh sách tin tức từ API
    useEffect(() => {
        fetch('/api/news')
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

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Headers 
            language={language}
            onLanguageChange={handleLanguageChange}
            />
            <main className="w-full flex flex-col items-center justify-center p-4 bg-gray-100">
            <h1 className="text-6xl font-bold text-center mb-6">{titles[language]}</h1>

            {/* Danh sách tiêu đề tin tức */}
            <ul className="space-y-4">
    {newsList.map((news) => (
        <li key={news._id}>
            <button
                onClick={() => setSelectedNews(news)}
                className={`text-2xl underline ${
                    selectedNews?._id === news._id
                        ? 'text-blue-700 font-bold' // Màu đậm hơn khi được chọn
                        : 'text-blue-500 hover:text-blue-700' // Màu mặc định và khi hover
                }`}
            >
                {language === 'vi'? news.title : news.en_title}
            </button>
            {/* Hiển thị createTime dưới tiêu đề */}
            <p className="text-sm text-gray-500 mt-1">
                {new Date(news.createTime || '2000-01-01').toLocaleString()}
            </p>
        </li>
    ))}
</ul>

            {/* Hiển thị chi tiết tin tức */}
            {selectedNews && (
                <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-bold mb-4">{language==='vi'? selectedNews.title : selectedNews.en_title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                {new Date(selectedNews.createTime || '2000-01-01').toLocaleString()}
            </p>
                    <p className="whitespace-pre-line text-gray-700 mb-4">{language==='vi'? selectedNews.details : selectedNews.en_details}</p>

                    {/* Hiển thị danh sách ảnh */}
                    {Array.isArray(selectedNews.imagesUrl) && selectedNews.imagesUrl.length > 0 && (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                            style={{ marginLeft: '10%' }}
                        >
                            {selectedNews.imagesUrl.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-auto object-cover rounded shadow-md"
                                />
                            ))}
                        </div>
                    )}

                    {/* Hiển thị video nếu có */}
                    {selectedNews.videoUrl && (
                        <div className="mt-4">
                            {selectedNews.videoUrl.includes('facebook.com') ? (
                                <iframe
                                    src={'https://www.facebook.com/plugins/video.php?href='+selectedNews.videoUrl}
                                    width="560"
                                    height="315"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="rounded"
                                ></iframe>
                            ) : (
                                <a
                                    href={selectedNews.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                   {language === 'vi' ? 'Xem video' : 'Watch video'}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Nút quay lại */}
                    <button
                        onClick={() => setSelectedNews(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
                    >
                       {language === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
                    </button>
                </div>
            )}
            </main>
            <Footer language={language}/>
            <Contacts language={language}/>
        </div>
    );
};

export default NewsPage;