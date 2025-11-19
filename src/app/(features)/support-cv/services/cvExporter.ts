// CV Export Service - Export to PDF and DOCX with templates

import { CVData, CVTemplate, ExportFormat } from '@/app/(features)/support-cv/types/cv.types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportCV(
  cvData: CVData,
  template: CVTemplate,
  format: ExportFormat,
  htmlElement?: HTMLElement
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
    return await exportToDOCX(cvData, template);
  }
}

async function exportFromHTML(element: HTMLElement): Promise<Blob> {
  console.log('[Export Service] Converting HTML to PDF...');
  
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width
  container.style.background = 'white';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Capture with high quality
    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96dpi (210mm)
      windowWidth: 794
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    console.log('[Export Service] ✓ HTML to PDF conversion complete');
    return pdf.output('blob');
  } finally {
    // Clean up
    document.body.removeChild(container);
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

async function exportToDOCX(cvData: CVData, template: CVTemplate): Promise<Blob> {
  // For DOCX export, we'll use docx library
  // This is a placeholder - you'll need to install 'docx' package
  console.log('[Export Service] DOCX export not yet fully implemented');
  
  // For now, return a text blob as placeholder
  const textContent = `
${cvData.personalInfo.fullName}
${cvData.personalInfo.title}
${cvData.personalInfo.email} | ${cvData.personalInfo.phone}

PROFESSIONAL SUMMARY
${cvData.personalInfo.summary || ''}

EXPERIENCE
${cvData.experiences.map(exp => `
${exp.position} at ${exp.company}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.achievements?.map(a => `• ${a}`).join('\n') || ''}
`).join('\n')}

EDUCATION
${cvData.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.school}, ${edu.startDate} - ${edu.endDate}
`).join('\n')}

SKILLS
${cvData.skills.map(s => s.name).join(', ')}
  `;

  return new Blob([textContent], { type: 'text/plain' });
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
