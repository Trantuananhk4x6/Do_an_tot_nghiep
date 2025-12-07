// CV Export Service - Export to PDF and DOCX with templates

import { CVData, CVTemplate, ExportFormat } from '@/app/(features)/support-cv/types/cv.types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertInchesToTwip
} from 'docx';

// Type for section order
interface SectionOrderItem {
  id: string;
  label: string;
  visible: boolean;
}

export async function exportCV(
  cvData: CVData,
  template: CVTemplate,
  format: ExportFormat,
  htmlElement?: HTMLElement,
  sectionOrder?: SectionOrderItem[]
): Promise<Blob> {
  console.log(`[Export Service] Exporting CV as ${format} with ${template} template`);

  if (format === 'pdf') {
    // If HTML element is provided, use it for export (matches preview design)
    if (htmlElement) {
      return await exportFromHTML(htmlElement);
    }
    // Fallback to manual rendering (less accurate)
    return await exportToPDF(cvData, template);
  } else {
    return await exportToDOCX(cvData, template, sectionOrder);
  }
}

async function exportFromHTML(element: HTMLElement): Promise<Blob> {
  console.log('[Export Service] Converting HTML to PDF...');
  
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove visibility hidden from the clone and its children
  clone.style.visibility = 'visible';
  clone.style.position = 'static';
  clone.style.left = '0';
  clone.style.opacity = '1';
  
  // Make all child elements visible
  const allElements = clone.querySelectorAll('*');
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style) {
      htmlEl.style.visibility = 'visible';
    }
  });
  
  // Create a temporary iframe for proper rendering
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '0';
  iframe.style.top = '0';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  try {
    // Write content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Cannot access iframe document');
    }

    // Copy all stylesheets from parent document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('\n');

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          ${styles}
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 0; 
              background: white !important;
              font-family: 'Times New Roman', Times, serif;
            }
            .cv-container {
              width: 210mm;
              min-height: 297mm;
              background: white !important;
              padding: 0;
              margin: 0;
            }
            /* Force all backgrounds to be visible */
            [class*="bg-"] { background-color: inherit; }
            /* Ensure text is visible */
            [class*="text-"] { color: inherit; }
          </style>
        </head>
        <body>
          <div class="cv-container">
            ${clone.outerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));

    const targetElement = iframeDoc.querySelector('.cv-container') as HTMLElement;
    if (!targetElement) {
      throw new Error('Cannot find target element in iframe');
    }

    const actualHeight = targetElement.scrollHeight || targetElement.offsetHeight || 1123;
    
    // Capture with html2canvas
    const canvas = await html2canvas(targetElement, {
      scale: 3, // Higher resolution for sharper PDF
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96dpi (210mm)
      height: actualHeight,
      windowWidth: 794,
      windowHeight: actualHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        // Ensure white background
        const body = clonedDoc.body;
        body.style.background = 'white';
        body.style.margin = '0';
        body.style.padding = '0';
      }
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // If content fits on one page, just add the image
    if (imgHeight <= pageHeight) {
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG with high quality for better compression
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // For multi-page content
      const pixelsPerPage = (pageHeight / imgWidth) * canvas.width;
      const totalPages = Math.ceil(canvas.height / pixelsPerPage);
      
      for (let page = 0; page < totalPages; page++) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        const remainingHeight = canvas.height - (page * pixelsPerPage);
        pageCanvas.height = Math.min(pixelsPerPage, remainingHeight);
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          const sourceY = page * pixelsPerPage;
          const sourceHeight = pageCanvas.height;
          
          // Fill with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          
          // Draw the portion
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
          
          if (page > 0) {
            pdf.addPage();
          }
          
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const sliceHeight = (sourceHeight * imgWidth) / canvas.width;
          pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, sliceHeight, undefined, 'FAST');
        }
      }
    }

    console.log('[Export Service] ✓ HTML to PDF conversion complete');
    return pdf.output('blob');
  } finally {
    // Clean up
    document.body.removeChild(iframe);
  }
}

async function exportToPDF(cvData: CVData, template: CVTemplate): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Apply template-specific styling
  switch (template) {
    case 'minimal':
      renderMinimalTemplate(doc, cvData);
      break;
    case 'modern':
      renderModernTemplate(doc, cvData);
      break;
    case 'ats-friendly':
      renderATSTemplate(doc, cvData);
      break;
    case 'creative':
      renderCreativeTemplate(doc, cvData);
      break;
    case 'professional':
      renderProfessionalTemplate(doc, cvData);
      break;
  }

  return doc.output('blob');
}

