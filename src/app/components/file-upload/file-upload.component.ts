// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { DocumentService } from '../../services/document.service';

// @Component({
//   selector: 'app-file-upload',
//   templateUrl: './file-upload.component.html',
//   styleUrls: ['./file-upload.component.css']
// })
// export class FileUploadComponent {
//   doc1: File | null = null;
//   doc2: File | null = null;

//   constructor(private documentService: DocumentService, private httpClient: HttpClient) {}

//   onFileChange(event: any, docNum: number): void {
//     const file = event.target.files[0];
//     if (docNum === 1) {
//       this.doc1 = file;
//     } else if (docNum === 2) {
//       this.doc2 = file;
//     }
//   }

//   compareDocuments() {
//     if (this.doc1 && this.doc2) {
//       // Create FormData to send files via HTTP POST
//       const formData = new FormData();
//       formData.append('doc1', this.doc1, this.doc1.name);  // 'doc1' is the correct field name
//       formData.append('doc2', this.doc2, this.doc2.name);  // 'doc2' is the correct field name


//       // Send the files to the backend for comparison
//       this.httpClient.post('http://localhost:8080/api/compare', formData)
//         .subscribe(response => {
//           console.log(response);  // Handle the comparison result
//         }, error => {
//           console.error('Error comparing documents:', error);
//         });
//     } else {
//       console.error('Please upload both documents.');
//     }
//   }
// }
// file-upload.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  doc1: File | null = null;
  doc2: File | null = null;

  @Output() comparisonResult = new EventEmitter<any>(); // Emit the comparison result

  constructor(private documentService: DocumentService, private httpClient: HttpClient) {}

  // Method to handle file input change
  onFileChange(event: any, docNum: number): void {
    const file = event.target.files[0];
    if (docNum === 1) {
      this.doc1 = file;
    } else if (docNum === 2) {
      this.doc2 = file;
    }
  }

  // Method to compare documents
  compareDocuments() {
    if (this.doc1 && this.doc2) {
      const formData = new FormData();
      formData.append('doc1', this.doc1, this.doc1.name);  // Attach first document
      formData.append('doc2', this.doc2, this.doc2.name);  // Attach second document

      // Send the files to the backend for comparison
      this.httpClient.post('http://localhost:8080/api/compare', formData)
        .subscribe(response => {
          // Emit the comparison result back to the parent component
          this.comparisonResult.emit(response);
        }, error => {
          console.error('Error comparing documents:', error);
        });
    } else {
      console.error('Please upload both documents.');
    }
  }
}
