const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const pdfParse = require('pdf-parse');  // For PDFs
const mammoth = require('mammoth');     // For DOCX
const path = require('path');
const app = express();
const port = 8080;


app.use(cors({
  origin: 'http://localhost:4200'
}));

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } 
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Function to parse DOCX file
const parseDocx = (filePath) => {
  return new Promise((resolve, reject) => {
    const dataBuffer = fs.readFileSync(filePath);
    mammoth.extractRawText({ buffer: dataBuffer })
      .then(result => resolve(result.value))
      .catch(err => reject(err));
  });
};

// Function to handle file comparison
const compareFiles = async (file, sampleData, fileIndex) => {
  try {
    let fileData;
    console.log(`Processing file: ${file.originalname}`);

    // Extract text from PDF or DOCX file
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      fileData = pdfData.text;
      console.log(`Extracted PDF content:\n${fileData}`); 
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileData = await parseDocx(file.path);
      console.log(`Extracted DOCX content:\n${fileData}`); 
    } else {
      throw new Error('Unsupported file type');
    }

    // Split the file and sample data into lines
    const fileLines = fileData.split('\n');
    const sampleLines = sampleData.split('\n');

    console.log(`File Lines Count: ${fileLines.length}, Sample Lines Count: ${sampleLines.length}`);

    const differences = [];

    const maxLines = Math.max(fileLines.length, sampleLines.length); 

    for (let i = 0; i < maxLines; i++) {
      const sampleLine = sampleLines[i]; // Handle missing sample lines
      const fileLine = fileLines[i];     // Handle missing file lines

      // Log both lines for comparison
      console.log(`Line ${i + 1}:`);
      console.log(`Sample Line: '${sampleLine}'`);
      console.log(`File Line: '${fileLine}'`);

      // If there's a difference, store the details
      if (sampleLine !== fileLine) {
        differences.push({
          line: i + 1,
          oldText: sampleLine || '',  // Only print the old text if it exists
          newText: fileLine || ''      // Only print the new text if it exists
        });
      }
    }

    // Cleanup uploaded file after processing
    fs.unlinkSync(file.path);

    return differences;
  } catch (error) {
    console.error(`Error processing file ${fileIndex}:`, error);
    throw new Error(`Error processing file ${fileIndex}`);
  }
};

// API endpoint to handle document comparison
app.post('/api/compare', upload.fields([{ name: 'doc1' }, { name: 'doc2' }]), async (req, res) => {
  try {
    console.log('Uploaded files:', req.files);

    const uploadedFile1 = req.files['doc1'][0]; // Access the file from the field 'doc1'
    const uploadedFile2 = req.files['doc2'][0]; // Access the file from the field 'doc2'

    console.log('Uploaded file 1:', uploadedFile1);
    console.log('Uploaded file 2:', uploadedFile2);

    // Path for the sample document
    const sampleDocumentPath = path.join(__dirname, 'assets', 'sample-document.txt');
    
    console.log('Sample document path:', sampleDocumentPath); // Log to verify the path

    // **Check if the sample document exists and log its content directly**
    if (!fs.existsSync(sampleDocumentPath)) {
      console.log('Sample document does not exist at the given path!');
      return res.status(404).json({ error: 'Sample document not found.' });
    }

    // Read the sample document (plain text or process it accordingly)
    const sampleData = fs.readFileSync(sampleDocumentPath, 'utf8');

    // Log the raw sample document data for debugging
    console.log('Sample Document Content:');
    console.log(sampleData); // Log the raw content of the sample document

    const differences = [];

    // Compare both uploaded files
    const differences1 = await compareFiles(uploadedFile1, sampleData, 1);
    differences.push(...differences1);

    const differences2 = await compareFiles(uploadedFile2, sampleData, 2);
    differences.push(...differences2);

    // Return the differences in a single unified list
    if (differences.length > 0) {
      res.json({ success: true, differences, differenceCount: differences.length });
    } else {
      res.json({ success: true, message: 'No differences found between the documents and the sample.' });
    }

  } catch (err) {
    console.error('Error comparing documents:', err);
    res.status(500).json({ error: err.message || 'Error comparing documents' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
