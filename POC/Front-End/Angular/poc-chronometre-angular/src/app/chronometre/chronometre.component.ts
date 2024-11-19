import { Component } from '@angular/core';

@Component({
  selector: 'app-chronometre',
  templateUrl: './chronometre.component.html',
  styleUrls: ['./chronometre.component.scss']
})
export class ChronometreComponent {
  time: number = 0; // Temps en secondes
  interval: any; // Référence pour setInterval
  isRunning: boolean = false; // État du chronomètre

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.interval = setInterval(() => {
        this.time++;
      }, 1000);
    }
  }

  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.interval);
    }
  }

  reset(): void {
    this.stop();
    this.time = 0;
  }
}
