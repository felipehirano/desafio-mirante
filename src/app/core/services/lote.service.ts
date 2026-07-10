import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Lote } from '../models/lote.model';
import { LoteFilter } from '../../shared/models/lote-filter.model';
import { LOTES_MOCK } from '../mocks/lotes.mock';
import { applyLoteFilters } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  getLotes(filter?: LoteFilter): Observable<Lote[]> {
    return of(LOTES_MOCK).pipe(
      delay(1000),
      map(lotes => filter ? applyLoteFilters(lotes, filter) : lotes)
    );
  }
}
