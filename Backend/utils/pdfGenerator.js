import axios from "axios"
import PDFDocument from "pdfkit"

export const generatePDF = async (resumeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize PDF with modern layout
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
        layout: "portrait",
      })

      const buffers = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      // ===== Modern Design System =====
      const design = {
        colors: {
          primary: "#4f46e5", // Indigo - modern and professional
          secondary: "#3b82f6", // Blue for accents
          accent: "#f59e0b", // Amber for highlights
          background: "#f8fafc", // Light blue-gray bg
          text: "#1e293b", // Slate for better readability
          lightText: "#64748b", // Muted text
          border: "#e2e8f0", // Subtle borders
          success: "#10b981", // Green for skill indicators
          white: "#ffffff", // White
        },
        fonts: {
          header: "Helvetica-Bold",
          subheader: "Helvetica-Bold",
          body: "Helvetica",
          light: "Helvetica-Oblique",
        },
        spacing: {
          section: 25, // Consistent section spacing
          item: 15,
          paragraph: 10,
          skillBar: 30, // Increased spacing for skill bars
        },
        sizes: {
          title: 26,
          header: 16,
          subheader: 13,
          body: 11,
          small: 9,
        },
      }

      // ===== Modern Header =====
      doc.rect(0, 0, doc.page.width, 120).fill(design.colors.primary)

      // Name and Title with better vertical rhythm
      doc
        .font(design.fonts.header)
        .fontSize(design.sizes.title)
        .fillColor(design.colors.white)
        .text(resumeData.fullName.toUpperCase(), 60, 45, {
          lineGap: 5,
        })

      if (resumeData.title) {
        doc
          .font(design.fonts.light)
          .fontSize(design.sizes.subheader)
          .fillColor("rgba(255,255,255,0.9)")
          .text(resumeData.title, 60, 75)
      }

      // Contact Info with modern icons in a clean layout
      const contactY = 100
      const contactItems = []

      // Only add items that actually exist and are not empty
      if (resumeData.email && resumeData.email.trim()) {
        contactItems.push({ text: resumeData.email.trim(), icon: "✉" })
      }

      if (resumeData.phone && resumeData.phone.trim()) {
        contactItems.push({ text: resumeData.phone.trim(), icon: "📱" })
      }

      if (resumeData.linkedIn && resumeData.linkedIn.trim()) {
        contactItems.push({ text: resumeData.linkedIn.trim(), icon: "🔗" })
      }

      if (resumeData.website && resumeData.website.trim()) {
        contactItems.push({ text: resumeData.website.trim(), icon: "🌐" })
      }

      // Dynamic contact info spacing
      if (contactItems.length > 0) {
        const contactWidth = doc.page.width - 120
        const itemWidth = contactWidth / contactItems.length

        contactItems.forEach((item, i) => {
          doc
            .font(design.fonts.body)
            .fontSize(design.sizes.body)
            .fillColor(design.colors.white)
            .text(`${item.icon} ${item.text}`, 60 + i * itemWidth, contactY, {
              width: itemWidth,
              lineGap: 5,
              align: "left",
            })
        })
      }

      // Profile Photo with improved styling
      if (resumeData.photoUrl) {
        try {
          // Use axios to fetch the image
          const response = await axios.get(resumeData.photoUrl, {
            responseType: "arraybuffer",
          })

          const x = doc.page.width - 85
          const y = 60
          const radius = 35

          // White circular background
          doc.circle(x, y, radius + 3).fill(design.colors.white)

          // Clip for circular image
          doc.save().circle(x, y, radius).clip()

          // Draw the image
          doc.image(response.data, x - radius, y - radius, {
            width: radius * 2,
            height: radius * 2,
            align: "center",
            valign: "center",
          })

          doc.restore()

          // Add subtle shadow effect
          doc.circle(x, y, radius).strokeColor("rgba(0,0,0,0.2)").lineWidth(1).stroke()
        } catch (error) {
          console.error("Error loading profile photo:", error)
          // Continue without the photo if there's an error
        }
      }

      // ===== Content Area with Consistent Spacing =====
      let y = 150 // Start below header

      // ===== Summary Section with Card-like Design =====
      if (resumeData.summary) {
        // Card background
        const summaryHeight =
          doc.heightOfString(resumeData.summary, {
            width: doc.page.width - 120,
            lineGap: design.spacing.paragraph,
          }) + 30

        doc
          .roundedRect(50, y - 10, doc.page.width - 100, summaryHeight, 8)
          .fillColor(design.colors.background)
          .fill()

        addModernSectionHeader(doc, "PROFILE", y, design)
        y += 20

        doc
          .font(design.fonts.body)
          .fontSize(design.sizes.body)
          .fillColor(design.colors.text)
          .text(resumeData.summary, 60, y, {
            width: doc.page.width - 120,
            lineGap: design.spacing.paragraph,
            align: "left",
          })

        y += summaryHeight + design.spacing.section
      }

      // ===== Work Experience with Timeline Design =====
      if (resumeData.workExperiences?.length > 0) {
        addModernSectionHeader(doc, "EXPERIENCE", y, design)
        y += 20

        // Timeline line
        const startY = y
        let endY = y

        // COMPLETELY REVISED EXPERIENCE SECTION TO FIX OVERLAPPING TEXT
        for (let i = 0; i < resumeData.workExperiences.length; i++) {
          const exp = resumeData.workExperiences[i]

          // Calculate the height needed for this experience entry
          let descriptionHeight = 0
          if (exp.description) {
            const bullets = exp.description.split("\n").filter((p) => p.trim())
            bullets.forEach((bullet) => {
              descriptionHeight +=
                doc.heightOfString(bullet.trim(), {
                  width: doc.page.width - 165,
                  lineGap: design.spacing.paragraph,
                }) + 8
            })
          }

          // Total height needed for this experience entry
          const entryHeight = 60 + descriptionHeight + 15 // Header + description + padding

          // Check if we need a page break
          if (y + entryHeight > doc.page.height - 100) {
            // Draw timeline on current page before breaking
            if (i > 0) {
              // Only draw if we've already added some experiences
              doc.strokeColor(design.colors.secondary).lineWidth(2).moveTo(70, startY).lineTo(70, endY).stroke()
            }

            doc.addPage()
            y = 60

            // Reset timeline for new page
            const newStartY = y
            endY = newStartY

            // If this is the first experience on a new page, add the EXPERIENCE header again
            if (i === 0) {
              addModernSectionHeader(doc, "EXPERIENCE", y, design)
              y += 20
            }
          }

          // Timeline dot
          doc
            .circle(70, y + 10, 5)
            .fillColor(design.colors.accent)
            .fill()

          // Position and Company with better spacing
          doc
            .font(design.fonts.subheader)
            .fontSize(design.sizes.subheader)
            .fillColor(design.colors.primary)
            .text(exp.position, 90, y)

          doc
            .font(design.fonts.body)
            .fontSize(design.sizes.body)
            .fillColor(design.colors.secondary)
            .text(exp.company, 90, y + 18)

          // Right-aligned dates with pill design
          const dates = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`
          const dateWidth = doc.widthOfString(dates) + 20

          doc
            .roundedRect(doc.page.width - 60 - dateWidth, y, dateWidth, 18, 8)
            .fillColor(design.colors.primary)
            .fill()

          doc
            .font(design.fonts.light)
            .fontSize(design.sizes.small)
            .fillColor(design.colors.white)
            .text(dates, doc.page.width - 60 - dateWidth + 10, y + 4)

          y += 35

          // Description with improved bullet points
          if (exp.description) {
            const bullets = exp.description.split("\n").filter((p) => p.trim())
            bullets.forEach((bullet) => {
              // Custom bullet point
              doc
                .circle(95, y + 5, 2)
                .fillColor(design.colors.accent)
                .fill()

              doc
                .font(design.fonts.body)
                .fontSize(design.sizes.body)
                .fillColor(design.colors.text)
                .text(bullet.trim(), 105, y, {
                  width: doc.page.width - 165,
                  lineGap: design.spacing.paragraph,
                })

              y +=
                doc.heightOfString(bullet.trim(), {
                  width: doc.page.width - 165,
                  lineGap: design.spacing.paragraph,
                }) + 8
            })
          }

          endY = y + 5

          // Add space between experiences, but only if not the last one
          if (i < resumeData.workExperiences.length - 1) {
            y += 30 // Increased spacing between experiences
          }
        }

        // Draw timeline for the last page
        doc.strokeColor(design.colors.secondary).lineWidth(2).moveTo(70, startY).lineTo(70, endY).stroke()

        y += design.spacing.section
      }

      // ===== Education with Card Design =====
      if (resumeData.educations?.length > 0) {
        // Check if we need a page break before education section
        // Calculate approximate height needed for education section
        const eduSectionHeight = 30 + resumeData.educations.length * 100 // Header + entries

        // If education section won't fit on current page, start a new page
        if (y + eduSectionHeight > doc.page.height - 100) {
          doc.addPage()
          y = 60
        }

        addModernSectionHeader(doc, "EDUCATION", y, design)
        y += 20

        resumeData.educations.forEach((edu, i) => {
          // Check if this specific education entry needs a page break
          const eduEntryHeight = edu.achievements ? 100 : 70

          if (y + eduEntryHeight > doc.page.height - 80) {
            doc.addPage()
            y = 60
          }

          // Card background
          doc
            .roundedRect(50, y - 10, doc.page.width - 100, eduEntryHeight, 8)
            .fillColor(design.colors.background)
            .fill()

          // Left-aligned degree info
          doc
            .font(design.fonts.subheader)
            .fontSize(design.sizes.subheader)
            .fillColor(design.colors.primary)
            .text(edu.degree, 60, y)

          if (edu.fieldOfStudy) {
            doc
              .font(design.fonts.body)
              .fontSize(design.sizes.body)
              .fillColor(design.colors.lightText)
              .text(edu.fieldOfStudy, 60, y + 18)
          }

          // Right-aligned institution and dates
          doc
            .font(design.fonts.body)
            .fontSize(design.sizes.body)
            .fillColor(design.colors.secondary)
            .text(edu.institution, doc.page.width - 260, y, {
              width: 200,
              align: "right",
            })

          const dates = `${edu.startDate} - ${edu.endDate || "Present"}`
          doc
            .font(design.fonts.light)
            .fontSize(design.sizes.small)
            .fillColor(design.colors.lightText)
            .text(dates, doc.page.width - 160, y + (edu.fieldOfStudy ? 18 : 0), {
              width: 100,
              align: "right",
            })

          y += edu.fieldOfStudy ? 40 : 25

          // Achievements with subtle styling
          if (edu.achievements) {
            doc
              .font(design.fonts.body)
              .fontSize(design.sizes.small)
              .fillColor(design.colors.text)
              .text(`Notable: ${edu.achievements}`, 60, y, {
                width: doc.page.width - 120,
                lineGap: 5,
              })

            y +=
              doc.heightOfString(edu.achievements, {
                width: doc.page.width - 120,
              }) + 8
          }

          y += 15
        })

        y += design.spacing.section
      }

      // ===== Skills with Visual Progress Bars =====
      if (resumeData.skills?.length > 0) {
        // Check if we need a page break before skills section
        // Calculate approximate height needed for skills section
        const skillSectionHeight = 30 + resumeData.skills.length * design.spacing.skillBar // Header + rows

        // If skills section won't fit on current page, start a new page
        if (y + skillSectionHeight > doc.page.height - 80) {
          doc.addPage()
          y = 60
        }

        addModernSectionHeader(doc, "SKILLS", y, design)
        y += 20

        // Clean and format skills
        let cleanSkills = []

        // Handle different skill formats
        if (Array.isArray(resumeData.skills)) {
          // If skills is already an array
          cleanSkills = resumeData.skills
            .map((skill) => (typeof skill === "string" ? skill.replace(/[[\]"]/g, "").trim() : String(skill).trim()))
            .filter((skill) => skill)
        } else if (typeof resumeData.skills === "string") {
          // If skills is a string (possibly JSON)
          try {
            const parsedSkills = JSON.parse(resumeData.skills)
            if (Array.isArray(parsedSkills)) {
              cleanSkills = parsedSkills
                .map((skill) =>
                  typeof skill === "string" ? skill.replace(/[[\]"]/g, "").trim() : String(skill).trim(),
                )
                .filter((skill) => skill)
            } else {
              // If it's a string but not a valid JSON array
              cleanSkills = resumeData.skills
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            }
          } catch (e) {
            // If it's not valid JSON, treat as comma-separated
            cleanSkills = resumeData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          }
        }

        // Single column layout with skill bars - vertical layout
        const columnWidth = doc.page.width - 120
        let currentY = y

        cleanSkills.forEach((skill, i) => {
          // Check if we need a page break within skills section
          if (currentY > doc.page.height - 50) {
            doc.addPage()
            currentY = 60
          }

          // Skill name
          doc
            .font(design.fonts.body)
            .fontSize(design.sizes.body)
            .fillColor(design.colors.text)
            .text(skill, 60, currentY)

          // Skill bar background - increased spacing
          const barY = currentY + 20 // More space between text and bar
          doc
            .roundedRect(60, barY, columnWidth - 20, 6, 3)
            .fillColor("#e5e7eb")
            .fill()

          // Skill bar fill - random level between 65-100%
          const skillLevel = 0.65 + Math.random() * 0.35
          doc
            .roundedRect(60, barY, (columnWidth - 20) * skillLevel, 6, 3)
            .fillColor(design.colors.secondary)
            .fill()

          // Move to next row with improved spacing
          currentY += design.spacing.skillBar // Increased spacing between skill rows
        })

        y = currentY + design.spacing.section
      }

      // ===== Modern Footer =====
      const footerY = doc.page.height - 35
      doc.rect(0, footerY, doc.page.width, 35).fill(design.colors.primary)

      // Page number
      const totalPages = doc.bufferedPageRange().count
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i)

        // Footer text with contact info - fixed email display
        let footerText = resumeData.fullName || ""

        if (resumeData.email && resumeData.email.trim()) {
          footerText += ` • ${resumeData.email.trim()}`
        }

        if (resumeData.phone && resumeData.phone.trim()) {
          footerText += ` • ${resumeData.phone.trim()}`
        }

        doc
          .font(design.fonts.light)
          .fontSize(design.sizes.small)
          .fillColor(design.colors.white)
          .text(footerText, doc.page.width / 2, footerY + 12, {
            align: "center",
          })

        // Page number
        doc.text(`Page ${i + 1} of ${totalPages}`, doc.page.width - 80, footerY + 12, {
          align: "right",
        })
      }

      doc.end()
    } catch (error) {
      console.error("PDF generation error:", error)
      reject(error)
    }
  })
}

// Enhanced section header with modern design
function addModernSectionHeader(doc, title, y, design) {
  // Modern section header with accent bar
  doc.rect(50, y, 4, 16).fillColor(design.colors.accent).fill()

  // Section title
  doc
    .font(design.fonts.header)
    .fontSize(design.sizes.header)
    .fillColor(design.colors.primary)
    .text(title.toUpperCase(), 60, y - 4)

  // Underline
  const titleWidth = doc.widthOfString(title.toUpperCase())
  doc
    .rect(60, y + 14, titleWidth, 1)
    .fillColor(design.colors.accent)
    .fill()
}

// For testing, log a message
console.log("PDF Generator loaded successfully!")
