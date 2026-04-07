# WordLookup

Залікова робота з дисципліни «Розробка інтерфейсів користувача»
**Варіант 21** — Додаток-словник на React Native (Expo)

**Виконав:** Соснов Станіслав

---

## Опис

WordLookup — мобільний додаток для пошуку англійських слів за допомогою [Free Dictionary API](https://dictionaryapi.dev/). Додаток дозволяє шукати слова, переглядати їх транскрипцію, визначення та приклади використання, прослуховувати вимову, зберігати слова в обране та переходити між пов'язаними словами через синоніми.

---

## Функціональність

- Пошук слів через Free Dictionary API з обробкою помилок
- Відображення транскрипції, визначень і прикладів використання
- Прослуховування вимови слова (аудіо з API)
- Збереження слів в обране через AsyncStorage
- Перегляд збережених слів у вкладці Saved
- Навігація по синонімах з відображенням ієрархії (breadcrumbs)
- Синхронізований стан обраного між усіма екранами через React Context

---

## Технології

| Бібліотека | Версія | Призначення |
|---|---|---|
| React Native + Expo | SDK 54 | Фреймворк |
| TypeScript | ~5.9 | Типізація |
| React Navigation | v7 | Навігація (Stack + Bottom Tabs) |
| AsyncStorage | 2.2.0 | Локальне збереження |
| expo-av | latest | Відтворення аудіо |
| @expo/vector-icons | ^15 | Іконки (Ionicons) |
| react-native-safe-area-context | ~5.6 | Safe area |
| Free Dictionary API | — | Джерело даних |

---

## Структура проєкту

```
app/
├── src/
│   ├── components/          # Перевикористовувані компоненти
│   ├── constants/
│   │   └── colors.ts        # Централізовані кольори
│   ├── context/
│   │   └── FavoritesContext.tsx  # Глобальний стан обраного
│   ├── hooks/
│   │   ├── useDictionary.ts # Хук для API запитів
│   │   └── useFavorites.ts  # Хук для роботи з обраним
│   ├── navigation/
│   │   ├── types.ts         # Типи навігації
│   │   ├── RootNavigator.tsx
│   │   └── CustomTabBar.tsx
│   ├── screens/
│   │   ├── SearchScreen.tsx
│   │   ├── WordDetailScreen.tsx
│   │   └── FavoritesScreen.tsx
│   ├── services/
│   │   └── dictionaryApi.ts # API сервіс
│   └── types/
│       └── dictionary.ts    # TypeScript типи
├── WordLookupApp.tsx
└── app.json
```

---

## Встановлення та запуск

### Передумови

- [Node.js](https://nodejs.org/) v18+
- [Expo Go](https://expo.dev/go) на телефоні (iOS або Android)

### Кроки

```bash
# Клонувати репозиторій
git clone <repo-url>
cd rik-zalik/app

# Встановити залежності
npm install

# Запустити
npx expo start
```

Відскануйте QR-код у **Expo Go** або натисніть `w` для веб-версії.

> Телефон і комп'ютер мають бути в одній Wi-Fi мережі.
