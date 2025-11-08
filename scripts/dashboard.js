/**
 * DASHBOARD.JS - Analytics Dashboard для Bezpečné trasy Plzní
 * 
 * Космическая тема с крутыми анимациями и графиками
 */

// ============================================================================
// MOCK DATA - готово для замены на реальные данные
// ============================================================================

const mockData = {
    metrics: {
        lighting: 10247,
        safety: 94.6,
        routes: 15834,
        coverage: 87.3,
        datapoints: 15847,
        speed: 127
    },
    
    districts: [
        { name: 'Центр', lighting: 96.5, incidents: 12, safety: 9.4, change: 2.3 },
        { name: 'Боры', lighting: 94.2, incidents: 18, safety: 9.1, change: 1.8 },
        { name: 'Скврняны', lighting: 92.8, incidents: 15, safety: 8.9, change: -0.5 },
        { name: 'Лочотин', lighting: 91.3, incidents: 22, safety: 8.6, change: 1.2 },
        { name: 'Литице', lighting: 89.5, incidents: 25, safety: 8.3, change: 0.7 },
        { name: 'Радчице', lighting: 87.2, incidents: 28, safety: 8.0, change: -1.3 },
        { name: 'Дудлевец', lighting: 85.6, incidents: 31, safety: 7.7, change: 0.9 },
        { name: 'Кршимице', lighting: 83.1, incidents: 35, safety: 7.4, change: -0.4 }
    ],
    
    lightingByDistrict: {
        labels: ['Центр', 'Боры', 'Скврняны', 'Лочотин', 'Литице', 'Радчице'],
        data: [96.5, 94.2, 92.8, 91.3, 89.5, 87.2]
    },
    
    crimeByHour: {
        labels: ['0:00', '3:00', '6:00', '9:00', '12:00', '15:00', '18:00', '21:00'],
        data: [45, 22, 8, 15, 28, 35, 52, 68]
    },
    
    crimeTypes: {
        labels: ['Кражи', 'Грабежи', 'Вандализм', 'Нападения', 'Другое'],
        data: [142, 67, 89, 43, 56]
    },
    
    safetyTrend: {
        labels: ['Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя'],
        data: [88.2, 89.5, 90.8, 92.1, 93.4, 94.6]
    },
    
    routeHeatmap: {
        hours: ['0', '4', '8', '12', '16', '20'],
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        data: [
            [12, 8, 6, 5, 7, 15, 28],
            [18, 12, 9, 8, 11, 22, 35],
            [45, 38, 42, 46, 52, 58, 62],
            [68, 72, 75, 78, 82, 88, 92],
            [82, 85, 88, 92, 95, 98, 102],
            [56, 52, 48, 45, 58, 78, 95]
        ]
    },
    
    lightQuality: {
        labels: ['LED Высокая', 'LED Средняя', 'Натриевые', 'Галогенные', 'Неисправные'],
        data: [4250, 3180, 2120, 580, 117]
    }
};

// ============================================================================
// ANIMATIONS - счетчики с эффектами
// ============================================================================

function animateCounter(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (suffix === '%' || suffix === 'мс') {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current).toLocaleString('ru-RU') + suffix;
        }
    }, 16);
}

function initMetrics() {
    const metrics = mockData.metrics;
    
    // Анимация метрик с задержкой для эффекта
    setTimeout(() => {
        animateCounter(document.getElementById('lighting-metric'), metrics.lighting, ' ламп');
    }, 300);
    
    setTimeout(() => {
        animateCounter(document.getElementById('safety-metric'), metrics.safety, '%');
    }, 500);
    
    setTimeout(() => {
        animateCounter(document.getElementById('routes-metric'), metrics.routes);
    }, 700);
    
    setTimeout(() => {
        animateCounter(document.getElementById('coverage-metric'), metrics.coverage, '%');
    }, 900);
    
    setTimeout(() => {
        animateCounter(document.getElementById('datapoints-metric'), metrics.datapoints);
    }, 1100);
    
    setTimeout(() => {
        animateCounter(document.getElementById('speed-metric'), metrics.speed, 'мс');
    }, 1300);
}

// ============================================================================
// CHART.JS CONFIGURATIONS - общие настройки
// ============================================================================

