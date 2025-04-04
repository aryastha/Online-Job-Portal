// import PDFDocument from 'pdfkit';

// export const generatePDF = (resumeData) => {
//   return new Promise((resolve) => {
//     const doc = new PDFDocument();
//     const buffers = [];
    
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));

//     // Header
//     doc.fontSize(20).text('Professional Resume', { align: 'center' });
//     doc.moveDown(0.5);

//     // Photo
//     if (resumeData.photoUrl) {
//       doc.image(resumeData.photoUrl, {
//         width: 100,
//         align: 'right'
//       });
//     }

//     // Personal Info
//     doc.fontSize(14).text(`Name: ${resumeData.fullName}`);
//     doc.text(`Email: ${resumeData.email}`);
//     doc.moveDown();

//     // Sections
//     const addSection = (title, content) => {
//       doc.fontSize(16).text(title, { underline: true });
//       doc.moveDown(0.3);
//       doc.fontSize(12).text(content);
//       doc.moveDown();
//     };

//     if (resumeData.summary) addSection('Summary', resumeData.summary);
//     if (resumeData.experience) addSection('Experience', resumeData.experience);
//     if (resumeData.education) addSection('Education', resumeData.education);
//     if (resumeData.skills?.length) {
//       addSection('Skills', resumeData.skills.join(', '));
//     }

//     doc.end();
//   });
// };


import axios from 'axios';
import PDFDocument from 'pdfkit';
import cloudinary from './cloud.js';

export const generatePDF = async (resumeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Add resume content
      doc.fontSize(25).text(resumeData.fullName, { align: 'center' });
      
      // Add photo if exists
      if (resumeData.photoUrl) {
        try {
          // Download image from Cloudinary
          const response = await axios.get(resumeData.photoUrl, { 
            responseType: 'arraybuffer' 
          });
          
          // Add image to PDF
          doc.image(response.data, {
            fit: [150, 150],
            align: 'center'
          });
        } catch (imageError) {
          console.error('Error adding photo:', imageError);
          // Continue without photo if there's an error
        }
      }
      
      // Personal Info
    doc.fontSize(14).text(`Name: ${resumeData.fullName}`);
    doc.text(`Email: ${resumeData.email}`);
    doc.moveDown();

    // Sections
    const addSection = (title, content) => {
      doc.fontSize(16).text(title, { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).text(content);
      doc.moveDown();
    };

    if (resumeData.summary) addSection('Summary', resumeData.summary);
    if (resumeData.experience) addSection('Experience', resumeData.experience);
    if (resumeData.education) addSection('Education', resumeData.education);
    if (resumeData.skills?.length) {
      addSection('Skills', resumeData.skills.join(', '));
    }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};