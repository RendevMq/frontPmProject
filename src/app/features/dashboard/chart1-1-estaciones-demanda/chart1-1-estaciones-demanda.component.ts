/*import { Component, effect, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Estacion, IEstacionesRutaDemanda } from '../../../core/models/historico.model';
import * as echarts from 'echarts';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-chart1-1-estaciones-demanda',
  standalone: true,
  templateUrl: './chart1-1-estaciones-demanda.component.html',
  styleUrls: ['./chart1-1-estaciones-demanda.component.scss']
})
export class Chart11EstacionesDemandaComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;
  estaciones = [Estacion.Benavides, Estacion.Canada, Estacion.JavierPrado, Estacion.Teran];
  private theme: Theme = 'dark';

  private themeConfig: Record<Theme, {
    titleColor: string;
    tooltipBackground: string;
    tooltipBorder: string;
    legendColor: string;
    axisLineColor: string;
    axisLabelColor: string;
    splitLineColor: string;
    seriesLineColor: (estacion: Estacion) => string;
    backgroundColor: string;
  }> = {
    light: {
      titleColor: '#111',
      tooltipBackground: '#111111c2',
      tooltipBorder: '#ccc',
      legendColor: '#111',
      axisLineColor: '#111',
      axisLabelColor: '#111',
      splitLineColor: 'rgba(0, 0, 0, 0.1)',
      seriesLineColor: (estacion: Estacion) => {
        switch (estacion) {
          case Estacion.Benavides:
            return 'rgba(75, 192, 192, 1)';
          case Estacion.Canada:
            return 'rgba(54, 162, 235, 1)';
          case Estacion.JavierPrado:
            return 'rgba(255, 206, 86, 1)';
          case Estacion.Teran:
            return 'rgba(153, 102, 255, 1)';
          default:
            return 'rgba(201, 203, 207, 1)';
        }
      },
      backgroundColor: '#fff',
    },
    dark: {
      titleColor: '#fff',
      tooltipBackground: 'rgba(0, 0, 0, 0.7)',
      tooltipBorder: '#777',
      legendColor: '#fff',
      axisLineColor: '#777',
      axisLabelColor: '#fff',
      splitLineColor: 'rgba(255, 255, 255, 0.1)',
      seriesLineColor: (estacion: Estacion) => {
        switch (estacion) {
          case Estacion.Benavides:
            return 'rgba(75, 192, 192, 1)';
          case Estacion.Canada:
            return 'rgba(54, 162, 235, 1)';
          case Estacion.JavierPrado:
            return 'rgba(255, 206, 86, 1)';
          case Estacion.Teran:
            return 'rgba(153, 102, 255, 1)';
          default:
            return 'rgba(201, 203, 207, 1)';
        }
      },
      backgroundColor: '#333',
    },
  };

  constructor(private el: ElementRef) {
    // Define el effect en el constructor para observar cambios en el signal
    effect(() => {
      const estacionesRutaDemanda = this.apiService.estacionesRutaDemandaSignal();
      this.updateChartData(estacionesRutaDemanda);
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.observeResize(); // Inicia el ResizeObserver
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect(); // Detiene el ResizeObserver
    window.removeEventListener('resize', this.onResize.bind(this)); // Elimina el evento resize
  }

  private initChart(): void {
    const chartDom = this.el.nativeElement.querySelector('#main-chart');
    this.chartInstance = echarts.init(chartDom, this.theme);

    const option: echarts.EChartsOption = {
      title: {
        text: 'Demanda por Estación',
        left: 'center',
        textStyle: { color: this.themeConfig[this.theme].titleColor },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: { color: this.themeConfig[this.theme].tooltipBorder },
      },
      legend: {
        data: this.estaciones,
        top: '10%',
        textStyle: { color: this.themeConfig[this.theme].legendColor },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        splitLine: { lineStyle: { color: this.themeConfig[this.theme].splitLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      },
      backgroundColor: 'transparent',
      series: this.estaciones.map(estacion => ({
        name: estacion,
        type: 'line',
        smooth: false,
        lineStyle: { width: 2, color: this.themeConfig[this.theme].seriesLineColor(estacion) },
        data: [],
      })),
    };

    this.chartInstance.setOption(option);
  }

  private observeResize(): void {
    const chartDom = this.el.nativeElement.querySelector('#main-chart');
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize(); // Ajusta el tamaño del gráfico al redimensionar el contenedor
      }
    });
    this.resizeObserver.observe(chartDom); // Observa el contenedor del gráfico
  }

  private updateChartData(estacionesRutaDemanda: IEstacionesRutaDemanda[]): void {
    if (!this.chartInstance) return;

    const labels = Array.from(
      new Set(estacionesRutaDemanda.map(d => new Date(d.hora).toLocaleTimeString()))
    );

    const seriesData = this.estaciones.map(estacion => ({
      name: estacion,
      data: labels.map(label => {
        const entry = estacionesRutaDemanda.find(
          d => d.estacion === estacion && new Date(d.hora).toLocaleTimeString() === label
        );
        return entry ? entry.pasajerosEsperando : 0;
      }),
    }));

    this.chartInstance.setOption({
      xAxis: {
        data: labels,
      },
      series: seriesData.map(data => ({
        ...data,
        type: 'line',
        smooth: false,
        animationDurationUpdate: 1000, // Duración de la animación de actualización
        animationEasingUpdate: 'cubicInOut', // Suavizado de la animación de actualización
      })),
    });
  }

  private onResize(): void {
    if (this.chartInstance) {
      this.chartInstance.resize(); // Llama al método resize de ECharts
    }
  }
}*/
import { Component, effect, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Estacion, IEstacionesRutaDemanda } from '../../../core/models/historico.model';
import * as echarts from 'echarts';
import { NgClass } from '@angular/common';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-chart1-1-estaciones-demanda',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chart1-1-estaciones-demanda.component.html',
  styleUrls: ['./chart1-1-estaciones-demanda.component.scss']
})
export class Chart11EstacionesDemandaComponent implements OnInit, OnDestroy {
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
    tooltipTextColor: string;
    legendColor: string;
    axisLineColor: string;
    axisLabelColor: string;
    splitLineColor: string;
    seriesLineColor: (estacion: Estacion) => string;
    backgroundColor: string;
  }> = {
    light: {
      titleColor: '#111',
      tooltipBackground: '#ffffff',
      tooltipBorder: '#ccc',
      tooltipTextColor: '#111',
      legendColor: '#111',
      axisLineColor: '#111',
      axisLabelColor: '#111',
      splitLineColor: 'rgba(0, 0, 0, 0.1)',
      seriesLineColor: (estacion: Estacion) => {
        switch (estacion) {
          case Estacion.Benavides: return 'rgba(75, 192, 192, 1)';
          case Estacion.Canada: return 'rgba(54, 162, 235, 1)';
          case Estacion.JavierPrado: return 'rgba(255, 206, 86, 1)';
          case Estacion.Teran: return 'rgba(153, 102, 255, 1)';
          default: return 'rgba(201, 203, 207, 1)';
        }
      },
      backgroundColor: '#fff',
    },
    dark: {
      titleColor: '#fff',
      tooltipBackground: 'rgba(0, 0, 0, 0.7)',
      tooltipBorder: '#777',
      tooltipTextColor: '#ffffff',
      legendColor: '#fff',
      axisLineColor: '#777',
      axisLabelColor: '#fff',
      splitLineColor: 'rgba(255, 255, 255, 0.1)',
      seriesLineColor: (estacion: Estacion) => {
        switch (estacion) {
          case Estacion.Benavides: return 'rgba(75, 192, 192, 1)';
          case Estacion.Canada: return 'rgba(54, 162, 235, 1)';
          case Estacion.JavierPrado: return 'rgba(255, 206, 86, 1)';
          case Estacion.Teran: return 'rgba(153, 102, 255, 1)';
          default: return 'rgba(201, 203, 207, 1)';
        }
      },
      backgroundColor: '#333',
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
    const chartDom = this.el.nativeElement.querySelector('#main-chart');
    this.chartInstance = echarts.init(chartDom);

    const option = this.getChartOptions();
    this.chartInstance.setOption(option);
  }

  private getChartOptions(): echarts.EChartsOption {
    return {
      title: {
        text: 'Demanda por Estación',
        left: 'center',
        top: '4%',
        textStyle: { color: this.themeConfig[this.theme].titleColor },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: { color: this.themeConfig[this.theme].tooltipTextColor }
      },
      legend: {
        data: this.estaciones,
        top: '12%',
        textStyle: { color: this.themeConfig[this.theme].legendColor },
        itemGap: 15
      },
      grid: {
        top:'20%',
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          magicType: { show: true, type: ['line', 'bar'] },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: [],
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        splitLine: { lineStyle: { color: this.themeConfig[this.theme].splitLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      },
      series: this.estaciones.map(estacion => ({
        name: estacion,
        type: 'line',
        lineStyle: { width: 2, color: this.themeConfig[this.theme].seriesLineColor(estacion) },
        data: [],
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      })),
    };
  }

  private updateChartTheme(): void {
    if (!this.chartInstance) return;

    const option = {
      title: { textStyle: { color: this.themeConfig[this.theme].titleColor } },
      tooltip: {
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: { color: this.themeConfig[this.theme].tooltipTextColor }
      },
      legend: {
        textStyle: { color: this.themeConfig[this.theme].legendColor },
      },
      xAxis: {
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      },
      yAxis: {
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        splitLine: { lineStyle: { color: this.themeConfig[this.theme].splitLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      },
      series: this.estaciones.map(estacion => ({
        lineStyle: { color: this.themeConfig[this.theme].seriesLineColor(estacion) },
      })),
    };
    this.chartInstance.setOption(option);
  }

  private observeResize(): void {
    const chartDom = this.el.nativeElement.querySelector('#main-chart');
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
    this.resizeObserver.observe(chartDom);
  }

  private updateChartData(estacionesRutaDemanda: IEstacionesRutaDemanda[]): void {
    if (!this.chartInstance) return;

    const labels = Array.from(new Set(estacionesRutaDemanda.map(d => new Date(d.hora).toLocaleTimeString())));
    
    const aggregatedData = estacionesRutaDemanda.reduce((acc, curr) => {
      const timeKey = new Date(curr.hora).toLocaleTimeString();
      if (!acc[curr.estacion]) {
        acc[curr.estacion] = {};
      }
      if (!acc[curr.estacion][timeKey]) {
        acc[curr.estacion][timeKey] = 0;
      }
      acc[curr.estacion][timeKey] += curr.pasajerosEsperando;
      return acc;
    }, {} as Record<Estacion, Record<string, number>>);

    const seriesData = this.estaciones.map(estacion => ({
      name: estacion,
      data: labels.map(label => aggregatedData[estacion]?.[label] || 0),
    }));

    this.chartInstance.setOption({
      xAxis: { data: labels },
      series: seriesData.map(data => ({
        ...data,
        type: 'line',
        animationDurationUpdate: 800,
        animationEasingUpdate: 'cubicInOut',
      })),
    });
  }

  private onResize(): void {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }
}

