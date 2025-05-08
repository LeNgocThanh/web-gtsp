import { membersDb } from '../../../utils/db';

export default function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET': // Lấy danh sách members
            membersDb.find({}, (err, docs) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi lấy danh sách members' });
                }
                res.status(200).json(docs);
            });
            break;

        case 'POST': // Thêm member mới
            const newMember = req.body;
            if (!newMember.Title || !newMember.details) {
                return res.status(400).json({ error: 'Thiếu thông tin Title hoặc details' });
            }
            newMember.createTime = new Date().toISOString(); // Lưu thời gian tạo
            membersDb.insert(newMember, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi thêm member' });
                }
                res.status(201).json(doc);
            });
            break;

        case 'PUT': // Sửa member
            const { _id, ...updatedData } = req.body;
            if (!_id || !updatedData.Title || !updatedData.details) {
                return res.status(400).json({ error: 'Thiếu ID hoặc thông tin Title/details để cập nhật' });
            }
            membersDb.update({ _id }, { $set: updatedData }, {}, (err, numReplaced) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi cập nhật member' });
                }
                res.status(200).json({ message: 'Cập nhật thành công', numReplaced });
            });
            break;

        case 'DELETE': // Xóa member
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'Thiếu ID member để xóa' });
            }
            membersDb.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi xóa member' });
                }
                res.status(200).json({ message: 'Xóa thành công', numRemoved });
            });
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}