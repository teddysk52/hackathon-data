/**
 * ============================================================================
 * KPI MODULE - Dashboard Metrics
 * ============================================================================
 * 
 * Управление KPI карточками и их анимациями
 */

class KPIManager {
  constructor() {
    this.initialized = false;
    this.stats = window.appData.districtStats;
  }
  
  /**
   * Инициализация KPI с анимациями
   */
  init() {
    console.log('📊 Initializing KPI...');
    
    // Анимация KPI #1: Освещение
    this.animateLightingKPI();
    
    // Обновление KPI #2: Криминальность
    this.updateCrimeKPI();
    
    // Анимация KPI #3: Индекс безопасности
    this.animateSafetyKPI();
    
    this.initialized = true;
    console.log('✅ KPI initialized');
  }
  
  /**
   * Анимация KPI освещения
   */
  animateLightingKPI() {
    const totalLights = Object.values(this.stats).reduce((sum, s) => sum + s.count, 0);
    const avgCoverage = Object.values(this.stats).reduce((sum, s) => sum + s.coverage, 0) / Object.keys(this.stats).length;
    
    // Count-up анимация для числа светильников
    const countElement = document.querySelector('#lighting-count');
    if (countElement) {
      utils.animateCounter(countElement, 0, totalLights, 2000, (num) => {
        return num.toLocaleString('cs-CZ');
      });
    }
    
    // Анимация прогресс-бара
    const progressElement = document.getElementById('lighting-progress');
    const coverageElement = document.getElementById('lighting-coverage');
    
    if (progressElement && coverageElement) {
      setTimeout(() => {
        progressElement.style.width = `${avgCoverage}%`;
        utils.animateCounter(coverageElement, 0, avgCoverage, 1500);
      }, 500);
    }
  }
  
  /**
   * Обновление KPI криминальности
   */
  updateCrimeKPI() {
    // Находим район с наибольшей криминальностью
    let maxCrime = 0;
    let maxDistrict = null;
    
    Object.entries(this.stats).forEach(([key, value]) => {
      if (value.crime.total > maxCrime) {
        maxCrime = value.crime.total;
        maxDistrict = key;
      }
    });
    
    if (maxDistrict) {
      const districtData = this.stats[maxDistrict];
      
      // Обновляем название района
      const districtElement = document.getElementById('crime-district');
      if (districtElement) {
        districtElement.textContent = maxDistrict;
      }
      
      // Обновляем badge уровня
      const levelElement = document.getElementById('crime-level');
      if (levelElement) {
        const crimeLevel = utils.getCrimeLevel(districtData.crime.total);
        levelElement.className = `kpi-badge ${crimeLevel.class}`;
        levelElement.innerHTML = `<span class="badge-dot"></span>${crimeLevel.level}`;
      }
      
      // Обновляем количество инцидентов
      const countElement = document.getElementById('crime-count');
      if (countElement) {
        utils.animateCounter(countElement, 0, districtData.crime.total, 1500);
      }
    }
  }
  
  /**
   * Анимация KPI индекса безопасности
   */
  animateSafetyKPI() {
    // Рассчитываем средний индекс безопасности по городу
    const avgSafety = Object.values(this.stats).reduce((sum, s) => sum + s.safetyIndex, 0) / Object.keys(this.stats).length;
    
    // Count-up анимация для индекса
    const scoreElement = document.querySelector('#safety-score .score-value');
    if (scoreElement) {
      utils.animateCounter(scoreElement, 0, Math.round(avgSafety), 2000);
    }
    
    // Обновляем уровень
    const levelElement = document.getElementById('safety-level');
    if (levelElement) {
      const safetyLevel = utils.getSafetyLevel(avgSafety);
      levelElement.textContent = safetyLevel.level;
      levelElement.className = `kpi-level ${safetyLevel.class}`;
    }
    
    // Обновляем индикаторы (кружки)
    const indicatorsElement = document.getElementById('safety-indicators');
    if (indicatorsElement) {
      const filledCount = Math.round(avgSafety / 10);
      const indicators = indicatorsElement.querySelectorAll('.indicator');
      
      indicators.forEach((indicator, index) => {
        setTimeout(() => {
          if (index < filledCount) {
            indicator.classList.add('filled');
            indicator.classList.remove('empty');
          } else {
            indicator.classList.add('empty');
            indicator.classList.remove('filled');
          }
        }, index * 100);
      });
    }
  }
  
  /**
   * Обновить KPI на основе текущего маршрута
   * @param {Object} route - Объект маршрута
   */
  updateFromRoute(route) {
    if (!route) return;
    
    // Можем обновить KPI с учетом выбранного маршрута
    // Например, подсветить релевантную информацию
    console.log('📊 Updating KPI from route:', route);
    
    // Анимация изменения при выборе маршрута
    document.querySelectorAll('.kpi-card').forEach(card => {
      card.style.transform = 'scale(1.02)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  }
}

// Экспорт
window.KPIManager = KPIManager;
