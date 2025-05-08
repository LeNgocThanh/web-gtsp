import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = req.query.folder || 'others'; // Lấy thư mục từ query hoặc mặc định là 'others'
      const uploadPath = path.join(process.cwd(), `public/uploads/${folder}`);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const folder = req.query.folder || 'others';
      const uploadPath = path.join(process.cwd(), `public/uploads/${folder}`);
      const originalName = file.originalname;
      let fileName = originalName;
      let counter = 1;

      // Kiểm tra nếu file đã tồn tại, đổi tên bằng cách thêm số đếm hoặc timestamp
      while (fs.existsSync(path.join(uploadPath, fileName))) {
        const ext = path.extname(originalName); // Lấy phần mở rộng file
        const baseName = path.basename(originalName, ext); // Lấy tên file không bao gồm phần mở rộng
        fileName = `${baseName}-${Date.now()}-${counter}${ext}`; // Đổi tên file
        counter++;
      }

      cb(null, fileName);
    },
  }),
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Middleware multer cần được "await" để hoàn thành trước khi xử lý tiếp
      await new Promise((resolve, reject) => {
        upload.array('images')(req, res, (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      });

      const filePaths = req.files.map((file) => `/uploads/${req.query.folder}/${file.filename}`);
      res.status(200).json({ success: true, filePaths });
    } catch (error) {
      res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};