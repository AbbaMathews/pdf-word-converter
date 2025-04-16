from flask import Flask, request, jsonify, send_file
from pdf2docx import Converter
from docx2pdf import convert as docx_to_pdf
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'converted'
PDF_EXTENSIONS = {'pdf'}
WORD_EXTENSIONS = {'docx'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename, allowed_exts):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_exts

@app.route('/convert/pdf-to-word', methods=['POST'])
def convert_pdf_to_word():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename, PDF_EXTENSIONS):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    output_filename = filename.rsplit('.', 1)[0] + '.docx'
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    print("PDF → Word saved to:", output_path)

    try:
        cv = Converter(filepath)
        cv.convert(output_path, start=0, end=None)
        cv.close()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return send_file(output_path, as_attachment=True)

@app.route('/convert/word-to-pdf', methods=['POST'])
def convert_word_to_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename, WORD_EXTENSIONS):
        return jsonify({'error': 'Only DOCX files are allowed'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    output_filename = filename.rsplit('.', 1)[0] + '.pdf'
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    print("Word → PDF saved to:", output_path)

    try:
        docx_to_pdf(filepath, output_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
