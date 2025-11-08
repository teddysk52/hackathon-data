/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * 
 * Вспомогательные функции для работы приложения
 */

/**
 * Форматирует число с разделителями тысяч
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированное число
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Анимация счетчика (count-up эффект)
 * @param {HTMLElement} element - Элемент для анимации
 * @param {number} start - Начальное значение
 * @param {number} end - Конечное значение
 * @param {number} duration - Длительность анимации (мс)
 * @param {Function} formatter - Функция форматирования (опционально)
 */
function animateCounter(element, start, end, duration, formatter = null) {
  const startTime = performance.now();
  const difference = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (difference * easeOut);
    
    element.textContent = formatter ? formatter(Math.round(current)) : Math.round(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Показать уведомление
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип: 'success', 'error', 'warning'
 * @param {number} duration - Длительность показа (мс)
 */
function showNotification(message, type = 'success', duration = 3000) {
  const notification = document.getElementById('notification');
  const messageEl = document.getElementById('notification-message');
  
  // Убираем все классы типов
  notification.classList.remove('success', 'error', 'warning');
  
  // Добавляем нужный класс и сообщение
  notification.classList.add(type);
  messageEl.textContent = message;
  
  // Показываем
  notification.classList.remove('hidden');
  
  // Автоматически скрываем
  setTimeout(() => {
    notification.classList.add('hidden');
  }, duration);
}

/**
 * Форматирует расстояние для отображения
 * @param {number} meters - Расстояние в метрах
 * @returns {string} Отформатированное расстояние
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Форматирует время для отображения
 * @param {number} minutes - Время в минутах
 * @returns {string} Отформатированное время
 */
function formatTime(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}min`;
}

/**
 * Debounce функция (задержка выполнения)
 * @param {Function} func - Функция для выполнения
 * @param {number} wait - Задержка в мс
 * @returns {Function} Debounced функция
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle функция (ограничение частоты вызовов)
 * @param {Function} func - Функция для выполнения
 * @param {number} limit - Минимальный интервал между вызовами (мс)
 * @returns {Function} Throttled функция
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Получить уровень безопасности по индексу
 * @param {number} index - Индекс безопасности (0-100)
 * @returns {Object} Объект с уровнем и цветом
 */
function getSafetyLevel(index) {
  if (index >= 80) {
    return { level: 'VELMI VYSOKÝ', class: 'very-high', color: '#4ade80' };
  } else if (index >= 60) {
    return { level: 'VYSOKÝ', class: 'high', color: '#4ade80' };
  } else if (index >= 40) {
    return { level: 'STŘEDNÍ', class: 'medium', color: '#fbbf24' };
  } else if (index >= 20) {
    return { level: 'NÍZKÝ', class: 'low', color: '#ff6b35' };
  } else {
    return { level: 'VELMI NÍZKÝ', class: 'very-low', color: '#ef4444' };
  }
}

/**
 * Получить уровень криминальности
 * @param {number} incidents - Количество инцидентов
 * @returns {Object} Объект с уровнем и классом
 */
function getCrimeLevel(incidents) {
  if (incidents >= 300) {
    return { level: 'Kritická oblast', class: 'critical' };
  } else if (incidents >= 150) {
    return { level: 'Vysoká oblast', class: 'high' };
  } else if (incidents >= 100) {
    return { level: 'Střední oblast', class: 'medium' };
  } else {
    return { level: 'Nízká oblast', class: 'low' };
  }
}

/**
 * Генерирует случайный цвет (для графиков)
 * @param {number} alpha - Прозрачность (0-1)
 * @returns {string} rgba цвет
 */
function randomColor(alpha = 1) {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Интерполяция цвета между двумя значениями
 * @param {number} value - Значение (0-1)
 * @param {string} colorStart - Начальный цвет (hex)
 * @param {string} colorEnd - Конечный цвет (hex)
 * @returns {string} Интерполированный цвет (hex)
 */
function interpolateColor(value, colorStart = '#3b82f6', colorEnd = '#ffd700') {
  const start = hexToRgb(colorStart);
  const end = hexToRgb(colorEnd);
  
  const r = Math.round(start.r + (end.r - start.r) * value);
  const g = Math.round(start.g + (end.g - start.g) * value);
  const b = Math.round(start.b + (end.b - start.b) * value);
  
  return rgbToHex(r, g, b);
}

/**
 * Конвертирует hex в RGB
 * @param {string} hex - Hex цвет
 * @returns {Object} RGB объект
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Конвертирует RGB в hex
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {string} Hex цвет
 */
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Получить ближайший узел к координатам
 * @param {number} lat - Широта
 * @param {number} lng - Долгота
 * @param {Array} nodes - Массив узлов
 * @returns {Object} Ближайший узел
 */
function getNearestNode(lat, lng, nodes) {
  let nearest = null;
  let minDistance = Infinity;
  
  nodes.forEach(node => {
    const distance = window.appData.calculateDistance(lat, lng, node.lat, node.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = node;
    }
  });
  
  return nearest;
}

/**
 * Сохранить данные в localStorage
 * @param {string} key - Ключ
 * @param {any} value - Значение
 */
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Загрузить данные из localStorage
 * @param {string} key - Ключ
 * @returns {any} Значение или null
 */
function loadFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Создать ripple эффект на кнопке
 * @param {Event} event - Событие клика
 */
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');
  
  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
}

/**
 * Проверка поддержки Geolocation API
 * @returns {boolean} true если поддерживается
 */
function isGeolocationSupported() {
  return 'geolocation' in navigator;
}

/**
 * Получить текущую позицию пользователя
 * @returns {Promise} Promise с координатами
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Генерировать confetti анимацию
 * @param {number} duration - Длительность (мс)
 */
function launchConfetti(duration = 3000) {
  const colors = ['#ffd700', '#4ade80', '#3b82f6', '#ff6b35', '#fbbf24'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.opacity = '1';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '100000';
      confetti.style.transition = 'all 3s ease-out';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.style.top = window.innerHeight + 'px';
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
      }, 10);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * (duration / confettiCount));
  }
}

// Экспортируем функции в глобальную область
window.utils = {
  formatNumber,
  animateCounter,
  showNotification,
  formatDistance,
  formatTime,
  debounce,
  throttle,
  getSafetyLevel,
  getCrimeLevel,
  randomColor,
  interpolateColor,
  hexToRgb,
  rgbToHex,
  getNearestNode,
  saveToLocalStorage,
  loadFromLocalStorage,
  createRipple,
  isGeolocationSupported,
  getCurrentPosition,
  launchConfetti
};
