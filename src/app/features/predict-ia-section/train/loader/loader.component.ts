import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() progress: number = 0;
  isCompleted: boolean = false;

  ngOnInit() {
    // Simular progreso (eliminar esto en producción)
    this.simulateProgress();
  }

  private simulateProgress() {
    const interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 1;
      } else {
        this.isCompleted = true;
        clearInterval(interval);
      }
    }, 100);
  }
}
