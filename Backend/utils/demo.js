import axios from 'axios';
import PDFDocument from 'pdfkit';
import cloudinary from './utils/cloud.js';

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
      
      // Add other resume sections
      doc.moveDown();
      doc.fontSize(18).text('Contact Information');
      doc.fontSize(12).text(`Email: ${resumeData.email}`);
      // ... rest of your PDF generation code
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};