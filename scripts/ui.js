/**
 * ============================================================================
 * UI MODULE - User Interface Interactions
 * ============================================================================
 * 
 * Управление всеми UI взаимодействиями:
 * - Автокомплит
 * - Модальные окна
 * - Фильтры и кнопки
 * - Уведомления
 */

class UIManager {
  constructor() {
    this.autocomplete = {
      start: null,
      end: null
    };
    this.modals = {};
    
    this.init();
  }
  
  /**
   * Инициализация UI
   */
  init() {
    console.log('🎨 Initializing UI...');
    
    this.initAutocomplete();
    this.initModals();
    this.initButtons();
    this.initToggles();
    this.initNotifications();
    
    console.log('✅ UI initialized');
  }
  
  /**
   * Инициализация автокомплита для адресов
   */
  initAutocomplete() {
    const startInput = document.getElementById('start-input');
    const endInput = document.getElementById('end-input');
    
    if (startInput) {
      this.setupAutocomplete(startInput, 'start');
    }
    
    if (endInput) {
      this.setupAutocomplete(endInput, 'end');
    }
  }
  
  /**
   * Настройка автокомплита для инпута
   * @param {HTMLElement} input - Input элемент
   * @param {string} type - 'start' или 'end'
   */
  setupAutocomplete(input, type) {
    const dropdown = document.getElementById(`${type}-suggestions`);
    if (!dropdown) return;
    
    // Debounced поиск
    const search = utils.debounce((query) => {
      if (query.length < 2) {
        dropdown.classList.remove('active');
        return;
      }
      
      const results = this.searchPlaces(query);
      this.displayAutocompleteResults(dropdown, results, type);
    }, 300);
    
    input.addEventListener('input', (e) => {
      search(e.target.value);
    });
    
    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  }
  
  /**
   * Поиск мест по запросу
   * @param {string} query - Поисковый запрос
   * @returns {Array} Массив результатов
   */
  searchPlaces(query) {
    const lowerQuery = query.toLowerCase();
    
    return window.appData.popularPlaces
      .filter(place =>
        place.name.toLowerCase().includes(lowerQuery) ||
        place.address.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5); // Топ-5 результатов
  }
  
