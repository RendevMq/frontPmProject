import { Component, effect, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Estacion, IEstacionesRutaDemanda } from '../../../core/models/historico.model';
import * as echarts from 'echarts';
import { NgClass } from '@angular/common';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-chart3-estacion-demanda',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chart3-estacion-demanda.component.html',
  styleUrls: ['./chart3-estacion-demanda.component.scss']
})
export class Chart3EstacionDemandaComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);
  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;
  estaciones = [Estacion.Benavides, Estacion.Canada, Estacion.JavierPrado, Estacion.Teran];
  theme: Theme = this.themeService.isDark() ? 'dark' : 'light';

  private themeConfig: Record<Theme, {
    titleColor: string;
    tooltipBackground: string;
    tooltipBorder: string;
    tooltipTextColor: string; // Nuevo: color del texto en el tooltip
    legendColor: string;
    backgroundColor: string;
  }> = {
    light: {
      titleColor: '#111',
      tooltipBackground: '#ffffff',
      tooltipBorder: '#ccc',
      tooltipTextColor: '#111', // Texto oscuro para el tooltip en modo claro
      legendColor: '#111',
      backgroundColor: 'transparent',
    },
    dark: {
      titleColor: '#fff',
      tooltipBackground: 'rgba(50, 50, 50, 0.9)',
      tooltipBorder: '#777',
      tooltipTextColor: '#ffffff', // Texto claro para el tooltip en modo oscuro
      legendColor: '#fff',
      backgroundColor: 'transparent',
    },
  };

  constructor(private el: ElementRef) {
    // Actualiza los datos cuando el servicio de API cambia
    effect(() => {
      const estacionesRutaDemanda = this.apiService.estacionesRutaDemandaSignal();
      this.updateChartData(estacionesRutaDemanda);
    });

    // Cambia el tema cuando `ThemeService` actualiza el tema
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
      this.updateChartTheme();
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.observeResize();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private initChart(): void {
    const chartDom = this.el.nativeElement.querySelector('#estaciones-pie-chart');
    this.chartInstance = echarts.init(chartDom);
  
    const option: echarts.EChartsOption = {
      title: {
        text: 'Demanda por Estación',
        left: 'center',
        top: '5%', // Separación del título
        textStyle: { color: this.themeConfig[this.theme].titleColor },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: {
          color: this.themeConfig[this.theme].tooltipTextColor // Color del texto del tooltip
        },
        formatter: (params: any) => {
          // Crear un cuadro de color usando HTML
          const colorBox = `<span style="display:inline-block;margin-right:5px;border-radius:3px;width:10px;height:10px;background-color:${params.color};"></span>`;
          return `${params.seriesName} <br/>${colorBox}${params.name}: ${params.value} (${params.percent}%)
          `;
        }
      },
      legend: {
        top: '15%', // Posiciona la leyenda más abajo del título
        left: 'center',
        itemGap: 15, // Espacio entre los ítems de la leyenda
        textStyle: { color: this.themeConfig[this.theme].legendColor },
      },
      series: [
        {
          name: 'Pasajeros Esperando',
          type: 'pie',
          radius: ['40%', '70%'], // Controla el grosor de la corona
          center: ['50%', '60%'], // Mueve el gráfico hacia abajo
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderWidth: 5, // Espacio entre sectores
            borderColor: this.themeConfig[this.theme].backgroundColor // Fondo para separación de sectores
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 20, fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: []
        }
      ],
      backgroundColor: this.themeConfig[this.theme].backgroundColor,
      animationDurationUpdate: 1000, // Transición suave
      animationEasingUpdate: 'cubicOut'
    };
  
    this.chartInstance.setOption(option);
  }
  
  

  private updateChartTheme(): void {
    if (!this.chartInstance) return;

    const option = {
      title: {
        textStyle: { color: this.themeConfig[this.theme].titleColor }
      },
      tooltip: {
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: {
          color: this.themeConfig[this.theme].tooltipTextColor // Color del texto del tooltip
        }
      },
      legend: {
        textStyle: { color: this.themeConfig[this.theme].legendColor }
      },
      backgroundColor: this.themeConfig[this.theme].backgroundColor,
      series: [
        {
          itemStyle: {
            borderColor: this.themeConfig[this.theme].backgroundColor // Fondo para separación de sectores
          }
        }
      ]
    };

    this.chartInstance.setOption(option);
  }

  private observeResize(): void {
    const chartDom = this.el.nativeElement.querySelector('#estaciones-pie-chart');
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
    this.resizeObserver.observe(chartDom);
  }

  private updateChartData(estacionesRutaDemanda: IEstacionesRutaDemanda[]): void {
    if (!this.chartInstance) return;

    const totalPasajerosPorEstacion = this.estaciones.map(estacion => ({
      value: estacionesRutaDemanda
        .filter(d => d.estacion === estacion)
        .reduce((sum, entry) => sum + entry.pasajerosEsperando, 0),
      name: estacion
    }));

    this.chartInstance.setOption({
      series: [
        {
          data: totalPasajerosPorEstacion
        }
      ]
    });
  }

  private onResize(): void {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }
}
