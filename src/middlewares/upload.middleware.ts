import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Batasi ukuran file 5 MB
    },
});

export default upload;