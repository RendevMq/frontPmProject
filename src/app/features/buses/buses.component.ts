import { CommonModule } from '@angular/common';
import { Component, computed, effect } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-buses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buses.component.html',
  styleUrl: './buses.component.scss'
})
export class BusesComponent {
// Computed signals for each bus status
totalBuses = computed(() => this.apiService.busesSignal().length);
  
availableBuses = computed(() => 
  this.apiService.busesSignal().filter(bus => bus.estado === 1).length
);

inRouteBuses = computed(() => 
  this.apiService.busesSignal().filter(bus => bus.estado === 0).length
);

maintenanceBuses = computed(() => 
  this.apiService.busesSignal().filter(bus => bus.estado === 2).length
);

// Auto-refresh effect
refreshEffect = effect(() => {
  const interval = setInterval(() => {
    this.refreshData();
  }, 30000); // Refresh every 30 seconds

  // Cleanup
  return () => clearInterval(interval);
});

constructor(public apiService: ApiService) {}

ngOnInit(): void {
  this.refreshData();
}

refreshData(): void {
  this.apiService.refreshBuses();
}
}
