import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { LoteFilter } from '../../../shared/models/lote-filter.model';
import { applyLoteFilters } from '../../../shared/utils';
import { LOTES_MOCK } from '../mocks/lotes.mock';
import { Lote } from '../models/lote.model';


@Injectable()
export class LoteService {

  getLotes(filter?: LoteFilter): Observable<Lote[]> {
    return of(LOTES_MOCK).pipe(
      delay(1000),
      map(lotes => filter ? applyLoteFilters(lotes, filter) : lotes)
    );
  }
}
