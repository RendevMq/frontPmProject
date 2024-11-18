import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface StationData {
  name: string;
  videoSrc: string;
  colorClass: string;
  numbers: {
    min: number;
    max: number;
  }[];
}

@Component({
  selector: 'app-station-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.scss']
})
export class CamerasComponent implements OnInit, OnDestroy {
  private numberUpdateSubscription?: Subscription;
  
  stations: StationData[] = [
    {
      name: 'Estación Terán',
      videoSrc: 'assets/video1.mkv',
      colorClass: 'green',
      numbers: [{ min: 10, max: 20 }]
    },
    {
      name: 'Estación Benavides',
      videoSrc: 'assets/video2.mkv',
      colorClass: 'blue',
      numbers: [
        { min: 10, max: 20 },
        { min: 12, max: 18 }
      ]
    },
    {
      name: 'Estación Javier Prado',
      videoSrc: 'assets/video3.mkv',
      colorClass: 'purple',
      numbers: [
        { min: 20, max: 40 },
        { min: 30, max: 60 }
      ]
    },
    {
      name: 'Estación Canadá',
      videoSrc: 'assets/video4.mkv',
      colorClass: 'red',
      numbers: [{ min: 8, max: 15 }]
    }
  ];

  randomNumbers: number[][] = this.stations.map(station => 
    station.numbers.map(range => this.getRandomNumber(range.min, range.max))
  );

  ngOnInit() {
    // Update numbers every 5 seconds
    this.numberUpdateSubscription = interval(5000).subscribe(() => {
      this.randomNumbers = this.stations.map(station => 
        station.numbers.map(range => this.getRandomNumber(range.min, range.max))
      );
    });
  }

  ngOnDestroy() {
    this.numberUpdateSubscription?.unsubscribe();
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}