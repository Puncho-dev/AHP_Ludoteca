import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
 
@Injectable({
  providedIn: 'root'
})

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Elementos por página';
    this.nextPageLabel = 'Siguiente página';
    this.previousPageLabel = 'Página anterior';
    this.lastPageLabel= 'Ultima página';
    this.firstPageLabel= 'Primera página';
  }
}
 