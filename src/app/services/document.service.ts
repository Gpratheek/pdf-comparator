// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class DocumentService {

//   private apiUrl = 'http://localhost:8080/api';  // Change to your backend URL

//   constructor(private http: HttpClient) {}

//   compareDocuments(doc1: File, doc2: File): Observable<any> {
//     const formData: FormData = new FormData();
//     formData.append('document1', doc1, doc1.name);
//     formData.append('document2', doc2, doc2.name);

//     return this.http.post<any>(`${this.apiUrl}/compare`, formData);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  compareDocuments(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8080/api/compare', formData);
  }
}
