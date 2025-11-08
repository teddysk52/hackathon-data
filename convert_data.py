import pandas as pd
import json

# Читаем Excel
df = pd.read_excel('svetelnamista.xlsx')

# Конвертируем в список словарей
lights = []
for _, row in df.iterrows():
    lights.append({
        'lat': row['Zeměpisná šířka'],
        'lng': row['Zeměpisná délka'],
        'name': row['Název']
    })

# Сохраняем в JSON
with open('streetlights.json', 'w', encoding='utf-8') as f:
    json.dump(lights, f, ensure_ascii=False, indent=2)

print(f"✅ Конвертировано {len(lights)} фонарей в streetlights.json")
print(f"📍 Пример данных: {lights[0]}")
