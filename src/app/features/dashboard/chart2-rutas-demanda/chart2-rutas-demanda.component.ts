import { Component, effect, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Ruta, IEstacionesRutaDemanda } from '../../../core/models/historico.model';
import * as echarts from 'echarts';
import { NgClass } from '@angular/common';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-chart2-rutas-demanda',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chart2-rutas-demanda.component.html',
  styleUrls: ['./chart2-rutas-demanda.component.scss']
})
export class Chart2RutasDemandaComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);
  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;
  rutas = [Ruta.B, Ruta.Exp1];
  theme: Theme = this.themeService.isDark() ? 'dark' : 'light';

  private themeConfig: Record<Theme, {
    titleColor: string;
    tooltipBackground: string;
    tooltipBorder: string;
    tooltipTextColor: string; // Nuevo: Color del texto en el tooltip
    legendColor: string;
    axisLineColor: string;
    axisLabelColor: string;
    splitLineColor: string;
    seriesColor: (ruta: Ruta) => string;
    backgroundColor: string;
  }> = {
    light: {
      titleColor: '#111',
      tooltipBackground: '#ffffff',
      tooltipBorder: '#ccc',
      tooltipTextColor: '#111', // Color oscuro para texto en tooltip en modo claro
      legendColor: '#111',
      axisLineColor: '#111',
      axisLabelColor: '#111',
      splitLineColor: 'rgba(0, 0, 0, 0.1)',
      seriesColor: (ruta: Ruta) => {
        switch (ruta) {
          case Ruta.B: return 'rgba(75, 192, 192, 1)';
          case Ruta.Exp1: return 'rgba(54, 162, 235, 1)';
          default: return 'rgba(201, 203, 207, 1)';
        }
      },
      backgroundColor: '#fff',
    },
    dark: {
      titleColor: '#fff',
      tooltipBackground: 'rgba(0, 0, 0, 0.7)',
      tooltipBorder: '#777',
      tooltipTextColor: '#ffffff', // Color claro para texto en tooltip en modo oscuro
      legendColor: '#fff',
      axisLineColor: '#777',
      axisLabelColor: '#fff',
      splitLineColor: 'rgba(255, 255, 255, 0.1)',
      seriesColor: (ruta: Ruta) => {
        switch (ruta) {
          case Ruta.B: return 'rgba(75, 192, 192, 1)';
          case Ruta.Exp1: return 'rgba(54, 162, 235, 1)';
          default: return 'rgba(201, 203, 207, 1)';
        }
      },
      backgroundColor: '#333',
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
    const chartDom = this.el.nativeElement.querySelector('#rutas-chart');
    this.chartInstance = echarts.init(chartDom);

    const option = this.getChartOptions();
    this.chartInstance.setOption(option);
  }

  private getChartOptions(): echarts.EChartsOption {
    return {
      title: {
        text: 'Demanda por Ruta',
        left: 'center',
        top: '4%',
        textStyle: { color: this.themeConfig[this.theme].titleColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: { color: this.themeConfig[this.theme].tooltipTextColor } // Color del texto en el tooltip
      },
      legend: {
        data: this.rutas,
        top: '12%',
        textStyle: { color: this.themeConfig[this.theme].legendColor },
      },
      grid: {
        top:'20%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          // restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [{
        type: 'category',
        axisTick: { show: false },
        data: [],
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      }],
      yAxis: [{
        type: 'value',
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        splitLine: { lineStyle: { color: this.themeConfig[this.theme].splitLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      }],
      // backgroundColor: this.themeConfig[this.theme].backgroundColor,
      series: this.rutas.map(ruta => ({
        name: ruta,
        type: 'bar',
        barGap: 0,
        emphasis: { focus: 'series' },
        itemStyle: { color: this.themeConfig[this.theme].seriesColor(ruta) },
        data: []
      }))
    };
  }

  private updateChartTheme(): void {
    if (!this.chartInstance) return;

    const option = {
      title: { textStyle: { color: this.themeConfig[this.theme].titleColor } },
      tooltip: {
        backgroundColor: this.themeConfig[this.theme].tooltipBackground,
        borderColor: this.themeConfig[this.theme].tooltipBorder,
        textStyle: { color: this.themeConfig[this.theme].tooltipTextColor } // Actualiza el color del texto en el tooltip
      },
      legend: { textStyle: { color: this.themeConfig[this.theme].legendColor } },
      xAxis: [{
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      }],
      yAxis: [{
        axisLine: { lineStyle: { color: this.themeConfig[this.theme].axisLineColor } },
        splitLine: { lineStyle: { color: this.themeConfig[this.theme].splitLineColor } },
        axisLabel: { color: this.themeConfig[this.theme].axisLabelColor },
      }],
      // backgroundColor: this.themeConfig[this.theme].backgroundColor,
      series: this.rutas.map(ruta => ({
        itemStyle: { color: this.themeConfig[this.theme].seriesColor(ruta) }
      }))
    };

    this.chartInstance.setOption(option);
  }

  private observeResize(): void {
    const chartDom = this.el.nativeElement.querySelector('#rutas-chart');
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
    this.resizeObserver.observe(chartDom);
  }

  private updateChartData(estacionesRutaDemanda: IEstacionesRutaDemanda[]): void {
    if (!this.chartInstance) return;

    const labels = Array.from(
      new Set(estacionesRutaDemanda.map(d => new Date(d.hora).toLocaleTimeString()))
    );

    const seriesData = this.rutas.map(ruta => ({
      name: ruta,
      data: labels.map(label => {
        const entries = estacionesRutaDemanda.filter(
          d => d.ruta === ruta && new Date(d.hora).toLocaleTimeString() === label
        );
        return entries.reduce((sum, entry) => sum + entry.pasajerosEsperando, 0);
      }),
    }));

    this.chartInstance.setOption({
      xAxis: [{ data: labels }],
      series: seriesData.map(data => ({
        ...data,
        type: 'bar' as const,
        barGap: 0,
        // label: {
        //   show: true,
        //   position: 'insideBottom',
        //   distance: 15,
        //   align: 'left',
        //   verticalAlign: 'middle',
        //   rotate: 90,
        //   formatter: '{c}  {name|{a}}',
        //   fontSize: 16,
        //   rich: { name: {} }
        // },
        emphasis: { focus: 'series' },
      })),
    });
  }

  private onResize(): void {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }
}
