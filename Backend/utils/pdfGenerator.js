import PDFDocument from 'pdfkit';

export const generatePDF = (resumeData) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // Header
    doc.fontSize(20).text('Professional Resume', { align: 'center' });
    doc.moveDown(0.5);

    // Photo
    if (resumeData.photoUrl) {
      doc.image(resumeData.photoUrl, {
        width: 100,
        align: 'right'
      });
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
  });
};