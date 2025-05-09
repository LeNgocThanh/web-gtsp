import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer_components';
import Contacts from '../../components/contacts_components';
import { useRouter } from 'next/router';

const MembersPage = () => {
    
    const [members, setMembers] = useState({});
    const [selectedMember, setSelectedMember] = useState(null);
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
            vi: 'Nông Trang',
            en: 'Farms',
        };
    // Lấy danh sách members từ API
    useEffect(() => {
        fetch('/api/members')
            .then((res) => res.json())
            .then((data) => {
                // Nhóm dữ liệu theo ngôn ngữ
                const groupedData = data.reduce((acc, member) => {
                    const groupName =
                        language === 'vi'
                            ? member.memberName || 'Nông trang khác' // Gán "Nông trang khác" nếu không có memberName
                            : member.en_memberName || 'Other farm'; // Gán "Other farm" nếu không có en_memberName
    
                    if (!acc[groupName]) acc[groupName] = [];
                    acc[groupName].push(member);
                    return acc;
                }, {});
    
                // Sắp xếp từng nhóm theo createTime giảm dần
                Object.keys(groupedData).forEach((key) => {
                    groupedData[key].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                });
    
                // Đẩy nhóm mặc định xuống cuối
                const sortedGroups = Object.entries(groupedData).sort(([keyA], [keyB]) => {
                    if (keyA === (language === 'vi' ? 'Nông trang khác' : 'Other farm')) return 1;
                    if (keyB === (language === 'vi' ? 'Nông trang khác' : 'Other farm')) return -1;
                    return keyA.localeCompare(keyB); // Sắp xếp các nhóm khác theo tên
                });
    
                // Chuyển đổi lại thành object
                const sortedData = Object.fromEntries(sortedGroups);
    
                setMembers(sortedData);
            })
            .catch((err) => console.error(err));
    }, [language]); 

    return (
        <div>
            <Header 
            language={language}
            onLanguageChange={handleLanguageChange}
            />
        <main className="w-full flex flex-col items-left justify-center p-4 bg-gray-100 ml-10">
            <h1 className="text-2xl font-bold mb-4">{titles[language]}</h1>
            {/* Hiển thị danh sách members */}
            {Object.keys(members).map((memberName) => (
                <div key={memberName} className="mb-6">
                    <h2 className="text-xl font-bold mb-2">{memberName}</h2>
                    <ul>
                        {members[memberName].map((member) => (
                            <li key={member._id} className="mb-4">
                                <button
                                    onClick={() =>
                                        setSelectedMember(
                                            selectedMember?._id === member._id ? null : member
                                        )
                                    }
                                    className={`text-blue-500 text-lg underline ${
                                        selectedMember?._id === member._id
                                            ? 'font-bold text-blue-700'
                                            : 'hover:text-blue-700'
                                    }`}
                                >
                                    {language === 'vi' ? member.Title : member.en_Title}
                                </button>
                                <p className="text-sm text-gray-500">
                                    {new Date(member.createTime).toLocaleString()}
                                </p>

                                {/* Hiển thị chi tiết khi được chọn */}
                                {selectedMember?._id === member._id && (
                                    <div className="mt-2 p-4 bg-gray-100 rounded shadow">
                                        <p className="mb-2"> {language === 'vi' ? member.details : member.en_details}</p>
                                        {member.images?.length > 0 && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {member.images.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img}
                                                        alt={`Image ${index + 1}`}
                                                        className="w-full h-auto object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {member.url && (
                                            <div className="mt-4">
                                                {member.url.includes('facebook.com') ? (
                                                    <iframe
                                                        src={'https://www.facebook.com/plugins/video.php?href='
                                                            + member.url}
                                                        width="560"
                                                        height="315"
                                                        frameBorder="0"
                                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                                        allowFullScreen
                                                        className="rounded"
                                                    ></iframe>
                                                ) : (
                                                    <a
                                                        href={member.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline"
                                                    >
                                                        Xem video
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                         <button
                        onClick={() => setSelectedMember(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
                    >
                     {language === 'vi' ? 'Quay lại danh sách' : 'Back to list'}
                    </button>
                                    </div>
                                    
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
        <Footer language={language}/>
        <Contacts language={language}/>
        </div>
    );
};

export default MembersPage;