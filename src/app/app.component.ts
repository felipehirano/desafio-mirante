import { Component } from '@angular/core';
import { LotesPageComponent } from './features/lotes/pages/lotes-page/lotes-page.component';
import { LancamentosPageComponent } from './features/lancamentos/pages/lancamentos-page/lancamentos-page.component';
import { PageHeaderComponent } from './core/layout/page-header/page-header.component';
import { BreadcrumbItem } from './shared/models/breadcrumb.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LotesPageComponent, LancamentosPageComponent, PageHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'desafio-mirante';

  readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Início', route: '/' },
    { label: 'Outros Créditos/Débitos' }
  ];
}
