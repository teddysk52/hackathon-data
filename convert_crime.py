import pandas as pd
import json

# Читаем Excel без заголовков
df = pd.read_excel('trestnciciny.xlsx', header=None)

# Данные находятся в строках 44-52
# Колонка 15 = район
# Колонка 16 = trestni ciny na 1 obyvatele

crime_data = []
for i in range(44, 53):
    row = df.iloc[i]
    if pd.isna(row[15]) or pd.isna(row[16]):
        continue
    district = str(row[15]).strip()
    per_capita = float(row[16])
    
    crime_data.append({
        'district': district,
        'per_capita': per_capita
    })

# Сортируем по per_capita (от большего к меньшему)
crime_data_sorted = sorted(crime_data, key=lambda x: x['per_capita'], reverse=True)

# Создаем структуру для JS
crime_js_data = {
    'districts': [item['district'] for item in crime_data_sorted],
    'per_capita': [round(item['per_capita'], 4) for item in crime_data_sorted]
}

# Сохраняем
with open('crime_data.js', 'w', encoding='utf-8') as f:
    f.write('const CRIME_DATA = ')
    f.write(json.dumps(crime_js_data, ensure_ascii=False, indent=2))
    f.write(';')

print("✅ Данные по криминалу сохранены!")
print(f"📊 Районов: {len(crime_data)}")
print(f"\n🔴 ТОП-3 самых опасных (trestní činy na 1 obyvatele):")
for i in range(min(3, len(crime_data_sorted))):
    item = crime_data_sorted[i]
    print(f"  {i+1}. {item['district']}: {item['per_capita']:.4f}")