function renderMinimalTemplate(doc: jsPDF, cvData: CVData) {
  let y = 20;
  const leftMargin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - 2 * leftMargin;

  const checkNewPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Personal Info
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.fullName, leftMargin, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.personalInfo.title || '', leftMargin, y);
  y += 6;

  doc.setFontSize(9);
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location
  ].filter(Boolean).join(' | ');
  doc.text(contactInfo, leftMargin, y);
  y += 10;

  // Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, contentWidth);
    doc.text(summaryLines, leftMargin, y);
    y += summaryLines.length * 5 + 8;
  }

  // Experience
  if (cvData.experiences.length > 0) {
    checkNewPage();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPERIENCE', leftMargin, y);
    y += 8;

    cvData.experiences.forEach(exp => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, leftMargin, y);
      y += 6;

      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          const bulletLines = doc.splitTextToSize(`• ${achievement}`, contentWidth - 5);
          doc.text(bulletLines, leftMargin + 3, y);
          y += bulletLines.length * 5;
          checkNewPage();
        });
      }
      y += 5;
    });
  }

  // Education
  if (cvData.education.length > 0) {
    checkNewPage();
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', leftMargin, y);
    y += 8;

    cvData.education.forEach(edu => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field ? ' in ' + edu.field : ''}`, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.school} | ${edu.startDate} - ${edu.endDate}`, leftMargin, y);
      y += 8;
      checkNewPage();
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    checkNewPage();
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', leftMargin, y);
    y += 8;

    // Group skills by category
    const skillsByCategory: Record<string, string[]> = {};
    cvData.skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill.name);
    });

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category}:`, leftMargin, y);
      
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.join(', ');
      const skillLines = doc.splitTextToSize(skillsText, contentWidth - 30);
      doc.text(skillLines, leftMargin + 30, y);
      y += skillLines.length * 5 + 3;
      checkNewPage();
    });
  }

  // Projects
  if (cvData.projects && cvData.projects.length > 0) {
    checkNewPage();
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', leftMargin, y);
    y += 8;

    cvData.projects.forEach(project => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (project.startDate || project.endDate) {
        const dateRange = [project.startDate, project.endDate].filter(Boolean).join(' - ');
        doc.text(dateRange, leftMargin, y);
        y += 5;
      }

      if (project.description) {
        const descLines = doc.splitTextToSize(project.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        const techText = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : project.technologies;
        const techLines = doc.splitTextToSize(`Technologies: ${techText}`, contentWidth);
        doc.text(techLines, leftMargin, y);
        y += techLines.length * 4.5;
      }

      y += 5;
    });
  }

  // Awards
  if (cvData.awards && cvData.awards.length > 0) {
    checkNewPage();
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AWARDS & HONORS', leftMargin, y);
    y += 8;

    cvData.awards.forEach(award => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(award.title, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (award.issuer) {
        doc.text(`${award.issuer}${award.date ? ' | ' + award.date : ''}`, leftMargin, y);
        y += 5;
      }

      if (award.description) {
        const descLines = doc.splitTextToSize(award.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      y += 5;
    });
  }
}

function renderModernTemplate(doc: jsPDF, cvData: CVData) {
  // Modern template with color accents
  const primaryColor: [number, number, number] = [41, 128, 185]; // Blue
  const leftMargin = 20;
  const contentWidth = 170;
  let y = 20;

  const checkNewPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Header with background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.fullName, leftMargin, 25);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.personalInfo.title || '', leftMargin, 35);

  doc.setFontSize(9);
  const contact = [cvData.personalInfo.email, cvData.personalInfo.phone].filter(Boolean).join(' | ');
  doc.text(contact, leftMargin, 43);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  y = 60;

  // Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, contentWidth);
    doc.text(summaryLines, leftMargin, y);
    y += summaryLines.length * 5 + 10;
  }

  // Experience Section
  if (cvData.experiences.length > 0) {
    checkNewPage();
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(leftMargin, y - 5, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPERIENCE', leftMargin + 2, y);
    doc.setTextColor(0, 0, 0);
    y += 12;

    cvData.experiences.forEach(exp => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, leftMargin, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, leftMargin, y);
      y += 6;
      
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          const bulletLines = doc.splitTextToSize(`• ${achievement}`, contentWidth - 5);
          doc.text(bulletLines, leftMargin + 3, y);
          y += bulletLines.length * 5;
          checkNewPage();
        });
      }
      y += 5;
    });
  }

  // Education Section
  if (cvData.education.length > 0) {
    checkNewPage();
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(leftMargin, y - 5, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', leftMargin + 2, y);
    doc.setTextColor(0, 0, 0);
    y += 12;

    cvData.education.forEach(edu => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field ? ' in ' + edu.field : ''}`, leftMargin, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.school} | ${edu.startDate} - ${edu.endDate}`, leftMargin, y);
      y += 10;
      checkNewPage();
    });
  }

  // Skills Section
  if (cvData.skills.length > 0) {
    checkNewPage();
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(leftMargin, y - 5, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', leftMargin + 2, y);
    doc.setTextColor(0, 0, 0);
    y += 12;

    const skillsByCategory: Record<string, string[]> = {};
    cvData.skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill.name);
    });

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category}:`, leftMargin, y);
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.join(', ');
      const skillLines = doc.splitTextToSize(skillsText, contentWidth - 30);
      doc.text(skillLines, leftMargin + 30, y);
      y += skillLines.length * 5 + 3;
      checkNewPage();
    });
  }

  // Projects Section
  if (cvData.projects && cvData.projects.length > 0) {
    checkNewPage();
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(leftMargin, y - 5, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', leftMargin + 2, y);
    doc.setTextColor(0, 0, 0);
    y += 12;

    cvData.projects.forEach(project => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (project.startDate || project.endDate) {
        const dateRange = [project.startDate, project.endDate].filter(Boolean).join(' - ');
        doc.text(dateRange, leftMargin, y);
        y += 5;
      }

      if (project.description) {
        const descLines = doc.splitTextToSize(project.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        const techText = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : project.technologies;
        const techLines = doc.splitTextToSize(`Technologies: ${techText}`, contentWidth);
        doc.text(techLines, leftMargin, y);
        y += techLines.length * 4.5;
      }

      y += 5;
    });
  }

  // Awards Section
  if (cvData.awards && cvData.awards.length > 0) {
    checkNewPage();
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(leftMargin, y - 5, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('AWARDS & HONORS', leftMargin + 2, y);
    doc.setTextColor(0, 0, 0);
    y += 12;

    cvData.awards.forEach(award => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(award.title, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (award.issuer) {
        doc.text(`${award.issuer}${award.date ? ' | ' + award.date : ''}`, leftMargin, y);
        y += 5;
      }

      if (award.description) {
        const descLines = doc.splitTextToSize(award.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      y += 5;
    });
  }
}

function renderATSTemplate(doc: jsPDF, cvData: CVData) {
  // ATS-friendly: Simple, no graphics, left-aligned, standard fonts
  const leftMargin = 20;
  let y = 20;

  const checkNewPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text(cvData.personalInfo.fullName.toUpperCase(), leftMargin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text(cvData.personalInfo.email || '', leftMargin, y);
  y += 5;
  doc.text(cvData.personalInfo.phone || '', leftMargin, y);
  y += 5;
  doc.text(cvData.personalInfo.location || '', leftMargin, y);
  y += 10;

  // Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('PROFESSIONAL SUMMARY', leftMargin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(cvData.personalInfo.summary, 170);
    doc.text(lines, leftMargin, y);
    y += lines.length * 5 + 8;
  }

  // Experience
  if (cvData.experiences.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('WORK EXPERIENCE', leftMargin, y);
    y += 8;

    cvData.experiences.forEach(exp => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(exp.position, leftMargin, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.text(exp.company, leftMargin, y);
      y += 5;
      doc.text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, leftMargin, y);
      y += 6;

      if (exp.achievements) {
        exp.achievements.forEach(ach => {
          const achLines = doc.splitTextToSize(`- ${ach}`, 165);
          doc.text(achLines, leftMargin + 3, y);
          y += achLines.length * 5;
          checkNewPage();
        });
      }
      y += 6;
    });
  }

  // Education
  if (cvData.education.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('EDUCATION', leftMargin, y);
    y += 8;

    cvData.education.forEach(edu => {
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(`${edu.degree}${edu.field ? ' in ' + edu.field : ''}`, leftMargin, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.text(edu.school, leftMargin, y);
      y += 5;
      doc.text(`${edu.startDate} - ${edu.endDate}`, leftMargin, y);
      y += 8;
      checkNewPage();
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('SKILLS', leftMargin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    const skillNames = cvData.skills.map(s => s.name).join(', ');
    const skillLines = doc.splitTextToSize(skillNames, 170);
    doc.text(skillLines, leftMargin, y);
    y += skillLines.length * 5 + 8;
  }

  // Projects
  if (cvData.projects && cvData.projects.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('PROJECTS', leftMargin, y);
    y += 8;

    cvData.projects.forEach(project => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(project.name, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      if (project.startDate || project.endDate) {
        const dateRange = [project.startDate, project.endDate].filter(Boolean).join(' - ');
        doc.text(dateRange, leftMargin, y);
        y += 5;
      }

      if (project.description) {
        const descLines = doc.splitTextToSize(`- ${project.description}`, 165);
        doc.text(descLines, leftMargin + 3, y);
        y += descLines.length * 5;
      }

      if (project.technologies && project.technologies.length > 0) {
        const techText = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : project.technologies;
        const techLines = doc.splitTextToSize(`Technologies: ${techText}`, 165);
        doc.text(techLines, leftMargin + 3, y);
        y += techLines.length * 5;
      }

      y += 6;
    });
  }

  // Awards
  if (cvData.awards && cvData.awards.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('AWARDS & HONORS', leftMargin, y);
    y += 8;

    cvData.awards.forEach(award => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(award.title, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      if (award.issuer) {
        doc.text(`${award.issuer}${award.date ? ' | ' + award.date : ''}`, leftMargin, y);
        y += 5;
      }

      if (award.description) {
        const descLines = doc.splitTextToSize(`- ${award.description}`, 165);
        doc.text(descLines, leftMargin + 3, y);
        y += descLines.length * 5;
      }

      y += 6;
    });
  }
}

function renderCreativeTemplate(doc: jsPDF, cvData: CVData) {
  // Creative template with vibrant colors and modern design
  const accentColor: [number, number, number] = [255, 87, 34]; // Orange
  const leftMargin = 20;
  const contentWidth = 170;
  let y = 20;

  const checkNewPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Creative header with gradient effect (simulated with overlapping rects)
  doc.setFillColor(...accentColor);
  doc.rect(0, 0, 210, 60, 'F');
  doc.setFillColor(accentColor[0] - 30, accentColor[1] - 30, accentColor[2] - 30);
  doc.rect(0, 40, 210, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.fullName, leftMargin, 30);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.personalInfo.title || '', leftMargin, 42);

  doc.setFontSize(10);
  const contact = [cvData.personalInfo.email, cvData.personalInfo.phone, cvData.personalInfo.location].filter(Boolean).join(' | ');
  doc.text(contact, leftMargin, 52);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  y = 70;

  // Summary with side accent
  if (cvData.personalInfo.summary) {
    doc.setFillColor(...accentColor);
    doc.rect(leftMargin - 5, y - 3, 3, 15, 'F');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, contentWidth - 10);
    doc.text(summaryLines, leftMargin + 5, y);
    y += summaryLines.length * 5 + 12;
  }

  // Experience
  if (cvData.experiences.length > 0) {
    checkNewPage();
    doc.setFillColor(...accentColor);
    doc.rect(leftMargin, y, 40, 2, 'F');
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text('EXPERIENCE', leftMargin, y);
    doc.setTextColor(0, 0, 0);
    y += 10;

    cvData.experiences.forEach(exp => {
      checkNewPage();
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, leftMargin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, leftMargin, y);
      y += 6;

      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          const bulletLines = doc.splitTextToSize(`• ${achievement}`, contentWidth - 5);
          doc.text(bulletLines, leftMargin + 3, y);
          y += bulletLines.length * 5;
          checkNewPage();
        });
      }
      y += 6;
    });
  }

  // Education
  if (cvData.education.length > 0) {
    checkNewPage();
    doc.setFillColor(...accentColor);
    doc.rect(leftMargin, y, 40, 2, 'F');
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text('EDUCATION', leftMargin, y);
    doc.setTextColor(0, 0, 0);
    y += 10;

    cvData.education.forEach(edu => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field ? ' in ' + edu.field : ''}`, leftMargin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.school} | ${edu.startDate} - ${edu.endDate}`, leftMargin, y);
      y += 10;
      checkNewPage();
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    checkNewPage();
    doc.setFillColor(...accentColor);
    doc.rect(leftMargin, y, 40, 2, 'F');
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text('SKILLS', leftMargin, y);
    doc.setTextColor(0, 0, 0);
    y += 10;

    const skillsByCategory: Record<string, string[]> = {};
    cvData.skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill.name);
    });

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category}:`, leftMargin, y);
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.join(', ');
      const skillLines = doc.splitTextToSize(skillsText, contentWidth - 30);
      doc.text(skillLines, leftMargin + 30, y);
      y += skillLines.length * 5 + 3;
      checkNewPage();
    });
  }

  // Projects
  if (cvData.projects && cvData.projects.length > 0) {
    checkNewPage();
    doc.setFillColor(...accentColor);
    doc.rect(leftMargin, y, 40, 2, 'F');
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text('PROJECTS', leftMargin, y);
    doc.setTextColor(0, 0, 0);
    y += 10;

    cvData.projects.forEach(project => {
      checkNewPage();
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, leftMargin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (project.startDate || project.endDate) {
        const dateRange = [project.startDate, project.endDate].filter(Boolean).join(' - ');
        doc.text(dateRange, leftMargin, y);
        y += 5;
      }

      if (project.description) {
        const descLines = doc.splitTextToSize(project.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        const techText = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : project.technologies;
        const techLines = doc.splitTextToSize(`Technologies: ${techText}`, contentWidth);
        doc.text(techLines, leftMargin, y);
        y += techLines.length * 4.5;
      }

      y += 6;
    });
  }

  // Awards
  if (cvData.awards && cvData.awards.length > 0) {
    checkNewPage();
    doc.setFillColor(...accentColor);
    doc.rect(leftMargin, y, 40, 2, 'F');
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text('AWARDS & HONORS', leftMargin, y);
    doc.setTextColor(0, 0, 0);
    y += 10;

    cvData.awards.forEach(award => {
      checkNewPage();
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(award.title, leftMargin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (award.issuer) {
        doc.text(`${award.issuer}${award.date ? ' | ' + award.date : ''}`, leftMargin, y);
        y += 5;
      }

      if (award.description) {
        const descLines = doc.splitTextToSize(award.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      y += 6;
    });
  }
}

function renderProfessionalTemplate(doc: jsPDF, cvData: CVData) {
  // Professional template - clean, formal, and detailed
  const leftMargin = 20;
  const contentWidth = 170;
  let y = 20;

  const checkNewPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Professional header
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.fullName, leftMargin, y);
  y += 8;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text(cvData.personalInfo.title || '', leftMargin, y);
  y += 7;

  // Contact line with separator
  doc.setFontSize(10);
  const contactParts = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location
  ].filter(Boolean);
  doc.text(contactParts.join('  •  '), leftMargin, y);
  y += 5;

  // Horizontal line separator
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 8;

  // Professional Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL SUMMARY', leftMargin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, contentWidth);
    doc.text(summaryLines, leftMargin, y);
    y += summaryLines.length * 5 + 10;
  }

  // Professional Experience
  if (cvData.experiences.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL EXPERIENCE', leftMargin, y);
    y += 8;

    cvData.experiences.forEach(exp => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.position, leftMargin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(exp.company, leftMargin, y);
      
      doc.setFont('helvetica', 'normal');
      const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, leftMargin + contentWidth - dateWidth, y);
      y += 6;

      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          const bulletLines = doc.splitTextToSize(`• ${achievement}`, contentWidth - 5);
          doc.text(bulletLines, leftMargin + 3, y);
          y += bulletLines.length * 5;
          checkNewPage();
        });
      }
      y += 6;
    });
  }

  // Education
  if (cvData.education.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', leftMargin, y);
    y += 8;

    cvData.education.forEach(edu => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree}${edu.field ? ' in ' + edu.field : ''}`, leftMargin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(edu.school, leftMargin, y);
      
      doc.setFont('helvetica', 'normal');
      const dateText = `${edu.startDate} - ${edu.endDate}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, leftMargin + contentWidth - dateWidth, y);
      y += 10;
      checkNewPage();
    });
  }

  // Core Competencies / Skills
  if (cvData.skills.length > 0) {
    checkNewPage();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CORE COMPETENCIES', leftMargin, y);
    y += 8;

    const skillsByCategory: Record<string, string[]> = {};
    cvData.skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill.name);
    });

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category}:`, leftMargin, y);
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.join(', ');
      const skillLines = doc.splitTextToSize(skillsText, contentWidth - 35);
      doc.text(skillLines, leftMargin + 35, y);
      y += skillLines.length * 5 + 3;
      checkNewPage();
    });
  }

  // Key Projects
  if (cvData.projects && cvData.projects.length > 0) {
    checkNewPage();
    y += 3;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('KEY PROJECTS', leftMargin, y);
    y += 8;

    cvData.projects.forEach(project => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, leftMargin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (project.startDate || project.endDate) {
        const dateRange = [project.startDate, project.endDate].filter(Boolean).join(' - ');
        doc.text(dateRange, leftMargin, y);
        y += 5;
      }

      if (project.description) {
        const descLines = doc.splitTextToSize(project.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        const techText = Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : project.technologies;
        const techLines = doc.splitTextToSize(`Technologies: ${techText}`, contentWidth);
        doc.text(techLines, leftMargin, y);
        y += techLines.length * 4.5;
      }

      y += 6;
    });
  }

  // Honors & Awards
  if (cvData.awards && cvData.awards.length > 0) {
    checkNewPage();
    y += 3;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('HONORS & AWARDS', leftMargin, y);
    y += 8;

    cvData.awards.forEach(award => {
      checkNewPage();
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(award.title, leftMargin, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (award.issuer) {
        doc.setFont('helvetica', 'italic');
        doc.text(award.issuer, leftMargin, y);
        
        if (award.date) {
          doc.setFont('helvetica', 'normal');
          const dateWidth = doc.getTextWidth(award.date);
          doc.text(award.date, leftMargin + contentWidth - dateWidth, y);
        }
        y += 5;
      }

      if (award.description) {
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(award.description, contentWidth);
        doc.text(descLines, leftMargin, y);
        y += descLines.length * 5;
      }

      y += 6;
    });
  }
}