const chartColors = {
    green1: 'rgba(94, 252, 130, 0.8)',
    green2: 'rgba(61, 214, 140, 0.8)',
    green3: 'rgba(42, 181, 113, 0.8)',
    cyan: 'rgba(77, 212, 172, 0.8)',
    teal: 'rgba(20, 184, 166, 0.8)',
    green1Light: 'rgba(94, 252, 130, 0.2)',
    green2Light: 'rgba(61, 214, 140, 0.2)',
    green3Light: 'rgba(42, 181, 113, 0.2)'
};

const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#a7f3d0',
                font: {
                    family: 'Inter',
                    size: 12
                },
                padding: 15
            }
        },
        tooltip: {
            backgroundColor: 'rgba(17, 25, 23, 0.95)',
            titleColor: '#f0fdf4',
            bodyColor: '#a7f3d0',
            borderColor: 'rgba(94, 252, 130, 0.3)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {}
        }
    },
    scales: {
        y: {
            ticks: {
                color: '#64748b',
                font: {
                    family: 'Inter',
                    size: 11
                }
            },
            grid: {
                color: 'rgba(94, 252, 130, 0.08)',
                drawBorder: false
            }
        },
        x: {
            ticks: {
                color: '#64748b',
                font: {
                    family: 'Inter',
                    size: 11
                }
            },
            grid: {
                color: 'rgba(94, 252, 130, 0.08)',
                drawBorder: false
            }
        }
    }
};

// ============================================================================
// CHARTS INITIALIZATION - все графики
// ============================================================================

function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

function createGreenGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(94, 252, 130, 0.8)');
    gradient.addColorStop(1, 'rgba(94, 252, 130, 0.2)');
    return gradient;
}

function initCharts() {
    // Chart 1: Освещенность по районам (Bar Chart)
    const lightingCtx = document.getElementById('lightingChart').getContext('2d');
    const gradientGreen = createGreenGradient(lightingCtx);
    
    new Chart(lightingCtx, {
        type: 'bar',
        data: {
            labels: mockData.lightingByDistrict.labels,
            datasets: [{
                label: 'Уровень освещенности (%)',
                data: mockData.lightingByDistrict.data,
                backgroundColor: gradientGreen,
                borderColor: chartColors.green1,
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    display: false
                }
            }
        }
    });

    // Chart 2: Инциденты по времени (Line Chart)
    const crimeTimeCtx = document.getElementById('crimeTimeChart').getContext('2d');
    const gradientGreen2 = createGradient(crimeTimeCtx, 'rgba(61, 214, 140, 0.4)', 'rgba(61, 214, 140, 0.05)');
    
    new Chart(crimeTimeCtx, {
        type: 'line',
        data: {
            labels: mockData.crimeByHour.labels,
            datasets: [{
                label: 'Количество инцидентов',
                data: mockData.crimeByHour.data,
                fill: true,
                backgroundColor: gradientGreen2,
                borderColor: chartColors.green2,
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: chartColors.green2,
                pointBorderColor: '#0a0f0d',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    display: false
                }
            }
        }
    });

    // Chart 3: Типы инцидентов (Doughnut Chart)
    const crimeTypesCtx = document.getElementById('crimeTypesChart').getContext('2d');
    
    new Chart(crimeTypesCtx, {
        type: 'doughnut',
        data: {
            labels: mockData.crimeTypes.labels,
            datasets: [{
                data: mockData.crimeTypes.data,
                backgroundColor: [
                    chartColors.green1,
                    chartColors.green2,
                    chartColors.green3,
                    chartColors.cyan,
                    chartColors.teal
                ],
                borderColor: '#0a0f0d',
                borderWidth: 3,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a7f3d0',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: defaultChartOptions.plugins.tooltip
            }
        }
    });

    // Chart 4: Тренд безопасности (Area Chart)
    const safetyTrendCtx = document.getElementById('safetyTrendChart').getContext('2d');
    const gradientGreen3 = createGradient(safetyTrendCtx, 'rgba(77, 212, 172, 0.4)', 'rgba(77, 212, 172, 0.05)');
    
    new Chart(safetyTrendCtx, {
        type: 'line',
        data: {
            labels: mockData.safetyTrend.labels,
            datasets: [{
                label: 'Уровень безопасности (%)',
                data: mockData.safetyTrend.data,
                fill: true,
                backgroundColor: gradientGreen3,
                borderColor: chartColors.cyan,
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: chartColors.cyan,
                pointBorderColor: '#0a0f0d',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    display: false
                }
            }
        }
    });

    // Chart 5: Heatmap маршрутов (Matrix visualization using Bar chart)
    const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
    
    // Преобразуем матрицу в линейные данные для визуализации
    const heatmapData = mockData.routeHeatmap;
    const datasets = heatmapData.hours.map((hour, idx) => ({
        label: hour + ':00',
        data: heatmapData.data[idx],
        backgroundColor: `rgba(${94 - idx * 10}, ${252 - idx * 20}, ${130 + idx * 5}, 0.7)`,
        borderRadius: 4
    }));
    
    new Chart(heatmapCtx, {
        type: 'bar',
        data: {
            labels: heatmapData.days,
            datasets: datasets
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a7f3d0',
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 10,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    ...defaultChartOptions.plugins.tooltip,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' маршрутов';
                        }
                    }
                }
            }
        }
    });

    // Chart 6: Качество освещения (Polar Area Chart)
    const lightQualityCtx = document.getElementById('lightQualityChart').getContext('2d');
    
    new Chart(lightQualityCtx, {
        type: 'polarArea',
        data: {
            labels: mockData.lightQuality.labels,
            datasets: [{
                data: mockData.lightQuality.data,
                backgroundColor: [
                    'rgba(94, 252, 130, 0.7)',
                    'rgba(61, 214, 140, 0.7)',
                    'rgba(42, 181, 113, 0.7)',
                    'rgba(77, 212, 172, 0.7)',
                    'rgba(20, 184, 166, 0.7)'
                ],
                borderColor: '#0a0f0d',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a7f3d0',
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 12
                    }
                },
                tooltip: {
                    ...defaultChartOptions.plugins.tooltip,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.r.toLocaleString('ru-RU') + ' ламп';
                        }
                    }
                }
            },
            scales: {
                r: {
                    ticks: {
                        color: '#64748b',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(94, 252, 130, 0.1)'
                    }
                }
            }
        }
    });
}

