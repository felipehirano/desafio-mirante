import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LotesPageComponent } from './features/lotes/pages/lotes-page/lotes-page.component';
import { PageHeaderComponent } from './shared/components/page-header/page-header.component';
import { BreadcrumbItem } from './shared/models/breadcrumb.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LotesPageComponent, PageHeaderComponent],
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
