import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer_components';
import Headers from '../../components/header';
import Contacts from '../../components/contacts_components';
import { useRouter } from 'next/router';

const PartnerPage = () => {
    const [partners, setPartners] = useState([]);

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
    // Lấy danh sách đối tác từ API
    useEffect(() => {
        fetch('/api/partner')
            .then((res) => res.json())
            .then((data) => setPartners(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Headers 
            language={language}
            onLanguageChange={handleLanguageChange}
            />
            <h1 className="text-2xl font-bold text-center mb-6">Danh sách đối tác</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {partners.map((partner) => (
                    <div
                        key={partner._id}
                        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
                    >
                        <img
                            src={partner.logo}
                            alt={partner.title}
                            className="w-full h-full object-contain mb-4"
                        />
                        <h2 className="text-lg font-semibold">{partner.title}</h2>
                        <p className="text-gray-600 mt-2">{partner.text}</p>
                    </div>
                ))}
            </div>
            <Footer language={language}/>
            <Contacts  language={language} />
        </div>
    );
};

export default PartnerPage;