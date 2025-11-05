// PDF Extractor Service - Extract text and data from uploaded CV PDF

import { PDFExtractResult } from '@/app/(features)/support-cv/types/cv.types';

export async function extractTextFromPDF(file: File): Promise<PDFExtractResult> {
  try {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return {
        success: false,
        extractedText: '',
        error: 'PDF extraction must run on client-side'
      };
    }

    console.log('[PDF Extractor] Starting extraction for:', file.name);

    // Dynamically import pdfjs-dist only on client-side
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker path (already configured in public/)
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log(`[PDF Extractor] PDF loaded, ${pdf.numPages} pages`);

    // Extract text from all pages
    let extractedText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      extractedText += pageText + '\n\n';
    }

    console.log(`[PDF Extractor] Extracted ${extractedText.length} characters`);

    return {
      success: true,
      extractedText: extractedText.trim()
    };

  } catch (error) {
    console.error('[PDF Extractor] Error:', error);
    return {
      success: false,
      extractedText: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper function to clean extracted text
export function cleanExtractedText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double newline
    .trim();
}
