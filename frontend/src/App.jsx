import { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a PDF file before submitting.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/convert/pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '.docx')}`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to convert the PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">PDF to Word Conversion Tool</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file-upload" className="block text-gray-700 text-sm font-semibold mb-2">
              Upload PDF File
            </label>
            <input
              type="file"
              id="file-upload"
              accept="application/pdf"
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
          <button
            type="submit"
            className={`w-full py-2 px-4 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Convert to Word'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
