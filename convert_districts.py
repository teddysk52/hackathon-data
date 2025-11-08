import pandas as pd
import json

# Читаем Excel
df = pd.read_excel('svitidelplzen.xlsx')

# Переименовываем колонки
df.columns = ['district', 'lights', 'area', 'density']

# Убираем первую строку (заголовки)
df = df.iloc[1:]

# Чистим данные - убираем пробелы и меняем запятые на точки
df['lights'] = df['lights'].astype(int)
df['area'] = df['area'].astype(str).str.strip().str.replace(',', '.').astype(float)
df['density'] = df['density'].astype(int)

# Создаем структуру данных
districts_data = {
    'labels': df['district'].tolist(),
    'lights': df['lights'].tolist(),
    'area': df['area'].tolist(),
    'density': df['density'].tolist()
}

# Сохраняем в JS файл
with open('districts_data.js', 'w', encoding='utf-8') as f:
    f.write('const DISTRICTS_DATA = ')
    f.write(json.dumps(districts_data, ensure_ascii=False, indent=2))
    f.write(';')

print("✅ Данные по районам сохранены в districts_data.js")
print(f"📊 Районов: {len(districts_data['labels'])}")
print(f"💡 Всего фонарей: {sum(districts_data['lights'])}")
print(f"\nПервые 3 района:")
for i in range(3):
    print(f"  {districts_data['labels'][i]}: {districts_data['lights'][i]} фонарей, плотность {districts_data['density'][i]}/км²")
