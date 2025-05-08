import React, { useState, useEffect } from 'react';

const AdminBusinessPartner = () => {
    const [partners, setPartners] = useState([]);
    const [newPartner, setNewPartner] = useState({
        title: '',
        text: '',
        logo: null,
    });
    const [editingPartner, setEditingPartner] = useState(null); // Đối tác đang được chỉnh sửa

    // Lấy danh sách đối tác
    useEffect(() => {
        fetch('/api/partner')
            .then((res) => res.json())
            .then((data) => setPartners(data))
            .catch((err) => console.error(err));
    }, []);

    // Xử lý upload logo
    const handleLogoUpload = async (file) => {
        const formData = new FormData();
        formData.append('images', file);

        const response = await fetch('/api/uploads?folder=partner/icons', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            return data.filePaths[0]; // Trả về đường dẫn file đầu tiên
        } else {
            throw new Error('Lỗi khi upload file');
        }
    };

    // Xử lý thêm đối tác mới
    const handleAddPartner = async () => {
        if (!newPartner.title || !newPartner.text || !newPartner.logo) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            const logoPath = await handleLogoUpload(newPartner.logo);

            const response = await fetch('/api/partner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newPartner.title,
                    text: newPartner.text,
                    logo: logoPath,
                }),
            });

            if (response.ok) {
                const addedPartner = await response.json();
                setPartners((prev) => [...prev, addedPartner]);
                setNewPartner({ title: '', text: '', logo: null });
            } else {
                alert('Lỗi khi thêm đối tác!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi upload logo!');
        }
    };

    // Xử lý chỉnh sửa đối tác
    const handleEditPartner = async () => {
        if (!editingPartner.title || !editingPartner.text) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            let logoPath = editingPartner.logo;
            if (typeof editingPartner.logo === 'object') {
                // Nếu logo là file, upload file mới
                logoPath = await handleLogoUpload(editingPartner.logo);
            }

            const response = await fetch('/api/partner', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: editingPartner._id,
                    title: editingPartner.title,
                    text: editingPartner.text,
                    logo: logoPath,
                }),
            });

            if (response.ok) {
                const updatedPartner = await response.json();
                setPartners((prev) =>
                    prev.map((partner) =>
                        partner._id === updatedPartner._id ? updatedPartner : partner
                    )
                );
                setEditingPartner(null);
            } else {
                alert('Lỗi khi chỉnh sửa đối tác!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi upload logo!');
        }
    };

    // Xử lý xóa đối tác
    const handleDeletePartner = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đối tác này?')) return;

        const response = await fetch(`/api/partner?id=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setPartners((prev) => prev.filter((partner) => partner._id !== id));
        } else {
            alert('Lỗi khi xóa đối tác!');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quản lý đối tác</h1>

            {/* Form thêm hoặc chỉnh sửa đối tác */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    {editingPartner ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}
                </h2>
                <input
                    type="text"
                    placeholder="Tên đối tác"
                    value={editingPartner ? editingPartner.title : newPartner.title}
                    onChange={(e) =>
                        editingPartner
                            ? setEditingPartner({ ...editingPartner, title: e.target.value })
                            : setNewPartner({ ...newPartner, title: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                />
                <textarea
                    placeholder="Thông tin đối tác"
                    value={editingPartner ? editingPartner.text : newPartner.text}
                    onChange={(e) =>
                        editingPartner
                            ? setEditingPartner({ ...editingPartner, text: e.target.value })
                            : setNewPartner({ ...newPartner, text: e.target.value })
                    }
                    className="block w-full mb-2 p-2 border rounded"
                />
                <input
                    type="file"
                    onChange={(e) =>
                        editingPartner
                            ? setEditingPartner({ ...editingPartner, logo: e.target.files[0] })
                            : setNewPartner({ ...newPartner, logo: e.target.files[0] })
                    }
                    className="block w-full mb-2"
                />
                <button
                    onClick={editingPartner ? handleEditPartner : handleAddPartner}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {editingPartner ? 'Lưu chỉnh sửa' : 'Thêm đối tác'}
                </button>
                {editingPartner && (
                    <button
                        onClick={() => setEditingPartner(null)}
                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                )}
            </div>

            {/* Danh sách đối tác */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Danh sách đối tác</h2>
                <ul>
                    {partners.map((partner) => (
                        <li key={partner._id} className="mb-4 p-4 border rounded">
                            <h3 className="text-lg font-bold">{partner.title}</h3>
                            <p>{partner.text}</p>
                            <img
                                src={partner.logo}
                                alt={partner.title}
                                className="w-16 h-16 mt-2"
                            />
                            <div className="mt-2">
                                <button
                                    onClick={() => setEditingPartner(partner)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeletePartner(partner._id)}
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

export default AdminBusinessPartner;