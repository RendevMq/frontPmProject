import { Component, effect, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Ruta, IEstacionesRutaDemanda } from '../../../core/models/historico.model';
import * as echarts from 'echarts';
import { NgClass } from '@angular/common';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-chart4-ruta-demanda',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chart4-ruta-demanda.component.html',
  styleUrls: ['./chart4-ruta-demanda.component.scss']
})
export class Chart4RutaDemandaComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);
  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;
  rutas = [Ruta.Exp1, Ruta.B];
  theme: Theme = this.themeService.isDark() ? 'dark' : 'light';

  private themeConfig: Record<Theme, {
    titleColor: string;
    tooltipBackground: string;
    tooltipBorder: string;
    tooltipTextColor: string;
    legendColor: string;
    backgroundColor: string;
  }> = {
    light: {
      titleColor: '#111',
      tooltipBackground: '#ffffff',
      tooltipBorder: '#ccc',
      tooltipTextColor: '#111',
      legendColor: '#111',
      backgroundColor: 'transparent',
    },
    dark: {
      titleColor: '#fff',
      tooltipBackground: 'rgba(50, 50, 50, 0.9)',
      tooltipBorder: '#777',
      tooltipTextColor: '#ffffff',
      legendColor: '#fff',
      backgroundColor: 'transparent',
    },
  };

  constructor(private el: ElementRef) {
    effect(() => {
      const estacionesRutaDemanda = this.apiService.estacionesRutaDemandaSignal();
      this.updateChartData(estacionesRutaDemanda);
    });

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
    const chartDom = this.el.nativeElement.querySelector('#ruta-pie-chart');
    this.chartInstance = echarts.init(chartDom);
  
    const option: echarts.EChartsOption = {
      title: {
        text: 'Demanda por Ruta',
        left: 'center',
        top: '5%',
        textStyle: { color: this.themeConfig[this.theme].titleColor },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: {
          color: this.themeConfig[this.theme].tooltipTextColor
        },
        formatter: (params: any) => {
          const colorBox = `<span style="display:inline-block;margin-right:5px;border-radius:3px;width:10px;height:10px;background-color:${params.color};"></span>`;
          return `${params.seriesName} <br/>${colorBox}${params.name}: ${params.value} (${params.percent}%)
          `;
        }
      },
      legend: {
        top: '20%',
        left: 'center',
        textStyle: { color: this.themeConfig[this.theme].legendColor },
      },
      series: [
        {
          name: 'Pasajeros por Ruta',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '80%'],
          startAngle: 180,
          endAngle: 360,
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderWidth: 5,
            borderColor: this.themeConfig[this.theme].backgroundColor
          },
          label: { show: true, position: 'outside' },
          labelLine: {
            show: true,         // Muestra las líneas de conexión
            length: 30,         // Longitud de la primera parte de la línea
            length2: 20,        // Longitud de la segunda parte de la línea
            smooth: true        // Suaviza la línea de conexión
          },
    emphasis: {
      label: {
        show: true,             // Mantiene la etiqueta visible en hover
        fontSize: 14,            // Puedes ajustar el tamaño si quieres destacar más
        fontWeight: 'bold',      // Opcional: resalta la etiqueta en hover
      },
      labelLine: {
        show: true               // Mantiene la línea de conexión en hover
      }
    },
          data: []
        }
      ],
      backgroundColor: this.themeConfig[this.theme].backgroundColor,
      animationDurationUpdate: 1000,
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
          color: this.themeConfig[this.theme].tooltipTextColor
        }
      },
      legend: {
        textStyle: { color: this.themeConfig[this.theme].legendColor }
      },
      backgroundColor: this.themeConfig[this.theme].backgroundColor,
      series: [
        {
          itemStyle: {
            borderColor: this.themeConfig[this.theme].backgroundColor
          }
        }
      ]
    };

    this.chartInstance.setOption(option);
  }

  private observeResize(): void {
    const chartDom = this.el.nativeElement.querySelector('#ruta-pie-chart');
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
    this.resizeObserver.observe(chartDom);
  }

  private updateChartData(estacionesRutaDemanda: IEstacionesRutaDemanda[]): void {
    if (!this.chartInstance) return;

    const totalPasajerosPorRuta = this.rutas.map(ruta => ({
      value: estacionesRutaDemanda
        .filter(d => d.ruta === ruta)
        .reduce((sum, entry) => sum + entry.pasajerosEsperando, 0),
      name: ruta
    }));

    this.chartInstance.setOption({
      series: [
        {
          data: totalPasajerosPorRuta
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
