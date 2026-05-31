import { jsPDF } from 'jspdf';

/**
 * Downloads a generated interview session as a PDF document.
 */
export const downloadInterviewPDF = (interview) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(11, 19, 38); // Dark Navy
  doc.text('PrepAI Interview Prep Guide', margin, y);
  y += 8;

  // Subtitle Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(105, 110, 130); // Muted grey
  doc.text(`Role: ${interview.role}  |  Level: ${interview.level}  |  Type: ${interview.type}`, margin, y);
  doc.text(`Date: ${interview.date}`, pageWidth - margin - 35, y);
  y += 5;

  // Divider
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Loop through questions
  interview.questions.forEach((q, index) => {
    // Check page boundaries before printing a question block
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(77, 142, 255); // Primary blue
    doc.text(`${q.number} - ${q.difficulty}`, margin, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(11, 19, 38);
    
    // Split long questions to fit width
    const qLines = doc.splitTextToSize(q.question, contentWidth);
    doc.text(qLines, margin, y);
    y += qLines.length * 5 + 2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 65, 80);
    const contextLines = doc.splitTextToSize(`Focus: ${q.context}`, contentWidth);
    doc.text(contextLines, margin, y);
    y += contextLines.length * 5 + 4;

    // AI Recommended Answer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(111, 0, 190); // Secondary Purple
    doc.text('Recommended Answer:', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(40, 40, 50);
    const ansLines = doc.splitTextToSize(q.answer, contentWidth);
    
    // If answer doesn't fit page, break page
    if (y + (ansLines.length * 4.5) > pageHeight - 15) {
      doc.addPage();
      y = 20;
      doc.text(ansLines, margin, y);
      y += (ansLines.length * 4.5) + 12;
    } else {
      doc.text(ansLines, margin, y);
      y += (ansLines.length * 4.5) + 12;
    }
  });

  // Footer page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
    doc.text('© 2026 PrepAI. All rights reserved.', margin, pageHeight - 10);
  }

  doc.save(`PrepAI_Interview_${interview.role.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Downloads a generated cheat sheet as a PDF document.
 */
export const downloadCheatsheetPDF = (cheatsheet) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(11, 19, 38);
  doc.text(`PrepAI Cheat Sheet: ${cheatsheet.tech}`, margin, y);
  y += 8;

  // Subtitle Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(105, 110, 130);
  doc.text(`Difficulty: ${cheatsheet.difficulty}  |  Version: ${cheatsheet.version}`, margin, y);
  doc.text(`Date: ${cheatsheet.date}`, pageWidth - margin - 35, y);
  y += 5;

  // Divider
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Render markdown text lines simply (stripping core formatting for clean display)
  const plainText = cheatsheet.content
    .replace(/#/g, '')
    .replace(/`/g, '')
    .replace(/\*/g, '')
    .split('\n');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(40, 40, 50);

  plainText.forEach((line) => {
    if (!line.trim()) {
      y += 4;
      return;
    }

    // Check if header line (was marked with #)
    const isHeading = line.startsWith(' ') || line.trim() === cheatsheet.title;
    
    if (isHeading) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(11, 19, 38);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(60, 65, 80);
    }

    const lines = doc.splitTextToSize(line.trim(), contentWidth);
    
    if (y + (lines.length * 5) > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, margin, y);
    y += (lines.length * 5) + 2;
  });

  // Footer page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
    doc.text('© 2026 PrepAI. All rights reserved.', margin, pageHeight - 10);
  }

  doc.save(`PrepAI_Cheatsheet_${cheatsheet.tech.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Downloads a generated resume analysis report as a PDF document.
 */
export const downloadResumeReportPDF = (analysis) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(11, 19, 38);
  doc.text('PrepAI Resume ATS Report', margin, y);
  y += 8;

  // Subtitle Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(105, 110, 130);
  doc.text(`ATS Score: ${analysis.atsScore}%  |  Rating: ${analysis.atsScore >= 80 ? 'Excellent' : 'Good'}`, margin, y);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 35, y);
  y += 5;

  // Divider
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // AI Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(77, 142, 255); // Primary Accent
  doc.text('AI Professional Summary', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 65, 80);
  const summaryLines = doc.splitTextToSize(analysis.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 8;

  // Identified Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 19, 38);
  doc.text('Identified Strengths & Skills', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 65, 80);
  const skillsText = analysis.identifiedSkills.join(', ');
  const skillsLines = doc.splitTextToSize(skillsText, contentWidth);
  doc.text(skillsLines, margin, y);
  y += skillsLines.length * 4.5 + 8;

  // Missing Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(239, 68, 68); // Red
  doc.text('Missing Keywords & Gaps', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 65, 80);
  const missingText = analysis.missingSkills.length > 0 ? analysis.missingSkills.join(', ') : 'No critical skill gaps identified!';
  const missingLines = doc.splitTextToSize(missingText, contentWidth);
  doc.text(missingLines, margin, y);
  y += missingLines.length * 4.5 + 8;

  // Actionable tips
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(111, 0, 190); // Purple
  doc.text('ATS Actionable Optimization Tips', margin, y);
  y += 6;

  analysis.tips.forEach((tip, idx) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(11, 19, 38);
    doc.text(`${idx + 1}. ${tip.title}`, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(60, 65, 80);
    const tipLines = doc.splitTextToSize(tip.detail, contentWidth);
    doc.text(tipLines, margin, y);
    y += tipLines.length * 4.5 + 6;
  });

  // Footer page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
    doc.text('© 2026 PrepAI. All rights reserved.', margin, pageHeight - 10);
  }

  doc.save(`PrepAI_ATS_Resume_Report.pdf`);
};
