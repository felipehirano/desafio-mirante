import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Inject } from '@angular/core';
import { SimplePaginationComponent } from '../../../../shared/components';
import { EVENTOS_CSC_MOCK } from '../../mocks/eventos-csc.mock';
import { EventoCsc } from '../../models/evento-csc.model';

interface EventoCscSearchDialogData {
  initialValue?: string;
}

@Component({
  selector: 'app-evento-csc-search-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    SimplePaginationComponent
  ],
  templateUrl: './evento-csc-search-modal.component.html',
  styleUrls: ['./evento-csc-search-modal.component.scss']
})
export class EventoCscSearchModalComponent {
  readonly displayedColumns: string[] = ['idEvento', 'codEvento', 'descricao', 'dtInicio', 'dtFim'];

  readonly pageSize = 5;
  readonly filteredEventos = signal<EventoCsc[]>(EVENTOS_CSC_MOCK);
  readonly currentPage = signal(0);
  readonly selectedEventoId = signal<string | null>(null);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredEventos().length / this.pageSize)));

  readonly pagedEventos = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.filteredEventos().slice(start, start + this.pageSize);
  });

  readonly form = this.fb.group({
    valor: [this.data.initialValue ?? '']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EventoCscSearchModalComponent, EventoCsc>,
    @Inject(MAT_DIALOG_DATA) readonly data: EventoCscSearchDialogData
  ) {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.form.reset({ valor: '' });
    });

    if (this.data.initialValue) {
      this.onListar();
    }
  }

  onListar(): void {
    const query = (this.form.get('valor')?.value ?? '').toLowerCase().trim();

    if (!query) {
      this.filteredEventos.set(EVENTOS_CSC_MOCK);
      this.currentPage.set(0);
      this.selectedEventoId.set(null);
      return;
    }

    const filtered = EVENTOS_CSC_MOCK.filter(evento =>
      Object.values(evento).some(value => value.toLowerCase().includes(query))
    );

    this.filteredEventos.set(filtered);
    this.currentPage.set(0);
    this.selectedEventoId.set(null);
  }

  onSelectEvento(evento: EventoCsc): void {
    this.selectedEventoId.set(evento.idEvento);
  }

  onOk(): void {
    const selectedId = this.selectedEventoId();
    if (!selectedId) {
      return;
    }

    const selectedEvento = this.filteredEventos().find(item => item.idEvento === selectedId);
    if (!selectedEvento) {
      return;
    }

    this.dialogRef.close(selectedEvento);
  }

  onFechar(): void {
    this.dialogRef.close();
  }

  onPaginaAnterior(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(value => value - 1);
    }
  }

  onPaginaProxima(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(value => value + 1);
    }
  }

  isSelected(evento: EventoCsc): boolean {
    return this.selectedEventoId() === evento.idEvento;
  }
}
