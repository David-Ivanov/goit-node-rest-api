import multer from "multer";
import path from "node:path";

const storage = () => multer.diskStorage({
    destination(req, file, cd) {
        cd(null, path.resolve("tmp"));
        console.log(file);
    },
    filename(req, file, cd) {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const id = crypto.randomUUID();

        cd(`${basename}-${id}${extname}`);
    }
});

export default multer({ storage });