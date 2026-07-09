import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Lote } from '../models/lote.model';
import { LOTES_MOCK } from '../mocks/lotes.mock';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  
  getLotes(): Observable<Lote[]> {
    return of(LOTES_MOCK).pipe(delay(500));
  }

  getLoteById(id: number): Observable<Lote | undefined> {
    const lote = LOTES_MOCK.find(l => l.id === id);
    return of(lote).pipe(delay(300));
  }
}