  /**
   * Отображение результатов автокомплита
   * @param {HTMLElement} dropdown - Dropdown элемент
   * @param {Array} results - Результаты поиска
   * @param {string} type - 'start' или 'end'
   */
  displayAutocompleteResults(dropdown, results, type) {
    if (results.length === 0) {
      dropdown.classList.remove('active');
      return;
    }
    
    dropdown.innerHTML = results.map(place => `
      <div class="autocomplete-item" data-lat="${place.lat}" data-lng="${place.lng}" data-type="${type}">
        <div class="autocomplete-item-title">${this.getPlaceIcon(place.type)} ${place.name}</div>
        <div class="autocomplete-item-subtitle">${place.address}</div>
      </div>
    `).join('');
    
    dropdown.classList.add('active');
    
    // Обработчики кликов по результатам
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        const type = item.dataset.type;
        
        this.selectPlace(type, lat, lng, item.querySelector('.autocomplete-item-title').textContent);
      });
    });
  }
  
  /**
   * Получить иконку для типа места
   * @param {string} type - Тип места
   * @returns {string} Эмодзи иконка
   */
  getPlaceIcon(type) {
    const icons = {
      square: '🏛️',
      landmark: '🏰',
      transport: '🚂',
      shopping: '🛍️',
      education: '🎓',
      park: '🌳',
      culture: '🎭',
      hospital: '🏥',
      residential: '🏘️',
      street: '🛣️'
    };
    return icons[type] || '📍';
  }
  
  /**
   * Выбор места из автокомплита
   * @param {string} type - 'start' или 'end'
   * @param {number} lat - Широта
   * @param {number} lng - Долгота
   * @param {string} name - Название места
   */
  selectPlace(type, lat, lng, name) {
    const input = document.getElementById(`${type}-input`);
    const dropdown = document.getElementById(`${type}-suggestions`);
    
    if (input) {
      input.value = name;
    }
    
    if (dropdown) {
      dropdown.classList.remove('active');
    }
    
    // Устанавливаем точку на карте
    if (window.mapManager) {
      if (type === 'start') {
        window.mapManager.setStartPoint(lat, lng);
      } else {
        window.mapManager.setEndPoint(lat, lng);
      }
    }
    
    // Проверяем можно ли построить маршрут
    this.checkRouteReady();
  }
  
  /**
   * Обновить input из клика по карте
   * @param {string} type - 'start' или 'end'
   * @param {number} lat - Широта
   * @param {number} lng - Долгота
   */
  updateInputFromMap(type, lat, lng) {
    const input = document.getElementById(`${type}-input`);
    if (input) {
      input.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
    
    this.checkRouteReady();
  }
  
  /**
   * Проверить готовность к построению маршрута
   */
  checkRouteReady() {
    const findBtn = document.getElementById('find-route-btn');
    if (!findBtn) return;
    
    const hasStart = window.mapManager?.selectedPoints.start !== null;
    const hasEnd = window.mapManager?.selectedPoints.end !== null;
    
    findBtn.disabled = !(hasStart && hasEnd);
  }
  
  /**
   * Инициализация модальных окон
   */
  initModals() {
    // Info modal
    const infoBtn = document.getElementById('info-btn');
    const infoModal = document.getElementById('info-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (infoBtn && infoModal) {
      infoBtn.addEventListener('click', () => {
        infoModal.classList.add('active');
      });
      
      closeModalBtn?.addEventListener('click', () => {
        infoModal.classList.remove('active');
      });
      
      modalOverlay?.addEventListener('click', () => {
        infoModal.classList.remove('active');
      });
    }
    
    // Charts modal
    const chartsBtn = document.getElementById('show-charts-btn');
    const chartsModal = document.getElementById('charts-modal');
    const closeChartsBtn = document.getElementById('close-charts');
    const chartsOverlay = document.getElementById('charts-overlay');
    
    if (chartsBtn && chartsModal) {
      chartsBtn.addEventListener('click', () => {
        chartsModal.classList.add('active');
        // Инициализируем графики при открытии
        if (window.chartsManager) {
          window.chartsManager.init();
        }
      });
      
      closeChartsBtn?.addEventListener('click', () => {
        chartsModal.classList.remove('active');
      });
      
      chartsOverlay?.addEventListener('click', () => {
        chartsModal.classList.remove('active');
      });
    }
    
    // Escape key для закрытия модалок
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });
  }
  
  /**
   * Инициализация кнопок
   */
  initButtons() {
    // Find route button
    const findBtn = document.getElementById('find-route-btn');
    if (findBtn) {
      findBtn.addEventListener('click', () => {
        this.handleFindRoute();
      });
    }
    
    // Clear route button
    const clearBtn = document.getElementById('clear-route');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.handleClearRoute();
      });
    }
    
    // Swap points button
    const swapBtn = document.getElementById('swap-points');
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        this.handleSwapPoints();
      });
    }
    
    // Map controls
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
    
    const layersBtn = document.getElementById('layers-btn');
    const layersPanel = document.getElementById('layers-panel');
    if (layersBtn && layersPanel) {
      layersBtn.addEventListener('click', () => {
        layersPanel.classList.toggle('active');
      });
    }
    
    const locateBtn = document.getElementById('locate-btn');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        this.handleLocate();
      });
    }
    
    // Ripple effect на кнопках
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('click', utils.createRipple);
    });
  }
  
  /**
   * Инициализация переключателей (toggles)
   */
  initToggles() {
    // Layer toggles
    const layerToggles = document.querySelectorAll('#layers-panel input[type="checkbox"]');
    layerToggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const layerId = e.target.id.replace('layer-', '');
        const layerMap = {
          'heatmap': 'heatmap',
          'crime': 'crimeMarkers',
          'lights': 'lightMarkers',
          'districts': 'districts'
        };
        
        const layerName = layerMap[layerId];
        if (layerName && window.mapManager) {
          window.mapManager.toggleLayer(layerName, e.target.checked);
        }
      });
    });
  }
  
  /**
   * Инициализация системы уведомлений
   */
  initNotifications() {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.add('hidden');
      });
    }
  }
  
  /**
   * Обработка построения маршрута
   */
  async handleFindRoute() {
    const findBtn = document.getElementById('find-route-btn');
    if (!findBtn || findBtn.disabled) return;
    
    // Показываем loading
    findBtn.classList.add('loading');
    findBtn.disabled = true;
    
    try {
      // Получаем опции
      const options = {
        prioritizeSafety: document.getElementById('prioritize-safety')?.checked ?? true,
        avoidDarkStreets: document.getElementById('avoid-dark-streets')?.checked ?? true,
        timeOfDay: document.getElementById('time-of-day')?.value ?? 'night'
      };
      
      // Находим ближайшие узлы к выбранным точкам
      const start = window.mapManager.selectedPoints.start;
      const end = window.mapManager.selectedPoints.end;
      
      const startNode = utils.getNearestNode(start.lat, start.lng, window.appData.streetGraph.nodes);
      const endNode = utils.getNearestNode(end.lat, end.lng, window.appData.streetGraph.nodes);
      
      console.log('🚀 Finding route...', { startNode, endNode, options });
      
      // Имитация задержки для визуального эффекта
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Построение маршрута
      const route = window.routingEngine.findRoute(startNode.id, endNode.id, options);
      
      if (route) {
        // Отображаем маршрут на карте
        window.mapManager.displayRoute(route);
        
        // Обновляем результаты
        this.displayRouteResults(route);
        
        // Генерируем инсайты
        const insights = window.generateInsights(route);
        this.displayInsights(insights);
        
        // Обновляем KPI
        if (window.kpiManager) {
          window.kpiManager.updateFromRoute(route);
        }
        
        // Показываем успех
        utils.showNotification('✅ Trasa úspěšně naplánována!', 'success');
        
        // Confetti для высокой безопасности
        if (route.safetyScore >= 80) {
          utils.launchConfetti(2000);
        }
      } else {
        utils.showNotification('❌ Nepodařilo se najít trasu', 'error');
      }
      
    } catch (error) {
      console.error('Error finding route:', error);
      utils.showNotification('❌ Chyba při hledání trasy', 'error');
    } finally {
      findBtn.classList.remove('loading');
      findBtn.disabled = false;
    }
  }
  
  /**
   * Отображение результатов маршрута
   * @param {Object} route - Объект маршрута
   */
  displayRouteResults(route) {
    const resultsSection = document.getElementById('route-results');
    if (!resultsSection) return;
    
    // Обновляем значения
    document.getElementById('route-distance').textContent = utils.formatDistance(route.totalDistance);
    document.getElementById('route-time').textContent = utils.formatTime(route.estimatedTime);
    document.getElementById('route-lighting').textContent = `${route.lightingCoverage}%`;
    document.getElementById('route-safety').textContent = `${route.safetyScore}/100`;
    
    // Устанавливаем класс безопасности
    const safetyEl = document.getElementById('route-safety');
    safetyEl.className = 'stat-value';
    if (route.safetyScore >= 70) {
      safetyEl.classList.add('safety-high');
    } else if (route.safetyScore >= 40) {
      safetyEl.classList.add('safety-medium');
    } else {
      safetyEl.classList.add('safety-low');
    }
    
    // Показываем секцию
    resultsSection.classList.remove('hidden');
  }
  
  /**
   * Отображение инсайтов
   * @param {Array} insights - Массив инсайтов
   */
  displayInsights(insights) {
    const insightsSection = document.getElementById('insights-section');
    const insightsContent = document.getElementById('insights-content');
    
    if (!insightsSection || !insightsContent) return;
    
    insightsContent.innerHTML = insights.map(insight => `
      <div class="insight-card ${insight.type}">
        <div class="insight-header">
          <span class="insight-icon">${insight.icon}</span>
          <span>${insight.title}</span>
        </div>
        <ul class="insight-list">
          ${insight.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');
    
    insightsSection.classList.remove('hidden');
  }
  
  /**
   * Очистка маршрута
   */
  handleClearRoute() {
    // Очищаем карту
    if (window.mapManager) {
      window.mapManager.clearRoute();
      window.mapManager.clearPoints();
    }
    
    // Очищаем inputs
    document.getElementById('start-input').value = '';
    document.getElementById('end-input').value = '';
    
    // Скрываем результаты
    document.getElementById('route-results')?.classList.add('hidden');
    document.getElementById('insights-section')?.classList.add('hidden');
    
    // Блокируем кнопку поиска
    document.getElementById('find-route-btn').disabled = true;
  }
  
  /**
   * Обмен точек A и B
   */
  handleSwapPoints() {
    const startInput = document.getElementById('start-input');
    const endInput = document.getElementById('end-input');
    
    if (startInput && endInput) {
      const temp = startInput.value;
      startInput.value = endInput.value;
      endInput.value = temp;
    }
    
    if (window.mapManager) {
      const temp = window.mapManager.selectedPoints.start;
      window.mapManager.selectedPoints.start = window.mapManager.selectedPoints.end;
      window.mapManager.selectedPoints.end = temp;
      
      // Обновляем маркеры
      if (window.mapManager.selectedPoints.start) {
        window.mapManager.setStartPoint(
          window.mapManager.selectedPoints.start.lat,
          window.mapManager.selectedPoints.start.lng
        );
      }
      
      if (window.mapManager.selectedPoints.end) {
        window.mapManager.setEndPoint(
          window.mapManager.selectedPoints.end.lat,
          window.mapManager.selectedPoints.end.lng
        );
      }
    }
  }
  
  /**
   * Переключение полноэкранного режима
   */
  toggleFullscreen() {
    const mapSection = document.querySelector('.map-section');
    if (!mapSection) return;
    
    if (!document.fullscreenElement) {
      mapSection.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  /**
   * Определение текущей позиции
   */
  async handleLocate() {
    try {
      const position = await utils.getCurrentPosition();
      
      if (window.mapManager) {
        window.mapManager.flyTo(position.lat, position.lng, 15);
      }
      
      utils.showNotification('📍 Vaše poloha nalezena', 'success');
    } catch (error) {
      console.error('Geolocation error:', error);
      utils.showNotification('❌ Nelze získat polohu', 'error');
    }
  }
}

// Экспорт
window.UIManager = UIManager;
