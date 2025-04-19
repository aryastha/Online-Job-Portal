 import multer from "multer";


 //Keeps file in memory before processing them.
 const storage = multer.memoryStorage();
 export const singleUpload = multer({storage}).single("file");

// import multer from "multer";

// const storage = multer.memoryStorage();

// // Configure multer with additional options
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit per file
//     files: 2 // Maximum of 2 files
//   },
//   fileFilter: (req, file, cb) => {
//     // Validate file types
//     if (file.fieldname === 'profilePicture') {
//       if (!file.mimetype.startsWith('image/')) {
//         return cb(new Error('Only image files are allowed for profile pictures'));
//       }
//     }
//     if (file.fieldname === 'file') { // For resume
//       if (!file.mimetype.includes('pdf') && !file.mimetype.includes('msword')) {
//         return cb(new Error('Only PDF or Word documents are allowed for resumes'));
//       }
//     }
//     cb(null, true);
//   }
// });

// // Export multiple upload handlers
// export const profileUpload = upload.fields([
//   { name: 'profilePicture', maxCount: 1 },
//   { name: 'file', maxCount: 1 }
// ]);

// // Keep the single upload for other routes if needed
// export const singleUpload = upload.single("file");