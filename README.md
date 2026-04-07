# WordLookup

Залікова робота з дисципліни «Розробка інтерфейсів користувача»  
**Варіант 21** — Додаток-словник на React Native (Expo)

## Опис

Мобільний додаток для пошуку слів за допомогою [Free Dictionary API](https://dictionaryapi.dev/).  
Дозволяє переглядати визначення, транскрипцію та приклади використання слів,а також зберігати обрані слова локально.

## Функціональність

- Пошук слів через Free Dictionary API
- Відображення транскрипції, визначень і прикладів використання
- Збереження слів в обране (AsyncStorage)
- Перегляд списку збережених слів

## Встановлення та запуск

### Передумови

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go на телефоні або Android-емулятор

### Кроки

```bash
# Клонувати репозиторій
git clone <repo-url>
cd rik-zalik/app

# Встановити залежності
npm install

# Запустити
npm start
```

Відскануйте QR-код у Expo Go або натисніть `a` для Android-емулятора.

## Технології

| Бібліотека | Призначення |
|---|---|
| React Native + Expo | Фреймворк |
| TypeScript | Типізація |
| React Navigation | Навігація (Stack + Bottom Tabs) |
| AsyncStorage | Локальне збереження обраних |
| @expo/vector-icons | Іконки |
| Free Dictionary API | Джерело даних |

## Структура проєкту

```
app/
├── src/
│   ├── components/   # Перевикористовувані компоненти
│   ├── hooks/        # Кастомні хуки (useFavorites, useDictionary)
│   ├── navigation/   # Конфігурація навігації
│   ├── screens/      # Екрани додатку
│   ├── services/     # API сервіс
│   └── types/        # TypeScript типи
├── App.tsx
└── app.json
```
