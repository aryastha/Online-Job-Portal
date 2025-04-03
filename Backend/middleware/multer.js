 import multer from "multer";


 //Keeps file in memory before processing them.
 const storage = multer.memoryStorage();
 export const singleUpload = multer({storage}).single("file");