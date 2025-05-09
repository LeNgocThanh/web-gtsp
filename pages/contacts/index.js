import Link from 'next/link';
import Header from '../../components/header';
import Footer from '../../components/footer_components';
import Contacts from '../../components/contacts_components';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const sections = [
  {
    title: {
      vi: 'Công ty CP Giống Cây Trồng và Dược Liệu IVP',
      en: 'IVP - Seeds and Medicinal Materials Joint Stock Company',
    },
    content: {
      vi: 'Địa chỉ: Liền kề F14, KĐT An Viên, Phường Vĩnh Nguyên, Thành phố Nha Trang, Tỉnh Khánh Hòa, Việt Nam.',
      en: 'Address: Liền kề F14, KĐT An Viên, Phường Vĩnh Nguyên, Thành phố Nha Trang, Tỉnh Khánh Hòa, Việt Nam.',
    },
    imageUrl: '/images/index/dattrong.jpg',
    imageAlt: 'Công ty CP Giống Cây Trồng và Dược Liệu IVP',
  },
  {
    title: {
      vi: 'Phòng LAB nuôi cấy mô hiện đại',
      en: 'Modern Tissue Culture Lab',
    },
    content: {
      vi: 'Địa chỉ: Xã Nam Giang, huyện Thọ Xuân, tỉnh Thanh Hoá, Việt Nam.',
      en: 'Address: Xã Nam Giang, huyện Thọ Xuân, tỉnh Thanh Hoá, Việt Nam.',
    },
    imageUrl: '/images/index/491043297_122113722284828960_9167720821076332758_n.jpg',
    imageAlt: 'Phòng LAB nuôi cấy mô hiện đại',
  },
  {
    title: {
      vi: 'Hotline/Whatapps/Zalo',
      en: 'Hotline/WhatsApp/Zalo',
    },
    content: {
      vi: '+84837495888',
      en: '+84837495888',
    },
  },
];

export default function Homes() { 
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
  return (
    <div>
    <Header 
    language={language}
    onLanguageChange={handleLanguageChange}
    />
   <main className="w-full flex flex-col items-center justify-center p-4 bg-gray-100">
  {sections.map((section, index) => (
    <section
      key={index}
      className={`w-full max-w-7xl flex flex-col md:flex-row items-center mb-8 ${
        index % 2 === 0 ? '' : 'md:flex-row-reverse'
      }`}
    >
      <div className="md:w-1/2 p-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white text-center md:text-left">
          {section.title[language]}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center md:text-left">
          {section.content[language]}
        </p>
        {section.title[language] === 'Cam kết của IVP' && (
          <div className="mt-4 text-center md:text-left">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              {language === 'vi'
                ? 'Liên hệ để tham quan LAB, nhận bảng giá & tư vấn chuyên sâu.'
                : 'Contact us to visit the LAB, get pricing, and receive expert advice.'}
            </button>
          </div>
        )}
      </div>
      {section.imageUrl && (
        <div className="md:w-1/2 mt-4 md:mt-0 p-4">
          <img
            src={section.imageUrl}
            alt={section.imageAlt}
            className="rounded-lg shadow-md w-full"
          />
        </div>
      )}
    </section>
  ))}
</main>
    <Footer language={language} />
    <Contacts  language={language}/>

  </div>
  );
}