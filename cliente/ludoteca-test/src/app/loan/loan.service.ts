import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable } from '../core/model/page/Pageable';
import { Observable } from 'rxjs';
import { LoanPage } from './model/LoanPage';
import { Loan } from './model/Loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080/loan';

  getLoans(pageable: Pageable, gameId: number, clientId: number, date: Date): Observable<LoanPage> {
    const formattedDate: string = this.formatDate(date);
    return this.http.post<LoanPage>(this.composeFindUrl(gameId, clientId, formattedDate), { pageable: pageable });
  }

  deleteLoan(idLoan: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
  }

  saveLoan(loan: Loan): Observable<void> {
    const loanDto = {
      ...loan,
      dateStart: this.formatDate(loan.dateStart),
      dateEnd: this.formatDate(loan.dateEnd)
    }
    return this.http.put<void>(this.baseUrl, loanDto);
  }

  private composeFindUrl(gameId: number, clientId: number, date: string): string {
    const params = new URLSearchParams();
    if (gameId) {
      params.set('idGame', gameId.toString());
    }
    if (clientId) {
      params.set('idClient', clientId.toString());
    }
    if (date) {
       params.set('date', date);
    }
    const queryString = params.toString();
    return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
  }

  private formatDate(date: Date): string {
    return date == null ? null :
           date.getFullYear() + '-' +
          (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
           date.getDate().toString().padStart(2, '0');
  }
}