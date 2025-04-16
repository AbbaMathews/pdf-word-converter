import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import mammoth from 'mammoth';

GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;

const App = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionType, setConversionType] = useState('pdf-to-word');
  const [previewText, setPreviewText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    setFile(null);
    setPreviewText('');
    setWordCount(0);
    setCharCount(0);
    setShowFullPreview(false);
  }, [conversionType]);

  const isValidFile = (file) => {
    const allowedTypes = {
      'pdf-to-word': 'application/pdf',
      'word-to-pdf': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    const maxSize = 5 * 1024 * 1024;
    return file.type === allowedTypes[conversionType] && file.size <= maxSize;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      await extractText(selectedFile);
    } else {
      alert('Invalid file. Please upload a valid file (max 5MB).');
    }
  };

  const extractText = async (file) => {
    try {
      if (conversionType === 'pdf-to-word') {
        await extractTextFromPDF(file);
      } else if (conversionType === 'word-to-pdf') {
        await extractTextFromWord(file);
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Failed to extract text from the file. Please ensure the file is valid.');
    }
  };

  const extractTextFromPDF = async (file) => {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ');
    }
    updatePreview(text);
  };

  const extractTextFromWord = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    updatePreview(text);
  };

  const updatePreview = (text) => {
    setPreviewText(text);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert(`Please upload a ${conversionType === 'pdf-to-word' ? 'PDF' : 'Word'} file before submitting.`);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const endpoint =
      conversionType === 'pdf-to-word'
        ? 'http://127.0.0.1:5000/convert/pdf-to-word'
        : 'http://127.0.0.1:5000/convert/word-to-pdf';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const baseName = file.name.split('.').slice(0, -1).join('.') || 'converted_file';
        a.href = url;
        a.download = `${baseName}.${conversionType === 'pdf-to-word' ? 'docx' : 'pdf'}`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to convert the file. Please try again.');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">File Conversion Tool</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Select Conversion Type</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="conversionType"
                value="pdf-to-word"
                checked={conversionType === 'pdf-to-word'}
                onChange={() => setConversionType('pdf-to-word')}
                className="mr-2"
              />
              PDF to Word
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="conversionType"
                value="word-to-pdf"
                checked={conversionType === 'word-to-pdf'}
                onChange={() => setConversionType('word-to-pdf')}
                className="mr-2"
              />
              Word to PDF
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file-upload" className="block text-gray-700 text-sm font-semibold mb-2">
              Upload {conversionType === 'pdf-to-word' ? 'PDF' : 'Word'} File
            </label>
            <input
              type="file"
              id="file-upload"
              accept={
                conversionType === 'pdf-to-word'
                  ? 'application/pdf'
                  : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {file && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Selected file: {file.name}</p>
              <p className="text-sm text-gray-600">Size: {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}

          {previewText && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Preview</h2>
              <p className="text-sm text-gray-700 mb-2">
                {showFullPreview ? previewText : previewText.slice(0, 500) + '...'}
              </p>
              {previewText.length > 500 && (
                <button
                  type="button"
                  onClick={() => setShowFullPreview(!showFullPreview)}
                  className="text-blue-600 text-sm underline"
                >
                  {showFullPreview ? 'Show Less' : 'Read More'}
                </button>
              )}
              <p className="text-sm text-gray-600 mt-2">Word Count: {wordCount}</p>
              <p className="text-sm text-gray-600">Character Count: {charCount}</p>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 px-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isLoading}
            aria-label="Convert File"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              `Convert to ${conversionType === 'pdf-to-word' ? 'Word' : 'PDF'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