// ============================================================================
// DATA TABLE - таблица районов
// ============================================================================

function initDataTable() {
    const tbody = document.getElementById('districtTableBody');
    
    mockData.districts.forEach((district, index) => {
        const row = document.createElement('tr');
        row.classList.add('fade-in');
        row.style.animationDelay = `${index * 0.05}s`;
        
        const changeClass = district.change >= 0 ? 'positive' : 'negative';
        const changeIcon = district.change >= 0 ? '↑' : '↓';
        
        row.innerHTML = `
            <td><strong style="color: var(--accent-green-1);">#${index + 1}</strong></td>
            <td><strong>${district.name}</strong></td>
            <td>${district.lighting}%</td>
            <td>${district.incidents}</td>
            <td>
                <span style="color: ${district.safety >= 9 ? '#5efc82' : district.safety >= 8 ? '#4dd4ac' : '#64748b'};">
                    ${district.safety.toFixed(1)}/10
                </span>
            </td>
            <td>
                <span class="metric-change ${changeClass}">
                    ${changeIcon} ${Math.abs(district.change)}%
                </span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Создаем shooting stars для космического фона
function createShootingStars() {
    const background = document.querySelector('.cosmic-background');
    
    setInterval(() => {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = Math.random() * 50 + '%';
        star.style.top = Math.random() * 50 + '%';
        
        background.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 3000);
    }, 4000);
}

// ============================================================================
// INITIALIZATION - запуск всего
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard initialization started...');
    
    // Инициализация метрик с анимацией
    initMetrics();
    
    // Инициализация всех графиков
    initCharts();
    
    // Заполнение таблицы данных
    initDataTable();
    
    // Создание звездопадов
    createShootingStars();
    
    console.log('✅ Dashboard ready!');
    
    // Показываем градиентные тексты после загрузки
    document.querySelectorAll('.hero-title, .section-title').forEach(el => {
        el.style.opacity = '1';
    });
});

// Export для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockData,
        animateCounter,
        scrollToSection
    };
}
