import multer, { memoryStorage } from "multer";

const upload = multer({
    dest: "uploads/",
    storage: memoryStorage(),
});

export default upload;
