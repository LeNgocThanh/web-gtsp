import { newsDb } from '@/utils/db';
// Khởi tạo cơ sở dữ liệu NeDB


export default function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET': // Lấy danh sách tin tức
            newsDb.find({}, (err, docs) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tức' });
                }
                res.status(200).json(docs);
            });
            break;

        case 'POST': // Thêm tin tức mới
            const newNews = req.body;
            if (!newNews.title || !newNews.details) {
                return res.status(400).json({ error: 'Thiếu thông tin tiêu đề hoặc chi tiết' });
            }
            newNews.createTime = new Date().toISOString();
            newsDb.insert(newNews, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi thêm tin tức' });
                }
                res.status(201).json(doc);
            });
            break;

        case 'PUT': // Sửa tin tức
            const { _id, ...updatedData } = req.body;
            if (!_id) {
                return res.status(400).json({ error: 'Thiếu ID tin tức để cập nhật' });
            }
            newsDb.update({ _id }, { $set: updatedData }, {}, (err, numReplaced) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi cập nhật tin tức' });
                }
                res.status(200).json({ message: 'Cập nhật thành công', numReplaced });
            });
            break;

            case 'DELETE': // Xóa tin tức
            const { id } = req.query;           
            if (!id) {
                return res.status(400).json({ error: 'Thiếu ID tin tức để xóa' });
            }
            newsDb.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi khi xóa tin tức' });
                }
                res.status(200).json({ message: 'Xóa thành công', numRemoved });
            });
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}