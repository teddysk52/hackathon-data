/**
 * ============================================================================
 * MOCK DATA - Безопасные маршруты Пльзеня
 * ============================================================================
 * 
 * Реалистичные данные для демонстрации:
 * - Светильники (500+ записей)
 * - Криминальность (300+ инцидентов)
 * - Граф улиц (200+ узлов, 400+ рёбер)
 * - Статистика по районам
 * - Популярные места (POI)
 * 
 * @version 1.0.0
 */

/* ============================================================================
   КОНСТАНТЫ И КОНФИГУРАЦИЯ
   ============================================================================ */

const PLZEN_CENTER = {
  lat: 49.7477,
  lng: 13.3775
};

const PLZEN_BOUNDS = {
  north: 49.7900,
  south: 49.7000,
  east: 13.4300,
  west: 13.3200
};

const DISTRICTS = [
  'Plzeň 1 - Vnitřní Město',
  'Plzeň 2 - Slovany',
  'Plzeň 3 - Východní Předměstí',
  'Plzeň 4 - Doubravka'
];

/* ============================================================================
   СТАТИСТИКА ПО РАЙОНАМ
   ============================================================================ */

const districtStats = {
  'Plzeň 1': {
    fullName: 'Plzeň 1 - Vnitřní Město',
    count: 2145,
    coverage: 94,
    perKm2: 287,
    area: 7.47, // km²
    population: 24500,
    crime: {
      total: 87,
      perCapita: 12.3,
      trend: -5.2,
      level: 'low'
    },
    safetyIndex: 89
  },
  'Plzeň 2': {
    fullName: 'Plzeň 2 - Slovany',
    count: 1832,
    coverage: 88,
    perKm2: 243,
    area: 7.54,
    population: 31200,
    crime: {
      total: 142,
      perCapita: 19.8,
      trend: 3.1,
      level: 'medium'
    },
    safetyIndex: 71
  },
  'Plzeň 3': {
    fullName: 'Plzeň 3 - Východní Předměstí',
    count: 1456,
    coverage: 72,
    perKm2: 189,
    area: 7.71,
    population: 28900,
    crime: {
      total: 327,
      perCapita: 38.4,
      trend: -8.4,
      level: 'critical'
    },
    safetyIndex: 42
  },
  'Plzeň 4': {
    fullName: 'Plzeň 4 - Doubravka',
    count: 2814,
    coverage: 91,
    perKm2: 312,
    area: 9.02,
    population: 42800,
    crime: {
      total: 95,
      perCapita: 14.1,
      trend: -12.7,
      level: 'low'
    },
    safetyIndex: 86
  }
};

/* ============================================================================
   ПОПУЛЯРНЫЕ МЕСТА (Points of Interest)
   ============================================================================ */

const popularPlaces = [
  // Центр города
  { name: 'Náměstí Republiky', address: 'náměstí Republiky, Plzeň', lat: 49.7477, lng: 13.3775, type: 'square' },
  { name: 'Katedrála sv. Bartoloměje', address: 'náměstí Republiky 35, Plzeň', lat: 49.7487, lng: 13.3777, type: 'landmark' },
  { name: 'Hlavní nádraží', address: 'nádražní 102, Plzeň', lat: 49.7413, lng: 13.3764, type: 'transport' },
  
  // Торговые центры
  { name: 'Bory Mall', address: 'Radčická 2, Plzeň', lat: 49.7346, lng: 13.4028, type: 'shopping' },
  { name: 'Olympia Plzeň', address: 'Písecká 972, Plzeň', lat: 49.7232, lng: 13.3899, type: 'shopping' },
  { name: 'Plaza Centers', address: 'Radčická 2, Plzeň', lat: 49.7345, lng: 13.3711, type: 'shopping' },
  
  // Университеты
  { name: 'Západočeská univerzita', address: 'Univerzitní 8, Plzeň', lat: 49.7265, lng: 13.3542, type: 'education' },
  { name: 'Fakulta aplikovaných věd', address: 'Technická 8, Plzeň', lat: 49.7285, lng: 13.3658, type: 'education' },
  
  // Парки и отдых
  { name: 'Lochotínský park', address: 'Lochotínská, Plzeň', lat: 49.7511, lng: 13.3458, type: 'park' },
  { name: 'Borský park', address: 'Borská, Plzeň', lat: 49.7384, lng: 13.4012, type: 'park' },
  { name: 'Planetárium', address: 'Třída Míru 2, Plzeň', lat: 49.7358, lng: 13.3897, type: 'culture' },
  
  // Больницы
  { name: 'Fakultní nemocnice', address: 'alej Svobody 80, Plzeň', lat: 49.7421, lng: 13.3892, type: 'hospital' },
  
  // Жилые районы
  { name: 'Doubravka', address: 'Doubravka, Plzeň', lat: 49.7623, lng: 13.3589, type: 'residential' },
  { name: 'Slovany', address: 'Slovany, Plzeň', lat: 49.7391, lng: 13.3612, type: 'residential' },
  { name: 'Východní Předměstí', address: 'Americká, Plzeň', lat: 49.7411, lng: 13.3983, type: 'residential' },
  
  // Улицы
  { name: 'Americká 20', address: 'Americká 20, Plzeň', lat: 49.7384, lng: 13.3736, type: 'street' },
  { name: 'Klatovská třída', address: 'Klatovská třída, Plzeň', lat: 49.7445, lng: 13.3652, type: 'street' },
  { name: 'Karlovarská třída', address: 'Karlovarská třída, Plzeň', lat: 49.7512, lng: 13.3689, type: 'street' }
];

