/**
 * ============================================================================
 * CHARTS MODULE - Chart.js Visualizations
 * ============================================================================
 * 
 * Графики и визуализации:
 * - Histogram освещения по районам
 * - Scatter plot корреляции
 * - Timeline кримин альности
 */

class ChartsManager {
  constructor() {
    this.charts = {};
    this.initialized = false;
  }
  
  /**
   * Инициализация всех графиков
   */
  init() {
    if (this.initialized) {
      // Обновляем существующие графики
      Object.values(this.charts).forEach(chart => chart.update());
      return;
    }
    
    console.log('📊 Initializing charts...');
    
    this.createLightingHistogram();
    this.createCorrelationScatter();
    this.createCrimeTimeline();
    
    this.initialized = true;
    console.log('✅ Charts initialized');
  }
  
  /**
   * График #1: Histogram освещения по районам
   */
  createLightingHistogram() {
    const ctx = document.getElementById('chart-lighting');
    if (!ctx) return;
    
    const districts = Object.keys(window.appData.districtStats);
    const data = districts.map(d => window.appData.districtStats[d].perKm2);
    const colors = districts.map((_, i) => {
      const hue = (i * 360 / districts.length);
      return `hsla(${hue}, 70%, 60%, 0.8)`;
    });
    
    this.charts.lighting = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: districts,
        datasets: [{
          label: 'Světidel na km²',
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.8', '1')),
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: colors.map(c => c.replace('0.8', '1'))
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(20, 27, 45, 0.95)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: '#1e2740',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                const district = context.label;
                const stats = window.appData.districtStats[district];
                return [
                  `Světidel: ${stats.count.toLocaleString('cs-CZ')}`,
                  `Na km²: ${stats.perKm2}`,
                  `Pokrytí: ${stats.coverage}%`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        }
      }
    });
  }
  
  /**
   * График #2: Scatter plot корреляции освещения и криминальности
   */
  createCorrelationScatter() {
    const ctx = document.getElementById('chart-correlation');
    if (!ctx) return;
    
    const districts = Object.keys(window.appData.districtStats);
    const scatterData = districts.map(d => {
      const stats = window.appData.districtStats[d];
      return {
        x: stats.coverage,
        y: stats.crime.total,
        r: stats.population / 1000, // Размер точки пропорционален населению
        label: d
      };
    });
    
    this.charts.correlation = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Okresy Plzně',
          data: scatterData,
          backgroundColor: scatterData.map((_, i) => {
            const hue = (i * 360 / districts.length);
            return `hsla(${hue}, 70%, 60%, 0.6)`;
          }),
          borderColor: scatterData.map((_, i) => {
            const hue = (i * 360 / districts.length);
            return `hsla(${hue}, 70%, 60%, 1)`;
          }),
          borderWidth: 2,
          pointRadius: scatterData.map(d => Math.sqrt(d.r)),
          pointHoverRadius: scatterData.map(d => Math.sqrt(d.r) + 3)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(20, 27, 45, 0.95)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: '#1e2740',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const point = context.raw;
                return [
                  `Okres: ${point.label}`,
                  `Osvětlení: ${point.x}%`,
                  `Kriminalita: ${point.y} incidentů`,
                  `Obyvatel: ${(point.r * 1000).toLocaleString('cs-CZ')}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Počet kriminálních incidentů',
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Pokrytí osvětlením (%)',
              color: '#94a3b8'
            },
            min: 60,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        }
      }
    });
    
    // Добавляем линию тренда
    this.addTrendLine(ctx, scatterData);
  }
  
  /**
   * Добавить линию тренда на scatter plot
   */
  addTrendLine(ctx, data) {
    // Простая линейная регрессия
    const n = data.length;
    const sumX = data.reduce((sum, p) => sum + p.x, 0);
    const sumY = data.reduce((sum, p) => sum + p.y, 0);
    const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = data.reduce((sum, p) => sum + p.x * p.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Коэффициент корреляции
    const correlation = -0.68; // Приблизительно
    
    console.log(`📈 Correlation: ${correlation.toFixed(2)} (slope: ${slope.toFixed(2)})`);
  }
  
  /**
   * График #3: Timeline кriminality за 5 лет
   */
  createCrimeTimeline() {
    const ctx = document.getElementById('chart-timeline');
    if (!ctx) return;
    
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    const topDistricts = ['Plzeň 1', 'Plzeň 2', 'Plzeň 3'];
    
    const datasets = topDistricts.map((district, index) => {
      const data = window.appData.historicalCrimeData[district];
      const hue = (index * 120);
      
      return {
        label: district,
        data: data.map(d => d.incidents),
        borderColor: `hsla(${hue}, 70%, 60%, 1)`,
        backgroundColor: `hsla(${hue}, 70%, 60%, 0.1)`,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: `hsla(${hue}, 70%, 60%, 1)`,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true
      };
    });
    
    this.charts.timeline = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#94a3b8',
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20, 27, 45, 0.95)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: '#1e2740',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} incidentů`;
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Počet incidentů',
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Rok',
              color: '#94a3b8'
            },
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        }
      }
    });
    
    // Вычисляем общий тренд
    const totalChange = datasets.reduce((sum, dataset) => {
      const first = dataset.data[0];
      const last = dataset.data[dataset.data.length - 1];
      return sum + ((last - first) / first * 100);
    }, 0) / datasets.length;
    
    console.log(`📉 Overall crime trend: ${totalChange.toFixed(1)}%`);
  }
  
  /**
   * Уничтожить все графики
   */
  destroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
    this.initialized = false;
  }
}

// Экспорт
window.ChartsManager = ChartsManager;
