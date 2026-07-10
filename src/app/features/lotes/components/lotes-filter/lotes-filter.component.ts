import { Component, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoteFilter } from '../../../../shared/models/lote-filter.model';
import {
  createDateRangeValidator,
  createDynamicMinDateFilter,
  createDynamicMaxDateFilter,
  applyOnlyNumbersInputWithControl,
  applyCurrencyInput,
  getFormFieldErrorMessage,
  hasFormFieldError
} from '../../../../shared/utils';


@Component({
  selector: 'app-lotes-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './lotes-filter.component.html',
  styleUrls: ['./lotes-filter.component.scss'],
})
export class LotesFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<LoteFilter>();
  @Input() isLoading: boolean = false;

  filterForm!: FormGroup;
  isExpanded = signal(true);

  readonly situacaoOptions = [
    { value: 'TODAS', label: 'Todas' },
    { value: 'ABERTO', label: 'Aberto' },
    { value: 'CONFIRMADO', label: 'Confirmado' },
    { value: 'ENVIADO', label: 'Enviado' },
    { value: 'REJEITADO', label: 'Rejeitado' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group(
      {
        instituicaoResp: ['', Validators.maxLength(30)],
        instituicao: ['', Validators.maxLength(30)],
        situacao: ['TODAS'],
        idLoteMin: ['', Validators.pattern(/^\d*$/)],
        idLoteMax: ['', Validators.pattern(/^\d*$/)],
        valorLoteMin: ['', Validators.pattern(/^\d{1,3}(\.\d{3})*(,\d{2})?$/)],
        valorLoteMax: ['', Validators.pattern(/^\d{1,3}(\.\d{3})*(,\d{2})?$/)],
        dataEntradaMin: [''],
        dataEntradaMax: ['']
      },
      { validators: createDateRangeValidator('dataEntradaMin', 'dataEntradaMax') }
    );
  }

  toggleExpanded(): void {
    this.isExpanded.update((value) => !value);
  }

  onSearch(): void {
    if (this.filterForm.valid) {
      this.filterChange.emit(this.filterForm.value);
    }
  }

  onReset(): void {
    this.filterForm.reset({ situacao: 'TODAS' });
    this.filterChange.emit({});
  }

  minDateFilter = (date: Date | null): boolean => {
    return createDynamicMinDateFilter(this.filterForm, 'dataEntradaMin')(date);
  };

  maxDateFilter = (date: Date | null): boolean => {
    return createDynamicMaxDateFilter(this.filterForm, 'dataEntradaMax')(date);
  };

  readonly onlyNumbers = (event: Event): void => {
    applyOnlyNumbersInputWithControl(event, this.filterForm);
  };

  readonly formatCurrency = (event: Event): void => {
    applyCurrencyInput(event, this.filterForm);
  };

  readonly getFieldError = (fieldName: string): string => {
    return getFormFieldErrorMessage(this.filterForm, fieldName);
  };

  readonly hasError = (fieldName: string): boolean => {
    return hasFormFieldError(this.filterForm, fieldName);
  };
}
