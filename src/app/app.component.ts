import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LotesPageComponent } from './features/lotes/pages/lotes-page/lotes-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LotesPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'desafio-mirante';
}
