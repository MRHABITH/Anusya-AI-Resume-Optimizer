import PDFParser from 'pdf2json';
import mammoth from 'mammoth';

export async function parseResume(file: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const pdfParser = new PDFParser(null, 1);

      return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          resolve(pdfParser.getRawTextContent());
        });

        // pdf2json expects a buffer but parseBuffer is not directly available on the instance in all versions?
        // Actually it is.
        pdfParser.parseBuffer(file);
      });
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: file });
      return result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume content: ' + (error instanceof Error ? error.message : String(error)));
  }
}
