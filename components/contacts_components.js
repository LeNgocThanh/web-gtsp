import React, { useState } from 'react';

/**
 * @typedef {Object} ChatApp
 * @property {string} name - Tên ứng dụng chat.
 * @property {string} iconUrl - URL của biểu tượng ứng dụng.
 * @property {string} link - Liên kết đến ứng dụng chat.
 */

/**
 * Component hiển thị danh sách các ứng dụng chat.
 */
const Contacts = ({language}) => {
    const [isVisible, setIsVisible] = useState(false);
    const contactText1 = {
        vi: 'Ẩn liên hệ',
        en: 'hide contact',
    };
    const contactText2 = {
        vi: 'Hiện liên hệ',
        en: 'show contact',
    };

    const chatApps = [
        {
            name: 'Call me',
            iconUrl: '/icons/call.jpg',
            link: '',
        },
        {
            name: 'Whatsapp',
            iconUrl: '/icons/whatsApp.svg',
            link: '',
        },
        {
            name: 'Telegram',
            iconUrl: '/icons/telegram.png',
            link: 'https://t.me/yourusername',
        },
        {
            name: 'Zalo',
            iconUrl: '/icons/zalo.svg',
            link: 'https://zalo.me/yourusername',
        },
        {
            name: 'Facebook Messenger',
            iconUrl: '/icons/Facebook_Messenger.svg',
            link: 'https://m.me/yourusername',
        },
        {
            name: 'Email',
            iconUrl: '/icons/email.svg',
            link: '',
        },
            ];

    return (
        <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
            {/* Nút toggle */}
            <button
                onClick={() => setIsVisible((prev) => !prev)}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            >
                {isVisible ? contactText1[language] : contactText2[language]}
            </button>

            {/* Hiển thị danh sách contact nếu isVisible là true */}
            {isVisible && (
                <div className="flex flex-col space-y-2 mt-2">
                    {chatApps.map((app) => (
                        <a
                            key={app.name}
                            href={app.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
                        >
                            <img
                                src={app.iconUrl}
                                alt={`${app.name} icon`}
                                className="w-5 h-5"
                            />
                            <span>{app.name}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contacts;