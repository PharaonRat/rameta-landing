# Rameta Landing — Клубника в шоколаде

Лендинг онлайн-курса по клубнике в шоколаде и дубайскому шоколаду от Раметы.

## Стек
- Чистый HTML + CSS + минимум JS (без фреймворков)
- Хостинг: Vercel

## Быстрый деплой
```bash
npx vercel --prod
```

## Что нужно заменить перед запуском
- `assets/img/hero.jpg` — главное фото/видео-фон
- `assets/img/rameta-1.jpg` — фото Раметы
- `assets/img/work-1.jpg` … `work-6.jpg` — галерея работ
- `assets/video/hero.mp4` — hero-видео (опционально)
- В `index.html`: `og:image` и ID Яндекс.Метрики (помечены `ЗАПОЛНИТЬ`)

## Структура
```
rameta-landing/
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── img/
    └── video/
```
