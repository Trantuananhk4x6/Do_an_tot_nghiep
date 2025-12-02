// Client-side only PDF utilities using PDF.js from CDN
// This avoids the canvas dependency issue

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

let pdfjsLoaded = false;

async function loadPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be loaded in browser');
  }

  if (pdfjsLoaded && window.pdfjsLib) {
    return window.pdfjsLib;
  }

  // Load PDF.js from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        pdfjsLoaded = true;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('Failed to load PDF.js'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js script'));
    document.head.appendChild(script);
  });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction must run on client-side');
  }

  try {
    const pdfjsLib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Build text with proper line detection
        let lastY: number | null = null;
        let pageText = '';
        
        for (const item of textContent.items) {
          if (!('str' in item) || !item.str) continue;
          
          // Check if this is a new line (Y position changed significantly)
          // PDF coordinates have Y increasing upward, so different Y = new line
          const currentY = item.transform ? item.transform[5] : null;
          
          if (lastY !== null && currentY !== null) {
            const yDiff = Math.abs(lastY - currentY);
            // If Y changed by more than 3 units, it's a new line
            if (yDiff > 3) {
              pageText += '\n';
            } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
              // Same line, add space between items
              pageText += ' ';
            }
          }
          
          pageText += item.str;
          lastY = currentY;
        }

        fullText += pageText + '\n\n'; // Double newline between pages
      } catch (pageErr) {
        console.error(`Error reading page ${pageNum}:`, pageErr);
      }
    }

    // Clean up extra whitespace while preserving line structure
    return fullText
      .replace(/[ \t]+/g, ' ')     // Multiple spaces to single space
      .replace(/ \n/g, '\n')       // Remove trailing spaces before newlines  
      .replace(/\n /g, '\n')       // Remove leading spaces after newlines
      .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
      .trim();
  } catch (err) {
    console.error('Error extracting PDF:', err);
    throw new Error('Cannot extract content from PDF file');
  }
}
