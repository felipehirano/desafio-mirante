import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../../shared/models/breadcrumb.model';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, BreadcrumbComponent],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}
