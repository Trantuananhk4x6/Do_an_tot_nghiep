// CV Export Service - Export to PDF and DOCX with templates

import { CVData, CVTemplate, ExportFormat } from '@/app/(features)/support-cv/types/cv.types';
import jsPDF from 'jspdf';

export async function exportCV(
  cvData: CVData,
  template: CVTemplate,
  format: ExportFormat
): Promise<Blob> {
  console.log(`[Export Service] Exporting CV as ${format} with ${template} template`);

  if (format === 'pdf') {
    return await exportToPDF(cvData, template);
  } else {
    return await exportToDOCX(cvData, template);
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
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPERIENCE', leftMargin, y);
    y += 8;

    cvData.experiences.forEach(exp => {
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
        });
      }
      y += 5;

      // Check if need new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  // Education
  if (cvData.education.length > 0) {
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', leftMargin, y);
    y += 8;

    cvData.education.forEach(edu => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${edu.degree} in ${edu.field}`, leftMargin, y);
      y += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.school} | ${edu.startDate} - ${edu.endDate}`, leftMargin, y);
      y += 8;
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

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
    });
  }
}

function renderModernTemplate(doc: jsPDF, cvData: CVData) {
  // Modern template with color accents
  const primaryColor: [number, number, number] = [41, 128, 185]; // Blue
  const leftMargin = 20;
  let y = 20;

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

  // Rest of content similar to minimal but with colored section headers
  if (cvData.personalInfo.summary) {
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(cvData.personalInfo.summary, 170);
    doc.text(summaryLines, leftMargin, y);
    y += summaryLines.length * 5 + 10;
  }

  // Sections with colored headers
  const sections = [
    { title: 'EXPERIENCE', data: cvData.experiences },
    { title: 'EDUCATION', data: cvData.education },
  ];

  sections.forEach(section => {
    if (section.data.length > 0) {
      doc.setFillColor(...primaryColor);
      doc.setTextColor(255, 255, 255);
      doc.rect(leftMargin, y - 5, 170, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, leftMargin + 2, y);
      doc.setTextColor(0, 0, 0);
      y += 12;

      // Add content (simplified for brevity)
      section.data.forEach((item: any) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(item.position || item.degree || '', leftMargin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(item.company || item.school || '', leftMargin, y);
        y += 10;
      });
    }
  });
}

function renderATSTemplate(doc: jsPDF, cvData: CVData) {
  // ATS-friendly: Simple, no graphics, left-aligned, standard fonts
  const leftMargin = 20;
  let y = 20;

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
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('WORK EXPERIENCE', leftMargin, y);
    y += 8;

    cvData.experiences.forEach(exp => {
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
        });
      }
      y += 6;
    });
  }

  // Simple skills list
  if (cvData.skills.length > 0) {
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text('SKILLS', leftMargin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    const skillNames = cvData.skills.map(s => s.name).join(', ');
    const skillLines = doc.splitTextToSize(skillNames, 170);
    doc.text(skillLines, leftMargin, y);
  }
}

function renderCreativeTemplate(doc: jsPDF, cvData: CVData) {
  // Creative template with colors and design elements
  renderModernTemplate(doc, cvData); // Reuse modern for now
}

function renderProfessionalTemplate(doc: jsPDF, cvData: CVData) {
  // Professional template - clean and formal
  renderMinimalTemplate(doc, cvData); // Reuse minimal for now
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
