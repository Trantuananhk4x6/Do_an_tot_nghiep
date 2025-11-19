// ============================================================================
// PDF Extractor Service - Clean implementation
// ============================================================================

import { Result, Ok, Err } from '../../lib/result';
import { PDFExtractionError } from '../../lib/errors';

// ============================================================================
// Types
// ============================================================================

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: Date;
  };
}

// ============================================================================
// Service Class
// ============================================================================

class PDFExtractorService {
  async extractText(file: File): Promise<Result<PDFExtractionResult, Error>> {
    // Client-side only
    if (typeof window === 'undefined') {
      return Err(new PDFExtractionError('PDF extraction must run on client-side'));
    }

    try {
      console.log('[PDF Extractor] Starting extraction:', file.name);

      // Dynamically import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`[PDF Extractor] Loaded PDF: ${pdf.numPages} pages`);

      // Extract text from all pages with better formatting
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Build text with proper line breaks based on Y coordinates
        let lastY = -1;
        let pageText = '';
        
        for (const item of textContent.items) {
          const textItem = item as any;
          const currentY = textItem.transform[5]; // Y coordinate
          
          // If Y changed significantly, it's a new line
          if (lastY !== -1 && Math.abs(currentY - lastY) > 2) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ')) {
            // Same line, add space if needed
            pageText += ' ';
          }
          
          pageText += textItem.str;
          lastY = currentY;
        }

        fullText += pageText + '\n\n';
      }

    console.log('═══════════════════════════════════════════════════');
    console.log('📄 PDF TEXT EXTRACTED (pdfjs-dist):');
    console.log('═══════════════════════════════════════════════════');
    console.log(fullText); // Display text
    console.log('═══════════════════════════════════════════════════');
    console.log(`Total length: ${fullText.length} characters`);
    console.log('Line breaks count:', (fullText.match(/\n/g) || []).length);
    console.log('First 500 chars (with escapes):', JSON.stringify(fullText.substring(0, 500)));
    console.log('═══════════════════════════════════════════════════');      // Get metadata
      const metadata = await pdf.getMetadata();

      const info = metadata.info as Record<string, any> | undefined;

      const result: PDFExtractionResult = {
        text: this.cleanText(fullText),
        pageCount: pdf.numPages,
        metadata: {
          title: info?.Title,
          author: info?.Author,
          creationDate: info?.CreationDate 
            ? new Date(info.CreationDate)
            : undefined
        }
      };

      console.log(`[PDF Extractor] ✓ Extracted ${result.text.length} characters`);
      return Ok(result);

    } catch (error: any) {
      console.error('[PDF Extractor] Error:', error);
      return Err(new PDFExtractionError(
        error?.message || 'Failed to extract PDF text'
      ));
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/[ \t]+/g, ' ')    // Multiple spaces/tabs → single space (PRESERVE \n!)
      .replace(/\n{3,}/g, '\n\n') // Multiple newlines → double newline
      .trim();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const pdfExtractor = new PDFExtractorService();
