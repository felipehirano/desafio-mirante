import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LotesTableComponent } from '../../components/lotes-table/lotes-table.component';

@Component({
  selector: 'app-lotes-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LotesTableComponent
  ],
  templateUrl: './lotes-page.component.html',
  styleUrls: ['./lotes-page.component.scss']
})
export class LotesPageComponent {}
