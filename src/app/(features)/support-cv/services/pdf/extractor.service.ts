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

      // Use the wrapper utility to avoid direct pdfjs-dist import
      const { extractTextFromPDF } = await import('@/lib/pdf-utils.client');
      const text = await extractTextFromPDF(file);

      console.log('═══════════════════════════════════════════════════');
      console.log('📄 PDF TEXT EXTRACTED:');
      console.log('═══════════════════════════════════════════════════');
      console.log(text);
      console.log('═══════════════════════════════════════════════════');
      console.log(`Total length: ${text.length} characters`);
      console.log('Line breaks count:', (text.match(/\n/g) || []).length);
      console.log('First 500 chars (with escapes):', JSON.stringify(text.substring(0, 500)));
      console.log('═══════════════════════════════════════════════════');

      // Estimate page count from text length
      const estimatedPageCount = Math.ceil(text.length / 2000);

      const result: PDFExtractionResult = {
        text: this.cleanText(text),
        pageCount: estimatedPageCount,
        metadata: {
          title: file.name.replace('.pdf', ''),
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
