import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer_components';
import Contacts from '../components/contacts_components';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const sections = [
  {
    title: 'IVP – ĐƠN VỊ SẢN XUẤT GIỐNG DỨA MD2 NUÔI CẤY MÔ',
    en_title: 'IVP – TISSUE CULTURE MD2 PINEAPPLE VARIETY PRODUCTION UNIT',
    content: 'Với năng lực sản xuất 3,6 triệu cây giống/năm (mở rộng đến 10 triệu cây), IVP là một trong số rất ít đơn vị tại Việt Nam sở hữu đầy đủ 3 yếu tố cốt lõi trong chuỗi nhân giống chuyên nghiệp:',
    en_content: 'With a production capacity of 3.6 million seedlings/year (expanding to 10 million seedlings), IVP is one of the few units in Vietnam that possesses all three core factors in a professional breeding chain:',
    imageUrl: '/images/index/dattrong.jpg', // Thay đổi đường dẫn
    imageAlt: 'Cây giống dứa MD2',
  },
  {
    title: 'Phòng LAB nuôi cấy mô hiện đại',
    en_title: 'Modern tissue culture lab',
    content: 'Người điều hành phòng LAB là Tiến sĩ Hoàng Thị Giang - nhà khoa học có uy tín, với hơn 10 năm học tập và nghiên cứu chuyên sâu tại Nga.',
    en_content: 'The lab is operated by Dr. Hoang Thi Giang - a reputable scientist with over 10 years of study and research in Russia.',
    imageUrl: '/images/index/tiensiGiang.jpg',  // Thay đổi đường dẫn
    imageAlt: 'Phòng LAB nuôi cấy mô',
  },
  {
    title: 'Vườn ươm giống quy mô lớn',
    en_title: 'Large-scale seedling nursery',
    content: 'IVP không thương mại cây giống. Chúng tôi sản xuất giống cây sạch bệnh, đồng đều di truyền, phục vụ quy mô canh tác và xuất khẩu.',
    en_content: 'IVP does not commercialize seedlings. We produce disease-free, genetically uniform seedlings to serve large-scale cultivation and export.',
    imageUrl: '/images/index/vuonuom.jpg',  // Thay đổi đường dẫn
    imageAlt: 'Vườn ươm giống',
  },
  {
    title: 'Vườn khảo nghiệm theo dõi sinh trưởng thực tế',
    en_title: 'Experimental garden monitoring actual growth',
    content: 'Mỗi lô giống trước khi giao đều được theo dõi chất lượng chặt chẽ từ lab đến ruộng.',
    en_content: 'Each batch of seedlings is closely monitored for quality from the lab to the field before delivery.',
    imageUrl: '/images/index/theodoi.jpg',  // Thay đổi đường dẫn
    imageAlt: 'Vườn khảo nghiệm',
  },
  {
    title: "Cam kết của IVP",
    en_title: "IVP's Commitment",
    content: "Đồng hành cùng nhà đầu tư và doanh nghiệp phát triển dứa quy mô lớn. Cung cấp cây giống ổn định – hỗ trợ kỹ thuật – kết nối đầu ra",
    en_content: "Accompanying investors and businesses to develop large-scale pineapples. Providing stable seedlings - technical support - connecting outputs",
  }
];

export default function Home() { 
  const router = useRouter();
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
  {sections.map((section, index) => (
    <section
      key={index}
      className={`w-full max-w-7xl flex flex-col md:flex-row items-center mb-8 ${
        index % 2 === 0 ? "" : "md:flex-row-reverse"
      }`}
    >
      <div className="md:w-1/2 p-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white text-center md:text-left">
          {language === 'vi' ? section.title : section.en_title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center md:text-left">
        {language === 'vi' ? section.content : section.en_content}
        </p>
        {/* {section.title === "Cam kết của IVP" && (
          <div className="mt-4 text-center md:text-left">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Liên hệ để tham quan LAB, nhận bảng giá & tư vấn chuyên sâu.
            </button>
          </div>
        )} */}
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
    <Footer language={language}/>
    <Contacts language={language}/>
  </div>
  );
}