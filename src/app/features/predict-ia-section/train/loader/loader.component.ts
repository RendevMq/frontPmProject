import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild, inject, effect } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ThemeService } from '../../../../core/services/theme.service';
import { AiService } from '../../../../core/services/ia.service';

@Component({
  selector: 'app-neural-network',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [NgStyle, NgFor, NgIf],
})
export class LoaderComponent implements OnInit {
  @ViewChild('confettiCanvas', { static: true }) confettiCanvas!: ElementRef<HTMLCanvasElement>;

  private themeService = inject(ThemeService);
  theme: string = this.themeService.isDark() ? 'dark' : 'light';

  isTraining = false;
  progress = 0;
  statusText = 'Listo para entrenar';
  private subscription: Subscription | null = null;
  private confettiAnimationId: number | null = null;

  constructor(
    private ngZone: NgZone,
    private aiService: AiService // Inyectar AiService
  ) {
    // Detecta cambios en el tema y actualiza
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
    });
  }

  ngOnInit() {
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  ngOnDestroy() {
    this.stopTraining();
    this.stopConfetti();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  // startTraining() {
  //   this.isTraining = true;
  //   this.progress = 0;
  //   this.statusText = '🚀 Iniciando entrenamiento...';

  //   // Actualización del progreso en intervalos
  //   this.subscription = interval(100)
  //     .pipe(takeWhile(() => this.isTraining && this.progress < 90))
  //     .subscribe(() => {
  //       this.progress += 1; // Incrementa el progreso
  //       this.updateStatusText();
  //     });

  //   // Llamada al endpoint de entrenamiento
  //   this.aiService.trainModel().subscribe(
  //     (response) => {
  //       // Entrenamiento completado
  //       this.isTraining = false;
  //       this.progress = 100; // Establece el progreso al 100%
  //       this.statusText = '🎉 Entrenamiento finalizado con éxito';
  //       this.updateStatusText();
  //       this.startConfetti();

  //       // Detiene la suscripción al intervalo
  //       if (this.subscription) {
  //         this.subscription.unsubscribe();
  //         this.subscription = null;
  //       }
  //     },
  //     (error) => {
  //       // Manejo de errores
  //       console.error('Error durante el entrenamiento:', error);
  //       this.isTraining = false;
  //       this.statusText = '❌ Error durante el entrenamiento';

  //       // Detiene la suscripción al intervalo
  //       if (this.subscription) {
  //         this.subscription.unsubscribe();
  //         this.subscription = null;
  //       }
  //     }
  //   );
  // }

  startTraining() {
    this.isTraining = true;
    this.progress = 0;
    this.statusText = '🚀 Iniciando entrenamiento...';
  
    // Incremento dinámico del progreso
    this.subscription = interval(100)
      .pipe(takeWhile(() => this.isTraining && this.progress < 90))
      .subscribe(() => {
        const increment = this.calculateIncrement(this.progress); // Incremento dinámico
        this.progress = Math.min(this.progress + increment, 90); // Limita el progreso al 90%
        this.updateStatusText();
      });
  
    // Llamada al endpoint de entrenamiento
    this.aiService.trainModel().subscribe(
      (response) => {
        // Entrenamiento completado
        this.isTraining = false;
        this.progress = 100; // Establece el progreso al 100%
        this.statusText = '🎉 Entrenamiento finalizado con éxito';
        this.updateStatusText();
        this.startConfetti();
  
        // Detiene la suscripción al intervalo
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = null;
        }
      },
      (error) => {
        // Manejo de errores
        console.error('Error durante el entrenamiento:', error);
        this.isTraining = false;
        this.statusText = '❌ Error durante el entrenamiento';
  
        // Detiene la suscripción al intervalo
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = null;
        }
      }
    );
  }
  private calculateIncrement(progress: number): number {
    if (progress < 30) {
      return 0.3; // Incremento más lento en el inicio
    } else if (progress < 60) {
      return 0.4; // Incremento moderado
    } else if (progress < 90) {
      return 0.7; // Incremento más rápido al acercarse al final
    }
    return 0; // No incrementar más allá del 90%
  }
  
  

  stopTraining() {
    this.isTraining = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.statusText = 'Entrenamiento detenido';
  }

  private updateStatusText() {
    if (this.progress >= 100) {
      this.statusText = '🎉 Entrenamiento finalizado con éxito';
    } else if (this.progress >= 70) {
      this.statusText = '⏳ Casi terminamos...';
    } else if (this.progress >= 30) {
      this.statusText = '⚙️ Entrenamiento avanzando...';
    } else if (this.progress > 0) {
      this.statusText = '🚀 Entrenamiento en progreso...';
    }
  }

  private resizeCanvas() {
    const canvas = this.confettiCanvas.nativeElement;
    const container = canvas.parentElement as HTMLElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  private startConfetti() {
    const canvas = this.confettiCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const confettiCount = 150;
    const confetti: {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 5 + 5,
        color: this.getRandomColor(),
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 + 5,
      });
    }

    let frameCount = 0;
    const maxFrames = 300;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((c) => {
        ctx.save();
        ctx.translate(c.x + c.size / 2, c.y + c.size / 2);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();

        c.y += c.speed;
        c.rotation += c.rotationSpeed;

        if (c.y > canvas.height) {
          c.y = -c.size;
          c.x = Math.random() * canvas.width;
        }
      });

      frameCount++;
      if (frameCount < maxFrames) {
        this.confettiAnimationId = requestAnimationFrame(draw);
      } else {
        this.stopConfetti();
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.confettiAnimationId = requestAnimationFrame(draw);
    });
  }

  private stopConfetti() {
    if (this.confettiAnimationId !== null) {
      cancelAnimationFrame(this.confettiAnimationId);
      this.confettiAnimationId = null;

      // Limpia el canvas cuando termina la animación de confeti
      const canvas = this.confettiCanvas.nativeElement;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private getRandomColor(): string {
    const colors = ['#FF3E3E', '#FFD23F', '#3E8BFF', '#3EFF72', '#FF3ED1', '#FF8F3E'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getProgressBarColor(): string {
    if (this.progress >= 100) {
      return '#10B981'; // Verde vibrante
    } else if (this.progress >= 70) {
      return '#F59E0B'; // Amarillo
    } else if (this.progress >= 30) {
      return '#F97316'; // Naranja
    } else {
      return '#EF4444'; // Rojo
    }
  }
}



/*
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild, inject, effect } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-neural-network',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [NgStyle, NgFor, NgIf],
})
export class LoaderComponent implements OnInit {
  @ViewChild('confettiCanvas', { static: true }) confettiCanvas!: ElementRef<HTMLCanvasElement>;

  private themeService = inject(ThemeService);
  theme: string = this.themeService.isDark() ? 'dark' : 'light';

  isTraining = false;
  progress = 0;
  statusText = 'Listo para entrenar';
  private subscription: Subscription | null = null;
  private confettiAnimationId: number | null = null;

  constructor(private ngZone: NgZone) {
    // Detecta cambios en el tema y actualiza
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
    });
  }

  ngOnInit() {
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  ngOnDestroy() {
    this.stopTraining();
    this.stopConfetti();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  startTraining() {
    this.isTraining = true;
    this.progress = 0;
    this.statusText = '🚀 Iniciando entrenamiento...';

    // Actualización del progreso en intervalos
    this.subscription = interval(50)
      .pipe(takeWhile(() => this.isTraining && this.progress < 100))
      .subscribe(() => {
        this.progress += 0.5;
        this.updateStatusText();

        if (this.progress >= 100) {
          this.isTraining = false;
          this.progress = 100; // Asegura que el progreso no exceda el 100%
          this.statusText = '🎉 Entrenamiento finalizado con éxito';
          this.startConfetti();
        }
      });
  }

  stopTraining() {
    this.isTraining = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.statusText = 'Entrenamiento detenido';
  }

  private updateStatusText() {
    if (this.progress < 30) {
      this.statusText = '🚀 Entrenamiento en progreso...';
    } else if (this.progress < 70) {
      this.statusText = '⚙️ Entrenamiento avanzando...';
    } else if (this.progress < 100) {
      this.statusText = '⏳ Casi terminamos...';
    }
  }

  private resizeCanvas() {
    const canvas = this.confettiCanvas.nativeElement;
    const container = canvas.parentElement as HTMLElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  private startConfetti() {
    const canvas = this.confettiCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const confettiCount = 150;
    const confetti: {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 5 + 5,
        color: this.getRandomColor(),
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 + 5,
      });
    }

    let frameCount = 0;
    const maxFrames = 300;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((c) => {
        ctx.save();
        ctx.translate(c.x + c.size / 2, c.y + c.size / 2);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();

        c.y += c.speed;
        c.rotation += c.rotationSpeed;

        if (c.y > canvas.height) {
          c.y = -c.size;
          c.x = Math.random() * canvas.width;
        }
      });

      frameCount++;
      if (frameCount < maxFrames) {
        this.confettiAnimationId = requestAnimationFrame(draw);
      } else {
        this.stopConfetti();
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.confettiAnimationId = requestAnimationFrame(draw);
    });
  }

  private stopConfetti() {
    if (this.confettiAnimationId !== null) {
      cancelAnimationFrame(this.confettiAnimationId);
      this.confettiAnimationId = null;

      // Limpia el canvas cuando termina la animación de confeti
      const canvas = this.confettiCanvas.nativeElement;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private getRandomColor(): string {
    const colors = ['#FF3E3E', '#FFD23F', '#3E8BFF', '#3EFF72', '#FF3ED1', '#FF8F3E'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getProgressBarColor(): string {
    if (this.progress >= 100) {
      return '#10B981'; // Verde vibrante
    } else if (this.progress >= 70) {
      return '#F59E0B'; // Amarillo
    } else if (this.progress >= 30) {
      return '#F97316'; // Naranja
    } else {
      return '#EF4444'; // Rojo
    }
  }
  
}

*/
