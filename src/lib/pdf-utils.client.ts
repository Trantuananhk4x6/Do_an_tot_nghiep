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

        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');

        fullText += pageText + '\n';
      } catch (pageErr) {
        console.error(`Error reading page ${pageNum}:`, pageErr);
      }
    }

    return fullText.trim();
  } catch (err) {
    console.error('Error extracting PDF:', err);
    throw new Error('Cannot extract content from PDF file');
  }
}
