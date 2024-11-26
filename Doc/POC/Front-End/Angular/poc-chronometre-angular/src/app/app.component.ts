
import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { ChronometreComponent } from './chronometre/chronometre.component';



@Component({

  selector: 'app-root',

  imports: [ChronometreComponent],

  templateUrl: './app.component.html',

  styleUrl: './app.component.scss'

})

export class AppComponent {

  title = 'poc-chronometre-angular';

}
