import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItem } from '../../models/breadcrumb.model';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Input() actionLabel = '';
  @Input() actionIcon = 'add';
  @Input() showAction = false;
}
