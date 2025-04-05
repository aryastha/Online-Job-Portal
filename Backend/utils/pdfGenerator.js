import axios from 'axios';
import PDFDocument from 'pdfkit';

export const generatePDF = async (resumeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize PDF with modern layout
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50, // Increased margin for better spacing
        bufferPages: true,
        layout: 'portrait'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ===== Modern Design System =====
      const design = {
        colors: {
          primary: '#2b3d4f',       // Navy blue
          secondary: '#e74c3c',     // Coral accent (toned down)
          background: '#f8f9fa',    // Light gray bg
          text: '#2c3e50',          // Dark text
          lightText: '#7f8c8d'      // Secondary text
        },
        fonts: {
          header: 'Helvetica-Bold',
          subheader: 'Helvetica-Bold',
          body: 'Helvetica',
          light: 'Helvetica-Oblique'
        },
        spacing: {
          section: 30,
          subsection: 20,
          item: 15,
          paragraph: 10 // Increased paragraph spacing
        },
        sizes: {
          title: 28, // Increased font sizes
          header: 18,
          subheader: 16,
          body: 12,
          small: 10
        }
      };

      // ===== Modern Header with Proper Spacing =====
      doc.rect(0, 0, doc.page.width, 140) // Taller header
         .fill(design.colors.primary);

      // Name and Title with better spacing
      doc.font(design.fonts.header)
         .fontSize(design.sizes.title)
         .fillColor('#ffffff')
         .text(resumeData.fullName.toUpperCase(), 60, 60, {
           lineGap: 5
         });

      // Contact Info with better layout
      const contactY = 110;
      const contactItems = [
        { text: resumeData.email, icon: '✉' },
        { text: resumeData.phone, icon: '📱' },
        { text: resumeData.linkedIn, icon: '🔗' }
      ].filter(item => item.text);

      // Center contact items
      const contactWidth = 500;
      const contactStartX = (doc.page.width - contactWidth) / 2;
      
      contactItems.forEach((item, i) => {
        doc.font(design.fonts.body)
           .fontSize(design.sizes.body) // Larger font
           .fillColor('#ffffff')
           .text(`${item.icon} ${item.text}`, 
                 contactStartX + (i * 180), contactY, {
                   width: 180,
                   lineGap: 5
                 });
      });

      // Profile Photo with proper spacing
      if (resumeData.photoUrl) {
        try {
          const response = await axios.get(resumeData.photoUrl, {
            responseType: 'arraybuffer'
          });
          
          // Position photo with proper margins
          const x = doc.page.width - 80;
          const y = 60; // Proper top margin
          const radius = 35; // Slightly smaller for better balance
          
          doc.save()
             .circle(x, y, radius)
             .clip();
          
          doc.image(response.data, x - radius, y - radius, {
            width: radius * 2,
            height: radius * 2,
            align: 'center',
            valign: 'center'
          });
          
          doc.restore();
          
          // Add subtle border to circle
          doc.circle(x, y, radius)
             .stroke('#ffffff')
             .lineWidth(1.5);
        } catch (error) {
          console.error('Error loading profile photo:', error);
        }
      }

      // ===== Content Area with Better Spacing =====
      let y = 170; // Start below header with more space

      // ===== Summary Section =====
      if (resumeData.summary) {
        addModernSectionHeader(doc, 'PROFILE', y, design);
        y += design.spacing.section + 10;
        
        doc.font(design.fonts.body)
           .fontSize(design.sizes.body)
           .fillColor(design.colors.text)
           .text(resumeData.summary, 60, y, {
             width: doc.page.width - 120,
             lineGap: design.spacing.paragraph,
             align: 'left'
           });
        
        y += doc.heightOfString(resumeData.summary, {
          width: doc.page.width - 120
        }) + design.spacing.section + 10;
      }

      // ===== Work Experience =====
      if (resumeData.workExperiences?.length > 0) {
        addModernSectionHeader(doc, 'EXPERIENCE', y, design);
        y += design.spacing.section + 10;

        resumeData.workExperiences.forEach((exp, i) => {
          // Check page break with more buffer space
          if (y > doc.page.height - 220) {
            doc.addPage();
            y = 80;
          }

          // Position and Company with better hierarchy
          doc.font(design.fonts.subheader)
             .fontSize(design.sizes.subheader)
             .fillColor(design.colors.primary)
             .text(exp.position, 60, y);
          
          doc.font(design.fonts.body)
             .fontSize(design.sizes.body)
             .fillColor(design.colors.secondary)
             .text(exp.company, 60, y + 22);
          
          // Dates with better alignment
          const dates = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
          doc.font(design.fonts.light)
             .fontSize(design.sizes.small)
             .fillColor(design.colors.lightText)
             .text(dates, doc.page.width - 160, y, {
               width: 100,
               align: 'right'
             });
          
          y += 45;

          // Description with elegant bullet points and better spacing
          if (exp.description) {
            const bullets = exp.description.split('\n').filter(p => p.trim());
            bullets.forEach(bullet => {
              doc.font(design.fonts.body)
                 .fontSize(design.sizes.body)
                 .fillColor(design.colors.secondary) // Subtle bullet color
                 .text('•', 60, y);
              
              doc.fillColor(design.colors.text)
                 .text(bullet.trim(), 75, y, {
                   width: doc.page.width - 135,
                   lineGap: design.spacing.paragraph
                 });
              
              y += doc.heightOfString(bullet.trim(), {
                width: doc.page.width - 135
              }) + 12;
            });
          }

          // Add subtle separator only if more items follow
          if (i < resumeData.workExperiences.length - 1) {
            y += 15;
            doc.moveTo(60, y)
               .lineTo(doc.page.width - 60, y)
               .strokeColor('#e0e0e0') // Lighter separator
               .lineWidth(0.5)
               .stroke();
            y += 20;
          }
        });

        y += design.spacing.section;
      }

      // ===== Education ===== 
      if (resumeData.educations?.length > 0) {
        y += 20; // Extra space before education
        
        addModernSectionHeader(doc, 'EDUCATION', y, design);
        y += design.spacing.section + 10;

        resumeData.educations.forEach((edu, i) => {
          if (y > doc.page.height - 180) {
            doc.addPage();
            y = 80;
          }

          // Degree and Field with better typography
          doc.font(design.fonts.subheader)
             .fontSize(design.sizes.subheader)
             .fillColor(design.colors.primary)
             .text(edu.degree, 60, y);
          
          if (edu.fieldOfStudy) {
            doc.font(design.fonts.body)
               .fontSize(design.sizes.body)
               .fillColor(design.colors.lightText)
               .text(edu.fieldOfStudy, 60, y + 22);
          }
          
          // Institution and Dates with better alignment
          doc.font(design.fonts.body)
             .fontSize(design.sizes.body)
             .fillColor(design.colors.secondary)
             .text(edu.institution, 200, y);
          
          const dates = `${edu.startDate} - ${edu.endDate || 'Present'}`;
          doc.font(design.fonts.light)
             .fontSize(design.sizes.small)
             .fillColor(design.colors.lightText)
             .text(dates, doc.page.width - 160, y, {
               width: 100,
               align: 'right'
             });
          
          y += 45;

          // Achievements with better styling
          if (edu.achievements) {
            doc.font(design.fonts.body)
               .fontSize(design.sizes.small)
               .fillColor(design.colors.text)
               .text(`Notable: ${edu.achievements}`, 60, y, {
                 width: doc.page.width - 120,
                 lineGap: 6
               });
            
            y += doc.heightOfString(edu.achievements, {
              width: doc.page.width - 120
            }) + 25;
          }
        });
      }

      // ===== Skills ===== (modern two-column layout)
      if (resumeData.skills?.length > 0) {
        addModernSectionHeader(doc, 'SKILLS', y, design);
        y += design.spacing.section + 10;
        
        // Clean and format skills
        const cleanSkills = resumeData.skills.map(skill => 
          skill.replace(/[\[\]"]/g, '').trim()
        ).filter(skill => skill);
        
        // Two column layout with better spacing
        const columnWidth = (doc.page.width - 140) / 2;
        const columnGap = 20;
        let currentColumn = 0;
        let currentY = y;
        
        cleanSkills.forEach((skill, i) => {
          if (currentY > doc.page.height - 60) {
            doc.addPage();
            currentY = 80;
            currentColumn = 0;
          }
          
          const x = 60 + (currentColumn * (columnWidth + columnGap));
          
          // Modern bullet point with better spacing
          doc.font('Helvetica')
             .fontSize(design.sizes.body + 1)
             .fillColor(design.colors.secondary)
             .text('•', x, currentY + 2);
          
          doc.font(design.fonts.body)
             .fontSize(design.sizes.body)
             .fillColor(design.colors.text)
             .text(skill, x + 12, currentY, {
               width: columnWidth - 15
             });
          
          // Move to next column or row
          if (currentColumn === 0 && i < cleanSkills.length - 1) {
            currentColumn = 1;
          } else {
            currentColumn = 0;
            currentY += 22; // Increased line height
          }
        });
        
        y = currentY + 30;
      }

      // ===== Modern Minimal Footer =====
      const footerY = doc.page.height - 50; // More footer space
      doc.rect(0, footerY, doc.page.width, 50)
         .fill(design.colors.primary);
      
      // Simple centered footer text
      doc.font(design.fonts.light)
         .fontSize(design.sizes.small)
         .fillColor('#ffffff')
         .text('Professional Resume', 
               doc.page.width / 2, footerY + 20, {
                 align: 'center'
               });

      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

// Modern section header with subtle styling
function addModernSectionHeader(doc, title, y, design) {
  // Subtle left accent
  doc.rect(50, y + 8, 4, 18)
     .fill(design.colors.secondary);
  
  // Section title with better spacing
  doc.font(design.fonts.header)
     .fontSize(design.sizes.header)
     .fillColor(design.colors.primary)
     .text(title.toUpperCase(), 60, y);
  
  // Very subtle underline
  doc.moveTo(60, y + 24)
     .lineTo(60 + doc.widthOfString(title.toUpperCase()), y + 24)
     .strokeColor('#e0e0e0') // Lighter line
     .lineWidth(0.7)
     .stroke();
}