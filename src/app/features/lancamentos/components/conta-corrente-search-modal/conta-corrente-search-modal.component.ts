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
import { CONTAS_CORRENTES_MOCK, ContaCorrenteMock } from '../../mocks/contas-correntes.mock';

interface ContaCorrenteSearchDialogData {
  initialValue?: string;
}

@Component({
  selector: 'app-conta-corrente-search-modal',
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
  templateUrl: './conta-corrente-search-modal.component.html',
  styleUrls: ['./conta-corrente-search-modal.component.scss']
})
export class ContaCorrenteSearchModalComponent {
  readonly displayedColumns: string[] = ['numero', 'titular'];

  readonly pageSize = 5;
  readonly filteredContas = signal<ContaCorrenteMock[]>(CONTAS_CORRENTES_MOCK);
  readonly currentPage = signal(0);
  readonly selectedContaNumero = signal<string | null>(null);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredContas().length / this.pageSize)));

  readonly pagedContas = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.filteredContas().slice(start, start + this.pageSize);
  });

  readonly form = this.fb.group({
    valor: [this.data.initialValue ?? '']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ContaCorrenteSearchModalComponent, ContaCorrenteMock>,
    @Inject(MAT_DIALOG_DATA) readonly data: ContaCorrenteSearchDialogData
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
      this.filteredContas.set(CONTAS_CORRENTES_MOCK);
      this.currentPage.set(0);
      this.selectedContaNumero.set(null);
      return;
    }

    const filtered = CONTAS_CORRENTES_MOCK.filter(conta =>
      Object.values(conta).some(value => value.toLowerCase().includes(query))
    );

    this.filteredContas.set(filtered);
    this.currentPage.set(0);
    this.selectedContaNumero.set(null);
  }

  onSelectConta(conta: ContaCorrenteMock): void {
    this.selectedContaNumero.set(conta.numero);
  }

  onOk(): void {
    const selectedNumero = this.selectedContaNumero();
    if (!selectedNumero) {
      return;
    }

    const selectedConta = this.filteredContas().find(item => item.numero === selectedNumero);
    if (!selectedConta) {
      return;
    }

    this.dialogRef.close(selectedConta);
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

  isSelected(conta: ContaCorrenteMock): boolean {
    return this.selectedContaNumero() === conta.numero;
  }
}
