import { Resume } from '../models/resume.model.js';
import cloudinary from '../utils/cloud.js';
import getDataUri from '../utils/datauri.js';
import { generatePDF } from '../utils/pdfGenerator.js';

export const createResume = async (req, res) => {
  try {
    // 1. Validate required fields
    const file = req.file;
    const requiredFields = ['fullName', 'email', 'skills', 'experience', 'education'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // 2. Process photo upload (if exists)
    let photoUrl, photoPublicId;
    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloudRes = await cloudinary.uploader.upload(fileUri.content, {
          folder: 'resume_photos',
          transformation: { width: 300, height: 300, crop: 'fill' },
          quality: 'auto:good'
        });
        photoUrl = cloudRes.secure_url;
        photoPublicId = cloudRes.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to process profile photo'
        });
      }
    }

    // 3. Create resume document
    const resumeData = {
      user: req.user._id,
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim(),
      photoUrl,
      photoPublicId,
      skills: req.body.skills.split(',').map(s => s.trim()).filter(s => s),
      experience: req.body.experience.trim(),
      education: req.body.education.trim(),
      summary: req.body.summary?.trim() || ''
    };

    const resume = await Resume.create(resumeData);

    // 4. Generate PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(resume.toObject());
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      
      // Cleanup: Delete the resume record if PDF fails
      await Resume.findByIdAndDelete(resume._id);
      if (photoPublicId) {
        await cloudinary.uploader.destroy(photoPublicId);
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to generate PDF'
      });
    }

    // 5. Send PDF response
    const sanitizedFilename = resumeData.fullName.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    res
      .setHeader('Content-Type', 'application/pdf')
      .setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}_Resume.pdf"`)
      .setHeader('Content-Length', pdfBuffer.length)
      .send(pdfBuffer);

    // 6. Optional: Store PDF in Cloudinary for future access
    try {
      const pdfRes = await cloudinary.uploader.upload_stream(
        { 
          resource_type: 'raw',
          folder: 'resume_pdfs',
          public_id: `resume_${resume._id}`
        },
        (error) => error && console.error('PDF backup failed:', error)
      ).end(pdfBuffer);
    } catch (backupError) {
      console.error('PDF backup failed:', backupError);
    }

  } catch (error) {
    console.error('Resume creation error:', error);
    
    res.status(500).json({ 
      success: false,
      error: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to create resume'
    });
  }
};

// Additional Controller Methods
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort('-createdAt')
      .select('-__v');
      
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch resumes' 
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }

    // Cleanup Cloudinary assets
    if (resume.photoPublicId) {
      await cloudinary.uploader.destroy(resume.photoPublicId);
    }
    await cloudinary.uploader.destroy(`resume_pdfs/resume_${resume._id}`, {
      resource_type: 'raw'
    });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete resume' 
    });
  }
};