/* ============================================================================
   СВЕТИЛЬНИКИ (500+ записей)
   ============================================================================ */

// Генератор светильников для различных районов
function generateLightingData() {
  const lights = [];
  let id = 1;
  
  // Функция для генерации светильников в области
  const generateInArea = (centerLat, centerLng, count, district, avgIntensity, spread) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * spread;
      const lat = centerLat + (radius * Math.cos(angle)) / 111; // ~111km per degree
      const lng = centerLng + (radius * Math.sin(angle)) / (111 * Math.cos(centerLat * Math.PI / 180));
      
      lights.push({
        id: id++,
        lat: lat,
        lng: lng,
        district: district,
        intensity: Math.max(30, Math.min(100, avgIntensity + (Math.random() - 0.5) * 30)),
        type: Math.random() > 0.3 ? 'LED' : 'Sodium',
        status: Math.random() > 0.05 ? 'working' : 'maintenance',
        installDate: `2${Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
      });
    }
  };
  
  // Plzeň 1 - Центр (высокая плотность, хорошее освещение)
  generateInArea(49.7477, 13.3775, 150, 'Plzeň 1', 92, 0.015);
  
  // Plzeň 2 - Slovany (средняя плотность)
  generateInArea(49.7391, 13.3612, 120, 'Plzeň 2', 85, 0.020);
  
  // Plzeň 3 - Východní Předměstí (низкая плотность, хуже освещение)
  generateInArea(49.7411, 13.3983, 80, 'Plzeň 3', 68, 0.025);
  
  // Plzeň 4 - Doubravka (хорошая плотность)
  generateInArea(49.7623, 13.3589, 150, 'Plzeň 4', 88, 0.022);
  
  return lights;
}

const lightingData = generateLightingData();

/* ============================================================================
   КРИМИНАЛЬНОСТЬ (300+ инцидентов)
   ============================================================================ */

const crimeTypes = [
  { name: 'Loupež', severity: 'high', weight: 3 },
  { name: 'Krádež', severity: 'medium', weight: 2 },
  { name: 'Vandalismus', severity: 'low', weight: 1 },
  { name: 'Napadení', severity: 'high', weight: 3 },
  { name: 'Kapesní krádež', severity: 'medium', weight: 2 },
  { name: 'Vloupání', severity: 'high', weight: 3 }
];

function generateCrimeData() {
  const crimes = [];
  let id = 1;
  
  // Больше инцидентов в Plzeň 3
  const generateCrimesInArea = (centerLat, centerLng, count, district, spread) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * spread;
      const lat = centerLat + (radius * Math.cos(angle)) / 111;
      const lng = centerLng + (radius * Math.sin(angle)) / (111 * Math.cos(centerLat * Math.PI / 180));
      
      const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
      const daysAgo = Math.floor(Math.random() * 365);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      
      crimes.push({
        id: id++,
        lat: lat,
        lng: lng,
        district: district,
        type: crimeType.name,
        severity: crimeType.severity,
        weight: crimeType.weight,
        date: date.toISOString().split('T')[0],
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        description: `${crimeType.name} - ${district}`
      });
    }
  };
  
  // Распределение инцидентов по районам
  generateCrimesInArea(49.7477, 13.3775, 40, 'Plzeň 1', 0.015); // Центр - меньше
  generateCrimesInArea(49.7391, 13.3612, 70, 'Plzeň 2', 0.020); // Средне
  generateCrimesInArea(49.7411, 13.3983, 150, 'Plzeň 3', 0.025); // Много!
  generateCrimesInArea(49.7623, 13.3589, 45, 'Plzeň 4', 0.022); // Меньше
  
  return crimes;
}

const crimeData = generateCrimeData();

/* ============================================================================
   ГРАФ УЛИЦ (узлы и рёбра для алгоритма Дейкстры)
   ============================================================================ */

// Генерация сетки узлов
function generateStreetGraph() {
  const nodes = [];
  const edges = [];
  let nodeId = 1;
  let edgeId = 1;
  
  // Создаём сетку узлов
  const gridSize = 15; // 15x15 = 225 узлов
  const latStep = (PLZEN_BOUNDS.north - PLZEN_BOUNDS.south) / gridSize;
  const lngStep = (PLZEN_BOUNDS.east - PLZEN_BOUNDS.west) / gridSize;
  
  const nodeGrid = [];
  
  for (let i = 0; i <= gridSize; i++) {
    nodeGrid[i] = [];
    for (let j = 0; j <= gridSize; j++) {
      const lat = PLZEN_BOUNDS.south + i * latStep;
      const lng = PLZEN_BOUNDS.west + j * lngStep;
      
      // Определяем район
      let district = 'Plzeň 1';
      if (lat < 49.740) district = 'Plzeň 3';
      else if (lng < 13.365) district = 'Plzeň 2';
      else if (lat > 49.755) district = 'Plzeň 4';
      
      // Рассчитываем освещенность (выше в центре, ниже на окраинах)
      const distToCenter = Math.sqrt(
        Math.pow((lat - PLZEN_CENTER.lat) * 111, 2) +
        Math.pow((lng - PLZEN_CENTER.lng) * 111 * Math.cos(lat * Math.PI / 180), 2)
      );
      const lightingScore = Math.max(40, Math.min(95, 90 - distToCenter * 5 + (Math.random() - 0.5) * 20));
      
      // Рассчитываем риск криминальности
      const crimesNearby = crimeData.filter(crime => {
        const dist = Math.sqrt(
          Math.pow((crime.lat - lat) * 111, 2) +
          Math.pow((crime.lng - lng) * 111, 2)
        );
        return dist < 0.5; // В радиусе 500м
      });
      const crimeRisk = Math.min(100, crimesNearby.reduce((sum, c) => sum + c.weight, 0) * 2);
      
      const node = {
        id: `n${nodeId.toString().padStart(3, '0')}`,
        lat: lat,
        lng: lng,
        district: district,
        lightingScore: Math.round(lightingScore),
        crimeRisk: Math.round(crimeRisk),
        gridX: j,
        gridY: i
      };
      
      nodes.push(node);
      nodeGrid[i][j] = node;
      nodeId++;
    }
  }
  
  // Создаём рёбра (соединяем соседние узлы)
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      const currentNode = nodeGrid[i][j];
      
      // Соединяем с правым соседом
      if (j < gridSize) {
        const rightNode = nodeGrid[i][j + 1];
        const distance = calculateDistance(
          currentNode.lat, currentNode.lng,
          rightNode.lat, rightNode.lng
        );
        
        edges.push({
          id: `e${edgeId++}`,
          from: currentNode.id,
          to: rightNode.id,
          distance: Math.round(distance),
          avgLighting: Math.round((currentNode.lightingScore + rightNode.lightingScore) / 2),
          crimeIncidents: Math.round((currentNode.crimeRisk + rightNode.crimeRisk) / 20),
          streetName: generateStreetName()
        });
      }
      
      // Соединяем с нижним соседом
      if (i < gridSize) {
        const bottomNode = nodeGrid[i + 1][j];
        const distance = calculateDistance(
          currentNode.lat, currentNode.lng,
          bottomNode.lat, bottomNode.lng
        );
        
        edges.push({
          id: `e${edgeId++}`,
          from: currentNode.id,
          to: bottomNode.id,
          distance: Math.round(distance),
          avgLighting: Math.round((currentNode.lightingScore + bottomNode.lightingScore) / 2),
          crimeIncidents: Math.round((currentNode.crimeRisk + bottomNode.crimeRisk) / 20),
          streetName: generateStreetName()
        });
      }
      
      // Диагональные связи (добавляем некоторые для большей реалистичности)
      if (i < gridSize && j < gridSize && Math.random() > 0.5) {
        const diagNode = nodeGrid[i + 1][j + 1];
        const distance = calculateDistance(
          currentNode.lat, currentNode.lng,
          diagNode.lat, diagNode.lng
        );
        
        edges.push({
          id: `e${edgeId++}`,
          from: currentNode.id,
          to: diagNode.id,
          distance: Math.round(distance),
          avgLighting: Math.round((currentNode.lightingScore + diagNode.lightingScore) / 2),
          crimeIncidents: Math.round((currentNode.crimeRisk + diagNode.crimeRisk) / 20),
          streetName: generateStreetName()
        });
      }
    }
  }
  
  return { nodes, edges };
}

// Вспомогательная функция для расчета расстояния (формула Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // расстояние в метрах
}

// Генератор названий улиц
const streetNames = [
  'Americká', 'Klatovská', 'Karlovarská', 'Slovanská', 'Borská',
  'Lochotínská', 'Doubravecká', 'Jiráskovo náměstí', 'Bělohorská',
  'Malostranská', 'Dlouhá', 'Husova', 'Nerudova', 'Tylova'
];

let streetNameIndex = 0;
function generateStreetName() {
  const name = streetNames[streetNameIndex % streetNames.length];
  streetNameIndex++;
  return name;
}

const streetGraph = generateStreetGraph();

/* ============================================================================
   ИСТОРИЧЕСКИЕ ДАННЫЕ (для графиков)
   ============================================================================ */

const historicalCrimeData = {
  'Plzeň 1': [
    { year: 2020, incidents: 112 },
    { year: 2021, incidents: 105 },
    { year: 2022, incidents: 98 },
    { year: 2023, incidents: 91 },
    { year: 2024, incidents: 92 },
    { year: 2025, incidents: 87 }
  ],
  'Plzeň 2': [
    { year: 2020, incidents: 158 },
    { year: 2021, incidents: 162 },
    { year: 2022, incidents: 154 },
    { year: 2023, incidents: 149 },
    { year: 2024, incidents: 138 },
    { year: 2025, incidents: 142 }
  ],
  'Plzeň 3': [
    { year: 2020, incidents: 389 },
    { year: 2021, incidents: 412 },
    { year: 2022, incidents: 398 },
    { year: 2023, incidents: 365 },
    { year: 2024, incidents: 357 },
    { year: 2025, incidents: 327 }
  ],
  'Plzeň 4': [
    { year: 2020, incidents: 125 },
    { year: 2021, incidents: 118 },
    { year: 2022, incidents: 112 },
    { year: 2023, incidents: 105 },
    { year: 2024, incidents: 109 },
    { year: 2025, incidents: 95 }
  ]
};

/* ============================================================================
   ЭКСПОРТ ДАННЫХ
   ============================================================================ */

// Делаем данные доступными глобально
window.appData = {
  center: PLZEN_CENTER,
  bounds: PLZEN_BOUNDS,
  districts: DISTRICTS,
  districtStats: districtStats,
  popularPlaces: popularPlaces,
  lightingData: lightingData,
  crimeData: crimeData,
  streetGraph: streetGraph,
  historicalCrimeData: historicalCrimeData,
  
  // Вспомогательные функции
  calculateDistance: calculateDistance
};

console.log('📊 Mock data loaded:', {
  lights: lightingData.length,
  crimes: crimeData.length,
  nodes: streetGraph.nodes.length,
  edges: streetGraph.edges.length,
  places: popularPlaces.length
});
