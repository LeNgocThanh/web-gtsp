import { businessPartnerDb } from '@/utils/db';



export default function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET': // Lấy danh sách đối tác
            businessPartnerDb.find({}, (err, docs) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi lấy danh sách đối tác' });
                }
                res.status(200).json(docs);
            });
            break;

        case 'POST': // Thêm đối tác mới
            const newPartner = req.body;
            if (!newPartner.title || !newPartner.text || !newPartner.logo) {
                return res.status(400).json({ error: 'Thiếu thông tin đối tác' });
            }
            businessPartnerDb.insert(newPartner, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi thêm đối tác' });
                }
                res.status(201).json(doc);
            });
            break;

        case 'PUT': // Sửa thông tin đối tác
            const { _id, ...updatedData } = req.body;
            if (!_id) {
                return res.status(400).json({ error: 'Thiếu ID đối tác để cập nhật' });
            }
            businessPartnerDb.update({ _id }, { $set: updatedData }, {}, (err, numReplaced) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi cập nhật đối tác' });
                }
                res.status(200).json({ message: 'Cập nhật thành công', numReplaced });
            });
            break;

        case 'DELETE': // Xóa đối tác
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: 'Thiếu ID đối tác để xóa' });
            }
            businessPartnerDb.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi xóa đối tác' });
                }
                res.status(200).json({ message: 'Xóa thành công', numRemoved });
            });
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}