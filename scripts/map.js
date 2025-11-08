/**
 * ============================================================================
 * MAP MODULE - Leaflet.js Integration
 * ============================================================================
 * 
 * Управление интерактивной картой с использованием Leaflet.js
 * - Инициализация карты
 * - Слои (heatmap, markers, districts)
 * - Интеракции (клики, hover, zoom)
 * - Отображение маршрутов
 */

class MapManager {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.map = null;
    this.layers = {
      heatmap: null,
      crimeMarkers: null,
      lightMarkers: null,
      districts: null,
      route: null
    };
    this.markers = {
      start: null,
      end: null
    };
    this.selectedPoints = {
      start: null,
      end: null
    };
    
    this.init();
  }
  
  /**
   * Инициализация карты
   */
  init() {
    console.log('🗺️ Initializing map...');
    
    // Создаём карту
    this.map = L.map(this.containerId, {
      center: [window.appData.center.lat, window.appData.center.lng],
      zoom: 13,
      zoomControl: false, // Добавим свой контрол
      attributionControl: true
    });
    
    // Добавляем темную базовую карту (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
    
    // Добавляем zoom control в правый нижний угол
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);
    
    // Инициализируем слои
    this.initLayers();
    
    // Добавляем обработчики событий
    this.attachEventListeners();
    
    console.log('✅ Map initialized');
  }
  
  /**
   * Инициализация всех слоев
   */
  initLayers() {
    this.createHeatmapLayer();
    this.createCrimeMarkersLayer();
    this.createLightMarkersLayer();
    // districts layer можно добавить позже
  }
  
  /**
   * Создать heatmap слой освещения
   */
  createHeatmapLayer() {
    const heatData = window.appData.lightingData.map(light => [
      light.lat,
      light.lng,
      light.intensity / 100 // Нормализуем интенсивность
    ]);
    
    this.layers.heatmap = L.heatLayer(heatData, {
      radius: 25,
      blur: 35,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#3b82f6',  // Синий (мало света)
        0.3: '#60a5fa',
        0.5: '#fbbf24',  // Желтый (средне)
        0.7: '#fcd34d',
        1.0: '#ffd700'   // Золотой (много света)
      }
    }).addTo(this.map);
    
    console.log(`✅ Heatmap layer created (${heatData.length} points)`);
  }
  
  /**
   * Создать слой маркеров криминальности с кластеризацией
   */
  createCrimeMarkersLayer() {
    // Используем MarkerClusterGroup для кластеризации
    this.layers.crimeMarkers = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count >= 10) size = 'large';
        else if (count >= 5) size = 'medium';
        
        return L.divIcon({
          html: `<div class="crime-cluster crime-cluster-${size}">${count}</div>`,
          className: 'crime-cluster-container',
          iconSize: L.point(40, 40)
        });
      },
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });
    
    // Добавляем маркеры
    window.appData.crimeData.forEach(crime => {
      const marker = L.marker([crime.lat, crime.lng], {
        icon: L.divIcon({
          html: '⚠️',
          className: `crime-marker crime-${crime.severity}`,
          iconSize: [30, 30]
        })
      });
      
      // Popup с информацией
      marker.bindPopup(`
        <div class="crime-popup">
          <h4>⚠️ ${crime.type}</h4>
          <p><strong>Oblast:</strong> ${crime.district}</p>
          <p><strong>Datum:</strong> ${crime.date}</p>
          <p><strong>Čas:</strong> ${crime.time}</p>
          <p><strong>Závažnost:</strong> <span class="severity-${crime.severity}">${crime.severity}</span></p>
        </div>
      `);
      
      this.layers.crimeMarkers.addLayer(marker);
    });
    
    this.map.addLayer(this.layers.crimeMarkers);
    
    console.log(`✅ Crime markers layer created (${window.appData.crimeData.length} incidents)`);
  }
  
  /**
   * Создать слой маркеров светильников (опционально, не включён по умолчанию)
   */
  createLightMarkersLayer() {
    this.layers.lightMarkers = L.layerGroup();
    
    // Добавляем только часть светильников для производительности
    const sampleSize = Math.min(100, window.appData.lightingData.length);
    const step = Math.floor(window.appData.lightingData.length / sampleSize);
    
    for (let i = 0; i < window.appData.lightingData.length; i += step) {
      const light = window.appData.lightingData[i];
      
      const marker = L.circleMarker([light.lat, light.lng], {
        radius: 4,
        fillColor: light.status === 'working' ? '#ffd700' : '#ef4444',
        color: '#fff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      });
      
      marker.bindPopup(`
        <div class="light-popup">
          <h4>💡 Svítidlo #${light.id}</h4>
          <p><strong>Typ:</strong> ${light.type}</p>
          <p><strong>Intenzita:</strong> ${light.intensity} lux</p>
          <p><strong>Stav:</strong> ${light.status === 'working' ? '✅ Funkční' : '⚠️ Údržba'}</p>
          <p><strong>Oblast:</strong> ${light.district}</p>
        </div>
      `);
      
      this.layers.lightMarkers.addLayer(marker);
    }
    
    // Не добавляем на карту по умолчанию
    console.log(`✅ Light markers layer created (${sampleSize} lights sampled)`);
  }
  
  /**
   * Установить точку A (начало маршрута)
   * @param {number} lat - Широта
   * @param {number} lng - Долгота
   */
  setStartPoint(lat, lng) {
    // Удаляем старый маркер если есть
    if (this.markers.start) {
      this.map.removeLayer(this.markers.start);
    }
    
    // Создаём пульсирующий маркер
    this.markers.start = L.marker([lat, lng], {
      icon: L.divIcon({
        html: `<div class="custom-marker start-marker">
                 <div class="marker-pulse"></div>
                 <span class="marker-icon">🏠</span>
               </div>`,
        className: 'custom-marker-container',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      }),
      zIndexOffset: 1000
    }).addTo(this.map);
    
    this.selectedPoints.start = { lat, lng };
    
    console.log(`📍 Start point set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }
  
  /**
   * Установить точку B (конец маршрута)
   * @param {number} lat - Широта
   * @param {number} lng - Долгота
   */
  setEndPoint(lat, lng) {
    if (this.markers.end) {
      this.map.removeLayer(this.markers.end);
    }
    
    this.markers.end = L.marker([lat, lng], {
      icon: L.divIcon({
        html: `<div class="custom-marker end-marker">
                 <div class="marker-pulse"></div>
                 <span class="marker-icon">🎯</span>
               </div>`,
        className: 'custom-marker-container',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      }),
      zIndexOffset: 1000
    }).addTo(this.map);
    
    this.selectedPoints.end = { lat, lng };
    
    console.log(`🎯 End point set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }
  
  /**
   * Отобразить маршрут на карте
   * @param {Object} route - Объект маршрута с координатами и сегментами
   */
  displayRoute(route) {
    // Удаляем старый маршрут
    if (this.layers.route) {
      this.map.removeLayer(this.layers.route);
    }
    
    this.layers.route = L.layerGroup().addTo(this.map);
    
    // Создаём polyline с градиентом безопасности
    const latlngs = route.coordinates.map(coord => [coord[0], coord[1]]);
    
    // Основная линия маршрута
    const mainRoute = L.polyline(latlngs, {
      color: this.getRouteColor(route.safetyScore),
      weight: 6,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(this.layers.route);
    
    // Белая подложка для эффекта обводки
    const routeOutline = L.polyline(latlngs, {
      color: '#ffffff',
      weight: 8,
      opacity: 0.5,
      smoothFactor: 1
    }).addTo(this.layers.route);
    
    // Перемещаем outline назад
    routeOutline.bringToBack();
    
    // Добавляем маркеры на ключевых точках поворота
    if (route.segments && route.segments.length > 2) {
      route.segments.forEach((segment, index) => {
        if (index % 3 === 0 && index > 0 && index < route.segments.length - 1) {
          L.circleMarker([segment.from.lat, segment.from.lng], {
            radius: 5,
            fillColor: '#ffffff',
            color: this.getRouteColor(route.safetyScore),
            weight: 2,
            opacity: 1,
            fillOpacity: 1
          }).addTo(this.layers.route);
        }
      });
    }
    
    // Popup для маршрута
    mainRoute.bindPopup(`
      <div class="route-popup">
        <h4>📊 Detail trasy</h4>
        <p><strong>Délka:</strong> ${utils.formatDistance(route.totalDistance)}</p>
        <p><strong>Čas:</strong> ${utils.formatTime(route.estimatedTime)}</p>
        <p><strong>Osvětlení:</strong> ${route.lightingCoverage}%</p>
        <p><strong>Bezpečnost:</strong> ${route.safetyScore}/100</p>
      </div>
    `);
    
    // Анимированная линия "бегущие точки"
    this.animateRouteDash(mainRoute);
    
    // Zoom на маршрут
    this.map.fitBounds(mainRoute.getBounds(), {
      padding: [50, 50]
    });
    
    console.log(`✅ Route displayed (${route.totalDistance}m, safety: ${route.safetyScore})`);
  }
  
  /**
   * Получить цвет маршрута на основе безопасности
   * @param {number} safetyScore - Индекс безопасности (0-100)
   * @returns {string} Hex цвет
   */
  getRouteColor(safetyScore) {
    if (safetyScore >= 80) return '#4ade80'; // Зеленый
    if (safetyScore >= 60) return '#fbbf24'; // Желтый
    if (safetyScore >= 40) return '#ff6b35'; // Оранжевый
    return '#ef4444'; // Красный
  }
  
  /**
   * Анимация "бегущих точек" на маршруте
   * @param {L.Polyline} polyline - Polyline для анимации
   */
  animateRouteDash(polyline) {
    let offset = 0;
    
    const animate = () => {
      offset = (offset + 1) % 40;
      polyline.setStyle({
        dashArray: `10, 30`,
        dashOffset: offset
      });
      
      requestAnimationFrame(animate);
    };
    
    // Запускаем анимацию
    animate();
  }
  
  /**
   * Очистить маршрут
   */
  clearRoute() {
    if (this.layers.route) {
      this.map.removeLayer(this.layers.route);
      this.layers.route = null;
    }
  }
  
  /**
   * Очистить все точки
   */
  clearPoints() {
    if (this.markers.start) {
      this.map.removeLayer(this.markers.start);
      this.markers.start = null;
    }
    if (this.markers.end) {
      this.map.removeLayer(this.markers.end);
      this.markers.end = null;
    }
    this.selectedPoints = { start: null, end: null };
  }
  
  /**
   * Переключить слой
   * @param {string} layerName - Имя слоя
   * @param {boolean} visible - Видимость
   */
  toggleLayer(layerName, visible) {
    const layer = this.layers[layerName];
    if (!layer) return;
    
    if (visible) {
      this.map.addLayer(layer);
    } else {
      this.map.removeLayer(layer);
    }
  }
  
  /**
   * Прикрепить обработчики событий
   */
  attachEventListeners() {
    // Клик по карте для установки точек
    this.map.on('click', (e) => {
      this.handleMapClick(e.latlng);
    });
    
    // Изменение zoom
    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      console.log(`🔍 Zoom level: ${zoom}`);
    });
  }
  
  /**
   * Обработка клика по карте
   * @param {L.LatLng} latlng - Координаты клика
   */
  handleMapClick(latlng) {
    if (!this.selectedPoints.start) {
      this.setStartPoint(latlng.lat, latlng.lng);
      // Обновляем UI
      if (window.uiManager) {
        window.uiManager.updateInputFromMap('start', latlng.lat, latlng.lng);
      }
    } else if (!this.selectedPoints.end) {
      this.setEndPoint(latlng.lat, latlng.lng);
      // Обновляем UI
      if (window.uiManager) {
        window.uiManager.updateInputFromMap('end', latlng.lat, latlng.lng);
      }
    }
  }
  
  /**
   * Перелететь к определенной точке
   * @param {number} lat - Широта
   * @param {number} lng - Долгота
   * @param {number} zoom - Уровень zoom
   */
  flyTo(lat, lng, zoom = 15) {
    this.map.flyTo([lat, lng], zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }
}

// CSS для кастомных маркеров (добавим динамически)
const markerStyles = document.createElement('style');
markerStyles.innerHTML = `
  .custom-marker-container {
    background: transparent;
    border: none;
  }
  
  .custom-marker {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .marker-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: pulse-marker 2s ease-out infinite;
  }
  
  .start-marker .marker-pulse {
    background: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
  }
  
  .end-marker .marker-pulse {
    background: rgba(239, 68, 68, 0.4);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
  }
  
  .marker-icon {
    font-size: 2rem;
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  @keyframes pulse-marker {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.3;
    }
  }
  
  .crime-cluster-container {
    background: transparent;
    border: none;
  }
  
  .crime-cluster {
    background: rgba(239, 68, 68, 0.8);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
  
  .crime-cluster-small {
    width: 30px;
    height: 30px;
  }
  
  .crime-cluster-medium {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .crime-cluster-large {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }
  
  .crime-marker {
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }
  
  .crime-popup,
  .light-popup,
  .route-popup {
    font-family: 'Inter', sans-serif;
    min-width: 200px;
  }
  
  .crime-popup h4,
  .light-popup h4,
  .route-popup h4 {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: #e2e8f0;
  }
  
  .crime-popup p,
  .light-popup p,
  .route-popup p {
    margin: 5px 0;
    font-size: 14px;
    color: #94a3b8;
  }
  
  .severity-high {
    color: #ef4444;
    font-weight: bold;
  }
  
  .severity-medium {
    color: #fbbf24;
    font-weight: bold;
  }
  
  .severity-low {
    color: #4ade80;
    font-weight: bold;
  }
`;
document.head.appendChild(markerStyles);

// Экспорт
window.MapManager = MapManager;
