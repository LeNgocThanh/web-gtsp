export default function Footer({language}) {
  const footerText1 = {
    vi: 'Công ty CP Giống Cây Trồng và Dược Liệu IVP..',
    en: 'IVP - Seeds and Medicinal Materials Joint Stock Company',
};
const footerText2 = {
  vi: 'Địa chỉ: Liền kề F14, KĐT An Viên, Phường Vĩnh Nguyên, Thành phố Nha Trang',
  en: 'Address: Liền kề F14, KĐT An Viên, Phường Vĩnh Nguyên, Thành phố Nha Trang',
};
const footerText3 = {
  vi: 'LAB nuôi cấy mô: Xã Nam Giang, huyện Thọ Xuân, tỉnh Thanh Hoá, Việt Nam.',
  en: 'Tissue culture lab: Xã Nam Giang, huyện Thọ Xuân, tỉnh Thanh Hoá, Việt Nam',
};

    return (
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} {footerText1[language]}</p>
          <p>{footerText2[language]}</p>
          <p>{footerText3[language]}</p>
          <p>Hotline/Whatapps/Zalo: +84837495888</p>
        </div>
      </footer>
    );
  }