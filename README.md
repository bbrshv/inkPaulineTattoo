This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Стек

Next.js 16 (App Router, Turbopack)
TypeScript
CSS-стили (без фреймворков)
React Hooks
Реализованные блоки

Hero

Параллакс-эффект через HeroParallax.tsx
Поддержка вертикальных видео (медленное движение при скролле)
Горизонтальные видео/фото закреплены
На мобилке работает, на десктопе вертикальное видео пока стоит
Портфолио

Сетка 2–4 работы
Две первые закреплены, две остальные — случайные
Поддержка видео и фото из Cloudinary
Определение типа по расширению файла
Форма записи

Поля: имя, контакт, описание идеи
Загрузка нескольких файлов (фото/видео)
Отправка на /api/booking
API

works/route.ts — получает файлы из Cloudinary, фильтрует portfolio\_\*
hero/route.ts — отдаёт ссылку на фон
booking/route.ts — сохраняет файлы в public/uploads/
Стили

Тёмная тема (#0a0a0a), полупрозрачные блоки
Snap-scroll (как в Reels) для всех блоков
Адаптив (мобилки → десктоп)
Параллакс-стили вынесены отдельно
Работа с Cloudinary

Видео и фото хранятся в облаке
Горизонтальные / вертикальные определяются по соотношению сторон
Папка: tattoo-works
Текущие баги (из обсуждения)

На десктопе вертикальное видео в герое не двигается при скролле (на мобилке — да)
HeroParallax на десктопе не всегда определяет isPortrait
Нет отладочных console.log (добавляли временно)
Что не доделано / отложено

Полноценная мультиязычность (помечено на будущее)
Оптимизация скорости параллакса
Telegram-уведомления (закомментированы, нет токенов)

Инструкция: как добавлять работы в портфолио

1. Зайти в Cloudinary

Открыть https://cloudinary.com
Войти в аккаунт (тот, что привязан к сайту) 2. Перейти в Media Library

На панели слева нажать Media Library
Откроется список папок и файлов 3. Создать или открыть папку tattoo-works

Если папки нет — нажать Create folder → назвать tattoo-works
Зайти внутрь папки 4. Загрузить файл

Нажать Upload
Выбрать файл с компьютера (фото или видео)
ОБЯЗАТЕЛЬНО нажать Advanced options
В поле Public ID ввести:
tattoo-works/portfolio_1 (или portfolio_2, portfolio_3 и т.д.)
Нажать Upload 5. Как называть файлы

Тип файла Шаблон Public ID Пример
Закреплённая работа 1 tattoo-works/portfolio_1 tattoo-works/portfolio_1
Закреплённая работа 2 tattoo-works/portfolio_2 tattoo-works/portfolio_2
Остальные работы tattoo-works/portfolio_3, portfolio_4, … любые числа дальше
Фоновое видео/фото tattoo-works/hero-bg tattoo-works/hero-bg 6. Что важно

Расширение не указывать — Cloudinary добавит сам (.jpg, .mp4 и т.д.)
Формат — любой: JPG, PNG, MP4, MOV, WebM
Размер — без ограничений (Cloudinary сожмёт и оптимизирует)
Имя только латиница, без пробелов, только нижние подчёркивания
🔄 Как обновить сайт после загрузки

Сайт показывает новые работы не сразу, а в течение часа (кеш)
Чтобы увидеть сразу — перезагрузить страницу (Ctrl+F5 или Cmd+Shift+R)
Если не появились — проверить, что Public ID соответствует шаблону
❗ Частые ошибки

Проблема Решение
Фото не появляется Проверить Public ID — должно быть portfolio_1, а не portfolio_1.jpg
Видео стоит на месте на десктопе Это баeta-эффект, на мобилке работает. Исправим позже
Видео не играет Убедиться, что файл .mp4 или .mov, и указан Public ID без расширения
Пустая галерея Загрузить хотя бы один файл с portfolio_1
🧪 Тестовый мини-чеклист после загрузки

Файл появился в Media Library Cloudinary
Public ID начинается с tattoo-works/portfolio\_
Открыть сайт — работа видна
Видео автозапускается без звука (если это видео)
На мобилке вертикальное видео слегка скроллится
Если нужны дополнительные пояснения для мастера — могу докинуть картинки-подсказки или сделать более простую инструкцию (без Advanced options, через переименование файлов на компьютере).
