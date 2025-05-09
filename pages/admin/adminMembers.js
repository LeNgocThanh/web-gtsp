import React, { useState, useEffect } from 'react';
import Header_admin from '../../components/header_admin';

const AdminMember = () => {
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState({
        memberName: '',
        en_memberName: '',
        Title: '',
        en_Title:'',
        details: '',
        en_details:'',
        images: [],
        url: '',
    });
    const [editingMember, setEditingMember] = useState(null);

    // Lấy danh sách members từ API
    useEffect(() => {
        fetch('/api/members')
            .then((res) => res.json())
            .then((data) => {
                // Nhóm theo memberName và sắp xếp theo createTime giảm dần
                const groupedData = data.reduce((acc, member) => {
                    if (!acc[member.memberName]) acc[member.memberName] = [];
                    acc[member.memberName].push(member);
                    return acc;
                }, {});

                Object.keys(groupedData).forEach((key) => {
                    groupedData[key].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                });

                setMembers(groupedData);
            })
            .catch((err) => console.error(err));
    }, []);

    // Xử lý thêm member mới
    const handleAddMember = async () => {
        if (!newMember.Title || !newMember.details) {
            alert('Vui lòng nhập đầy đủ Title và details!');
            return;
        }

        try {
            let images = [];

            // Upload ảnh nếu có
            if (newMember.images.length > 0) {
                const formData = new FormData();
                Array.from(newMember.images).forEach((file) => {
                    formData.append('images', file);
                });

                const uploadResponse = await fetch('/api/uploads?folder=members', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    images = uploadResult.filePaths; // Lấy đường dẫn ảnh đã upload
                } else {
                    alert('Lỗi khi upload ảnh!');
                    return;
                }
            }

            // Gửi thông tin member đến API
            const response = await fetch('/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newMember,
                    images,
                }),
            });

            if (response.ok) {
                const addedMember = await response.json();
                setMembers((prev) => ({
                    ...prev,
                    [addedMember.memberName]: [
                        ...(prev[addedMember.memberName] || []),
                        addedMember,
                    ].sort((a, b) => new Date(b.createTime) - new Date(a.createTime)),
                }));
                setNewMember({ memberName: '', Title: '', details: '', images: [], url: '' });
            } else {
                alert('Lỗi khi thêm Nông Trang!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi thêm Nông Trang!');
        }
    };

    // Xử lý chỉnh sửa member
    const handleEditMember = async () => {
        if (!editingMember.Title || !editingMember.details) {
            alert('Vui lòng nhập đầy đủ Title và details!');
            return;
        }
    
        // Hiển thị thông báo xác nhận
        const confirmEdit = window.confirm('Bạn có chắc chắn muốn chỉnh sửa Nông Trang này?');
        if (!confirmEdit) return;
    
        try {
            let images = editingMember.images.filter((file) => typeof file === 'string'); // Giữ lại các URL cũ
    
            // Upload ảnh mới nếu có
            const newFiles = editingMember.images.filter((file) => file instanceof File);
            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach((file) => {
                    formData.append('images', file);
                });
    
                const uploadResponse = await fetch('/api/uploads?folder=members', {
                    method: 'POST',
                    body: formData,
                });
    
                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    images = [...images, ...uploadResult.filePaths]; // Kết hợp URL cũ và mới
                } else {
                    alert('Lỗi khi upload ảnh!');
                    return;
                }
            }
    
            // Gửi thông tin cập nhật đến API
            const response = await fetch('/api/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: editingMember._id,
                    ...editingMember,
                    images,
                }),
            });
    
            if (response.ok) {
                const updatedMember = await response.json();
                setMembers((prev) => ({
                    ...prev,
                    [updatedMember.memberName]: [
                        ...(prev[updatedMember.memberName] || []).map((member) =>
                            member._id === updatedMember._id ? updatedMember : member
                        ),
                    ].sort((a, b) => new Date(b.createTime) - new Date(a.createTime)),
                }));
                setEditingMember(null);
            } else {
                alert('Lỗi khi chỉnh sửa Nông Trang!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi khi chỉnh sửa Nông Trang!');
        }
    };
    
    // Xử lý xóa member
    const handleDeleteMember = async (id, memberName) => {
        // Hiển thị thông báo xác nhận
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa Nông Trang này?');
        if (!confirmDelete) return;
    
        try {
            // Lấy member cần xóa
            const memberToDelete = members[memberName].find((member) => member._id === id);
    
            if (memberToDelete) {
                // Gọi API xóa ảnh
                const filePaths = memberToDelete.images; // Lấy danh sách đường dẫn ảnh
                if (filePaths.length > 0) {
                    await fetch('/api/uploads', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filePaths }), // Gửi danh sách đường dẫn ảnh
                    });
                }
            }
    
            // Gọi API xóa member
            const response = await fetch(`/api/members?id=${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                setMembers((prev) => ({
                    ...prev,
                    [memberName]: prev[memberName].filter((member) => member._id !== id),
                }));
                alert('Xóa member thành công!');
            } else {
                alert('Lỗi khi xóa Nông Trang!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa Nông Trang:', error);
            alert('Lỗi khi xóa Nông Trang!');
        }
    };

    return (
        <div className="p-4">
            <Header_admin />
            <h1 className="text-2xl font-bold mb-4">Quản lý Nông trang</h1>
    
            {/* Form thêm hoặc chỉnh sửa member */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tên Nông trang"
                    value={editingMember ? editingMember.memberName : newMember.memberName}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, memberName: e.target.value })
                            : setNewMember({ ...newMember, memberName: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Tên Nông trang tiếng Anh"
                    value={editingMember ? editingMember.en_memberName : newMember.en_memberName}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, en_memberName: e.target.value })
                            : setNewMember({ ...newMember, en_memberName: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Tiêu đề"
                    value={editingMember ? editingMember.Title : newMember.Title}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, Title: e.target.value })
                            : setNewMember({ ...newMember, Title: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Tiêu đề tiếng Anh"
                    value={editingMember ? editingMember.en_Title : newMember.en_Title}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, en_Title: e.target.value })
                            : setNewMember({ ...newMember, en_Title: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <textarea
                    placeholder="Nội dung"
                    value={editingMember ? editingMember.details : newMember.details}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, details: e.target.value })
                            : setNewMember({ ...newMember, details: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <textarea
                    placeholder="Nội dung tiếng Anh"
                    value={editingMember ? editingMember.en_details : newMember.en_details}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, en_details: e.target.value })
                            : setNewMember({ ...newMember, en_details: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="file"
                    multiple
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, images: e.target.files })
                            : setNewMember({ ...newMember, images: e.target.files })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    placeholder="URL"
                    value={editingMember ? editingMember.url : newMember.url}
                    onChange={(e) =>
                        editingMember
                            ? setEditingMember({ ...editingMember, url: e.target.value })
                            : setNewMember({ ...newMember, url: e.target.value })
                    }
                    className="border p-2 mb-2 w-full"
                />
                <button
                    onClick={editingMember ? handleEditMember : handleAddMember}
                    className={`${
                        editingMember ? 'bg-yellow-500' : 'bg-blue-500'
                    } text-white px-4 py-2 rounded`}
                >
                    {editingMember ? 'Cập nhật Member' : 'Thêm Member'}
                </button>
                {editingMember && (
                    <button
                        onClick={() => setEditingMember(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                    >
                        Hủy
                    </button>
                )}
            </div>
    
            {/* Hiển thị danh sách members */}
            {Object.keys(members).map((memberName) => (
                <div key={memberName} className="mb-6">
                    <h2 className="text-xl font-bold mb-2">{memberName}</h2>
                    <ul>
                        {members[memberName].map((member) => (
                            <li key={member._id} className="mb-4">
                                <h3 className="font-bold">{member.Title}</h3>
                                <h3 className="font-bold">{member.en_Title}</h3>
                                <p>{member.details}</p>
                                <p>{member.en_details}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(member.createTime).toLocaleString()}
                                </p>
                                {member.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Image ${index + 1}`}
                                        className="w-20 h-20 object-cover"
                                    />
                                ))}
                                {member.url && (
                                     member.url.includes('facebook.com') ? (
                                        <iframe
                                            src={`https://www.facebook.com/plugins/video.php?href=${member.url}`}
                                            width="560"
                                            height="315"
                                            style={{ border: 0 }}
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
                                    ) )}

                                <button
                                    onClick={() => setEditingMember(member)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDeleteMember(member._id, memberName)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Xóa
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default AdminMember;