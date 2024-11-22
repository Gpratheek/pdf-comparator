// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'comparator';
// }
import { Component } from '@angular/core';
import { DocumentService } from './services/document.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  comparisonResult: any;

  constructor(private documentService: DocumentService) {}

  handleComparisonResult(result: any) {
    this.comparisonResult = result;
  }
}
