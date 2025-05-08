const Header = ({ language, onLanguageChange }) => {
    // Dữ liệu menu theo ngôn ngữ
    const menuData = {
        vi: [
            { label: 'Trang chủ', href: `/?language=vi` },
            { label: 'Sản phẩm', href: `/products?language=vi` },
            { label: 'Tin tức', href: `/news?language=vi` },
            { label: 'Nông Trang', href: `/members?language=vi` },
            { label: 'Liên hệ', href: `/contacts?language=vi` },
        ],
        en: [
            { label: 'Home', href: `/?language=en` },
            { label: 'Products', href: `/products?language=en` },
            { label: 'News', href: `/news?language=en` },
            { label: 'Farms', href: `/members?language=en` },
            { label: 'Contact', href: `/contacts?language=en` },
        ],
    };

    // Tiêu đề theo ngôn ngữ
    const titles = {
        vi: 'Công ty CP Giống Cây Trồng và Dược Liệu IVP',
        en: 'IVP - Seeds and Medicinal Materials Joint Stock Company',
    };

    return (
        <header className="w-full bg-gradient-to-b from-green-700 to-green-900 relative">
            {/* Ảnh nền */}
            <div
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(/images/header/background.jpg)` }}
            ></div>

            {/* Logo, Tên công ty và Menu */}
            <div className="container mx-auto px-4 mt-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="rounded-full overflow-hidden h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                            <img
                                src="/images/logo/logo.png"
                                alt="Logo Công ty"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Tên công ty */}
                        <div className="ml-4">
                            <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                                {titles[language]}
                            </h1>
                            <p className="text-white text-sm md:text-base lg:text-lg mt-1">
                                Hotline/WhatsApp/Zalo: +84837495888
                            </p>
                        </div>
                    </div>

                    {/* Nút chuyển ngôn ngữ */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => onLanguageChange('vi')}
                            className={`text-white px-4 py-2 rounded ${
                                language === 'vi' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            VI
                        </button>
                        <button
                            onClick={() => onLanguageChange('en')}
                            className={`text-white px-4 py-2 rounded ${
                                language === 'en' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            EN
                        </button>
                    </div>
                </div>

                {/* Menu */}
                <nav className="mt-4">
                    <ul className="flex space-x-4 md:space-x-6 lg:space-x-8">
                        {menuData[language].map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-300 px-4 py-2 rounded"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;