async function exportToDOCX(cvData: CVData, template: CVTemplate, sectionOrder?: SectionOrderItem[]): Promise<Blob> {
  console.log('[Export Service] Creating DOCX document...');

  const children: Paragraph[] = [];

  // ===== HEADER - Name & Title =====
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cvData.personalInfo.fullName,
          bold: true,
          size: 48, // 24pt
          font: 'Calibri'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );

  if (cvData.personalInfo.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.personalInfo.title,
            size: 28, // 14pt
            font: 'Calibri',
            color: '666666'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );
  }

  // Contact info line
  const contactParts = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 20, // 10pt
            font: 'Calibri'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
  }

  // Links line
  const linkParts = [
    cvData.personalInfo.linkedin ? `LinkedIn: ${cvData.personalInfo.linkedin}` : '',
    cvData.personalInfo.github ? `GitHub: ${cvData.personalInfo.github}` : '',
    cvData.personalInfo.website ? `Website: ${cvData.personalInfo.website}` : ''
  ].filter(Boolean);

  if (linkParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: linkParts.join('  |  '),
            size: 18, // 9pt
            font: 'Calibri',
            color: '0066CC'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      })
    );
  }

  // Divider
  children.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' }
      },
      spacing: { after: 300 }
    })
  );

  // Helper functions to render each section
  const renderSummary = () => {
    if (cvData.personalInfo.summary) {
      children.push(createSectionHeader('PROFESSIONAL SUMMARY'));
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.personalInfo.summary,
              size: 22, // 11pt
              font: 'Calibri'
            })
          ],
          spacing: { after: 300 }
        })
      );
    }
  };

  const renderExperience = () => {
    if (cvData.experiences && cvData.experiences.length > 0) {
      children.push(createSectionHeader('WORK EXPERIENCE'));
      
      cvData.experiences.forEach((exp, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              new TextRun({
                text: `\t${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 200 : 0 }
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company,
                italics: true,
                size: 22,
                font: 'Calibri'
              }),
              exp.location ? new TextRun({
                text: ` | ${exp.location}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            spacing: { after: 100 }
          })
        );

        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(achievement => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 21,
                    font: 'Calibri'
                  })
                ],
                indent: { left: convertInchesToTwip(0.25) },
                spacing: { after: 60 }
              })
            );
          });
        }
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderEducation = () => {
    if (cvData.education && cvData.education.length > 0) {
      children.push(createSectionHeader('EDUCATION'));
      
      cvData.education.forEach((edu, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ' in ' + edu.field : ''}`,
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              new TextRun({
                text: `\t${edu.startDate} - ${edu.endDate}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 150 : 0 }
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.school,
                italics: true,
                size: 22,
                font: 'Calibri'
              }),
              edu.gpa ? new TextRun({
                text: ` | GPA: ${edu.gpa}`,
                size: 20,
                font: 'Calibri'
              }) : new TextRun({ text: '' })
            ],
            spacing: { after: 100 }
          })
        );
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderSkills = () => {
    if (cvData.skills && cvData.skills.length > 0) {
      children.push(createSectionHeader('SKILLS'));

      const skillsByCategory: Record<string, string[]> = {};
      cvData.skills.forEach(skill => {
        const cat = skill.category || 'General';
        if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
        skillsByCategory[cat].push(skill.name);
      });

      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${category}: `,
                bold: true,
                size: 22,
                font: 'Calibri'
              }),
              new TextRun({
                text: skills.join(', '),
                size: 22,
                font: 'Calibri'
              })
            ],
            spacing: { after: 80 }
          })
        );
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderProjects = () => {
    if (cvData.projects && cvData.projects.length > 0) {
      children.push(createSectionHeader('PROJECTS'));
      
      cvData.projects.forEach((project, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              project.startDate ? new TextRun({
                text: `\t${project.startDate}${project.endDate ? ' - ' + project.endDate : ''}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 150 : 0 }
          })
        );

        if (project.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 21,
                  font: 'Calibri'
                })
              ],
              spacing: { after: 60 }
            })
          );
        }

        if (project.technologies && project.technologies.length > 0) {
          const techText = Array.isArray(project.technologies) 
            ? project.technologies.join(', ') 
            : project.technologies;
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Technologies: ',
                  bold: true,
                  size: 20,
                  font: 'Calibri'
                }),
                new TextRun({
                  text: techText,
                  size: 20,
                  font: 'Calibri',
                  color: '0066CC'
                })
              ],
              spacing: { after: 100 }
            })
          );
        }
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderAwards = () => {
    if (cvData.awards && cvData.awards.length > 0) {
      children.push(createSectionHeader('AWARDS & HONORS'));
      
      cvData.awards.forEach((award, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: award.title,
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              award.date ? new TextRun({
                text: `\t${award.date}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 150 : 0 }
          })
        );

        if (award.issuer) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: award.issuer,
                  italics: true,
                  size: 22,
                  font: 'Calibri'
                })
              ]
            })
          );
        }

        if (award.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: award.description,
                  size: 21,
                  font: 'Calibri'
                })
              ],
              spacing: { after: 100 }
            })
          );
        }
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderCertifications = () => {
    if (cvData.certifications && cvData.certifications.length > 0) {
      children.push(createSectionHeader('CERTIFICATIONS'));
      
      cvData.certifications.forEach((cert, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              cert.date ? new TextRun({
                text: `\t${cert.date}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 100 : 0 }
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.issuer,
                italics: true,
                size: 22,
                font: 'Calibri'
              }),
              cert.credentialId ? new TextRun({
                text: ` | ID: ${cert.credentialId}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            spacing: { after: 80 }
          })
        );
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderLanguages = () => {
    if (cvData.languages && cvData.languages.length > 0) {
      children.push(createSectionHeader('LANGUAGES'));
      
      const langText = cvData.languages
        .map(lang => `${lang.name} (${lang.proficiency})`)
        .join('  •  ');

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: langText,
              size: 22,
              font: 'Calibri'
            })
          ],
          spacing: { after: 200 }
        })
      );
    }
  };

  const renderPublications = () => {
    if (cvData.publications && cvData.publications.length > 0) {
      children.push(createSectionHeader('PUBLICATIONS'));
      
      cvData.publications.forEach((pub, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: pub.title,
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              pub.date ? new TextRun({
                text: `\t${pub.date}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 150 : 0 }
          })
        );

        if (pub.publisher) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: pub.publisher,
                  italics: true,
                  size: 22,
                  font: 'Calibri'
                })
              ]
            })
          );
        }

        if (pub.authors && pub.authors.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Authors: ',
                  bold: true,
                  size: 20,
                  font: 'Calibri'
                }),
                new TextRun({
                  text: pub.authors.join(', '),
                  size: 20,
                  font: 'Calibri'
                })
              ],
              spacing: { after: 80 }
            })
          );
        }
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderVolunteer = () => {
    if (cvData.volunteer && cvData.volunteer.length > 0) {
      children.push(createSectionHeader('VOLUNTEER EXPERIENCE'));
      
      cvData.volunteer.forEach((vol, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: vol.role || 'Volunteer',
                bold: true,
                size: 24,
                font: 'Calibri'
              }),
              new TextRun({
                text: `\t${vol.startDate}${vol.endDate ? ' - ' + vol.endDate : ' - Present'}`,
                size: 20,
                font: 'Calibri',
                color: '666666'
              })
            ],
            tabStops: [{ type: 'right', position: convertInchesToTwip(6.5) }],
            spacing: { before: idx > 0 ? 150 : 0 }
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: vol.organization,
                italics: true,
                size: 22,
                font: 'Calibri'
              })
            ]
          })
        );

        if (vol.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: vol.description,
                  size: 21,
                  font: 'Calibri'
                })
              ],
              spacing: { after: 100 }
            })
          );
        }
      });

      children.push(new Paragraph({ spacing: { after: 200 } }));
    }
  };

  const renderReferences = () => {
    if (cvData.references && cvData.references.length > 0) {
      children.push(createSectionHeader('REFERENCES'));
      
      cvData.references.forEach((ref, idx) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: ref.name,
                bold: true,
                size: 24,
                font: 'Calibri'
              })
            ],
            spacing: { before: idx > 0 ? 150 : 0 }
          })
        );

        const refDetails = [
          ref.title,
          ref.company,
          ref.relationship
        ].filter(Boolean).join(' | ');

        if (refDetails) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: refDetails,
                  italics: true,
                  size: 22,
                  font: 'Calibri'
                })
              ]
            })
          );
        }

        const contactInfo = [
          ref.email,
          ref.phone
        ].filter(Boolean).join('  •  ');

        if (contactInfo) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: contactInfo,
                  size: 20,
                  font: 'Calibri',
                  color: '0066CC'
                })
              ],
              spacing: { after: 100 }
            })
          );
        }
      });
    }
  };

  // Map section IDs to render functions
  const sectionRenderers: Record<string, () => void> = {
    'summary': renderSummary,
    'experience': renderExperience,
    'education': renderEducation,
    'skills': renderSkills,
    'projects': renderProjects,
    'awards': renderAwards,
    'certifications': renderCertifications,
    'languages': renderLanguages,
    'publications': renderPublications,
    'volunteer': renderVolunteer,
    'references': renderReferences
  };

  // Render sections based on sectionOrder if provided
  if (sectionOrder && sectionOrder.length > 0) {
    sectionOrder.forEach(section => {
      if (section.visible && sectionRenderers[section.id]) {
        sectionRenderers[section.id]();
      }
    });
  } else {
    // Default order if sectionOrder not provided
    renderSummary();
    renderExperience();
    renderEducation();
    renderSkills();
    renderProjects();
    renderAwards();
    renderCertifications();
    renderLanguages();
    renderPublications();
    renderVolunteer();
    renderReferences();
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.75),
            bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(0.75),
            right: convertInchesToTwip(0.75)
          }
        }
      },
      children: children
    }]
  });

  // Generate blob
  const blob = await Packer.toBlob(doc);
  console.log('[Export Service] ✓ DOCX document created successfully');
  
  return blob;
}

// Helper function to create section headers
function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26, // 13pt
        font: 'Calibri',
        color: '333333'
      })
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '999999' }
    },
    spacing: { before: 200, after: 150 }
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
