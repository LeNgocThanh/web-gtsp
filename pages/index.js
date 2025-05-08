import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer_components';
import Contacts from '../components/contacts_components';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() { 
  const router = useRouter();
  const [newsList, setNewsList] = useState([]); 
  const [language, setLanguage] = useState('vi'); // Ngôn ngữ mặc định là tiếng Việt
  const titles = {
    vi: 'Chào mừng bạn đến với trang chính!',
    en: 'Welcome to the homepage!',
};
    // Hàm thay đổi ngôn ngữ
    useEffect(() => {
      if (router.query.language) {
        setLanguage(router.query.language);
      }
    }, [router.query.language]);
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
  
    // Hàm thay đổi ngôn ngữ và cập nhật URL
    const handleLanguageChange = (lang) => {
      setLanguage(lang);
      router.push({
        pathname: router.pathname,
        query: { ...router.query, language: lang },
      });
    };
  return (
    <div>
    <Header 
    language={language}
    onLanguageChange={handleLanguageChange}/>
     <main className="w-full flex flex-col items-center justify-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">
          {titles[language]}
        </h1>
        {newsList.map((news, index) => (
          <section
            key={index}
            className={`w-full max-w-7xl flex flex-col md:flex-row items-center mb-8 ${
              index % 2 === 0 ? "" : "md:flex-row-reverse"
            }`}
          >
            <div className="md:w-1/2 p-4">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white text-center md:text-left">
                {language === 'vi' ? news.title : news.en_title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center md:text-left">
                {language === 'vi' ? news.details : news.en_details}
              </p>
            </div>
            {news.imagesUrl && (
              <div className="md:w-1/2 mt-4 md:mt-0 p-4">
                <img
                  src={news.imagesUrl}
                  alt={news.imageAlt || 'Image'}
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            )}
          </section>
        ))}
      </main>
    <Footer language={language}/>
    <Contacts language={language}/>
  </div>
  );
}