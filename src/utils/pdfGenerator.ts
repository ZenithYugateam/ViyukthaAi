import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CandidateReport } from '@/data/candidateAnalytics';

export const generateResumePDF = async (elementId: string, fileName: string = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    // Wait for fonts and images to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));

    // Capture the element as canvas with high quality
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.position = 'relative';
        }
      },
    });

    // Calculate dimensions for PDF (Letter size: 8.5 x 11 inches)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateResumeBlob = async (elementId: string): Promise<Blob> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    // Wait for fonts and images to load
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.position = 'relative';
        }
      },
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw error;
  }
};

export const generateCandidateReportPDF = (report: CandidateReport): void => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;
    const lineHeight = 7;
    const sectionSpacing = 10;

    // Helper function to add new page if needed
    const checkNewPage = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * (fontSize * 0.4);
    };

    // Header
    pdf.setFillColor(30, 58, 138); // Blue background
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Candidate Interview Report', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 35);
    
    yPos = 50;
    pdf.setTextColor(0, 0, 0);

    // Candidate Information Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Candidate Information', margin, yPos);
    yPos += lineHeight + 2;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPos += addText(`Name: ${report.candidateName}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Email: ${report.candidateEmail}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Job Title: ${report.jobTitle}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Interview Date: ${report.interviewDate}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Duration: ${report.interviewDuration}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    
    // Status badge
    const statusColors: Record<string, [number, number, number]> = {
      'Selected': [34, 197, 94],
      'Rejected': [239, 68, 68],
      'Pending': [251, 191, 36],
      'On Hold': [156, 163, 175],
    };
    const statusColor = statusColors[report.status] || [156, 163, 175];
    pdf.setFillColor(...statusColor);
    pdf.roundedRect(margin, yPos - 5, 30, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(report.status, margin + 2, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += sectionSpacing + 5;

    // Overall Score Section
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Overall Performance', margin, yPos);
    yPos += lineHeight + 2;

    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    const scoreColor = report.overallScore >= 80 ? [34, 197, 94] : report.overallScore >= 60 ? [251, 191, 36] : [239, 68, 68];
    pdf.setTextColor(...scoreColor);
    pdf.text(`${report.overallScore}%`, margin, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += lineHeight + 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPos += addText(`Total Questions: ${report.totalQuestions}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Correct Answers: ${report.correctAnswers}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Partially Correct: ${report.partiallyCorrect}`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Wrong Answers: ${report.wrongAnswers}`, margin, yPos, pageWidth - 2 * margin);
    yPos += sectionSpacing;

    // Skills Assessment Section
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Skills Assessment', margin, yPos);
    yPos += lineHeight + 2;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Technical Skills:', margin, yPos);
    yPos += lineHeight;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    report.technicalSkills.forEach((skill) => {
      checkNewPage(10);
      const barWidth = 100;
      const barHeight = 5;
      const barX = margin + 50;
      const scorePercent = (skill.rating / skill.maxRating) * 100;
      
      pdf.text(`${skill.skill}:`, margin, yPos);
      pdf.setFillColor(200, 200, 200);
      pdf.rect(barX, yPos - 4, barWidth, barHeight, 'F');
      pdf.setFillColor(30, 58, 138);
      pdf.rect(barX, yPos - 4, (barWidth * scorePercent) / 100, barHeight, 'F');
      pdf.text(`${skill.rating}/${skill.maxRating}`, barX + barWidth + 5, yPos);
      yPos += lineHeight + 2;
    });

    yPos += 3;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Soft Skills:', margin, yPos);
    yPos += lineHeight;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    report.softSkills.forEach((skill) => {
      checkNewPage(10);
      const barWidth = 100;
      const barHeight = 5;
      const barX = margin + 50;
      const scorePercent = (skill.rating / skill.maxRating) * 100;
      
      pdf.text(`${skill.skill}:`, margin, yPos);
      pdf.setFillColor(200, 200, 200);
      pdf.rect(barX, yPos - 4, barWidth, barHeight, 'F');
      pdf.setFillColor(30, 58, 138);
      pdf.rect(barX, yPos - 4, (barWidth * scorePercent) / 100, barHeight, 'F');
      pdf.text(`${skill.rating}/${skill.maxRating}`, barX + barWidth + 5, yPos);
      yPos += lineHeight + 2;
    });

    yPos += sectionSpacing;

    // Communication Analysis
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Communication Analysis', margin, yPos);
    yPos += lineHeight + 2;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPos += addText(`Communication Score: ${report.communicationScore}%`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Confidence Level: ${report.confidence}%`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Clarity: ${report.clarity}%`, margin, yPos, pageWidth - 2 * margin);
    yPos += lineHeight;
    yPos += addText(`Pace: ${report.pace}%`, margin, yPos, pageWidth - 2 * margin);
    yPos += sectionSpacing;

    // AI Summary
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI Assessment Summary', margin, yPos);
    yPos += lineHeight + 2;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const summaryHeight = addText(report.aiSummary, margin, yPos, pageWidth - 2 * margin);
    yPos += summaryHeight + sectionSpacing;

    // Strengths
    if (report.strengths && report.strengths.length > 0) {
      checkNewPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(34, 197, 94);
      pdf.text('Strengths', margin, yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      report.strengths.forEach((strength) => {
        checkNewPage(8);
        pdf.text(`• ${strength}`, margin + 5, yPos);
        yPos += lineHeight;
      });
      yPos += sectionSpacing - 5;
    }

    // Areas for Improvement
    if (report.improvements && report.improvements.length > 0) {
      checkNewPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(251, 191, 36);
      pdf.text('Areas for Improvement', margin, yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      report.improvements.forEach((improvement) => {
        checkNewPage(8);
        pdf.text(`• ${improvement}`, margin + 5, yPos);
        yPos += lineHeight;
      });
      yPos += sectionSpacing - 5;
    }

    // Recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      checkNewPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommendations', margin, yPos);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      report.recommendations.forEach((rec) => {
        checkNewPage(8);
        pdf.text(`• ${rec}`, margin + 5, yPos);
        yPos += lineHeight;
      });
      yPos += sectionSpacing - 5;
    }

    // Red Flags
    if (report.redFlags && report.redFlags.length > 0) {
      checkNewPage(30);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(239, 68, 68);
      pdf.text('Red Flags', margin, yPos);
      pdf.setTextColor(0, 0, 0);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      report.redFlags.forEach((flag) => {
        checkNewPage(8);
        pdf.text(`• ${flag}`, margin + 5, yPos);
        yPos += lineHeight;
      });
      yPos += sectionSpacing - 5;
    }

    // Question Analysis
    if (report.questions && report.questions.length > 0) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Question Analysis', margin, yPos);
      yPos += lineHeight + 3;

      report.questions.forEach((question, index) => {
        checkNewPage(50);
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Question ${index + 1}:`, margin, yPos);
        yPos += lineHeight + 1;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const qHeight = addText(question.question, margin + 5, yPos, pageWidth - 2 * margin - 5);
        yPos += qHeight + 3;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Candidate's Answer:`, margin + 5, yPos);
        yPos += lineHeight - 2;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const answerHeight = addText(question.candidateAnswer || 'No answer provided', margin + 10, yPos, pageWidth - 2 * margin - 10);
        yPos += answerHeight + 3;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        const scoreColor = question.score >= 80 ? [34, 197, 94] : question.score >= 60 ? [251, 191, 36] : [239, 68, 68];
        pdf.setTextColor(...scoreColor);
        pdf.text(`Score: ${question.score}%`, margin + 5, yPos);
        pdf.setTextColor(0, 0, 0);
        yPos += lineHeight + 2;

        if (question.feedback) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          const feedbackHeight = addText(`Feedback: ${question.feedback}`, margin + 5, yPos, pageWidth - 2 * margin - 5);
          yPos += feedbackHeight + 3;
        }

        yPos += 5;
      });
    }

    // Behavioral Analysis
    if (report.sentimentAnalysis) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Behavioral Analysis', margin, yPos);
      yPos += lineHeight + 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPos += addText(`Overall Engagement: ${report.sentimentAnalysis.overallEngagement}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Attentiveness: ${report.sentimentAnalysis.attentiveness}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Nervousness Level: ${report.sentimentAnalysis.nervousness}%`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Eye Blink Count: ${report.sentimentAnalysis.eyeBlinkCount}`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Average Blink Rate: ${report.sentimentAnalysis.averageBlinkRate} per minute`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Head Rotations: ${report.sentimentAnalysis.headRotations}`, margin, yPos, pageWidth - 2 * margin);
      yPos += lineHeight;
      yPos += addText(`Look Away Count: ${report.sentimentAnalysis.lookAwayCount}`, margin, yPos, pageWidth - 2 * margin);
    }

    // Footer on last page
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Generate filename
    const fileName = `Candidate_Report_${report.candidateName.replace(/\s+/g, '_')}_${report.interviewDate}.pdf`;
    
    // Save PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating candidate report PDF:', error);
    throw error;
  }
};