import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100 МБ

// --- Telegram отправка текста ---
async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("⚠️ Telegram не настроен");
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      },
    );
    const responseText = await response.text();
    if (!response.ok) {
      console.error("❌ Ошибка отправки текста в Telegram:", responseText);
    } else {
      console.log("✅ Текст отправлен в Telegram");
    }
  } catch (error) {
    console.error("❌ Ошибка при отправке текста:", error);
  }
}

// --- Telegram отправка файла (нативный FormData) ---
async function sendTelegramFile(filePath: string, fileName: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const fileBuffer = await readFile(filePath);
    const formData = new FormData();
    formData.append("chat_id", chatId);

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const method = isImage ? "sendPhoto" : "sendDocument";
    const fieldName = isImage ? "photo" : "document";

    const blob = new Blob([fileBuffer]);
    formData.append(fieldName, blob, fileName);

    const response = await fetch(
      `https://api.telegram.org/bot${token}/${method}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`❌ Ошибка отправки файла ${fileName}:`, responseText);
    } else {
      console.log(`✅ Файл ${fileName} отправлен в Telegram`);
    }
  } catch (error) {
    console.error(`❌ Ошибка при отправке файла ${fileName}:`, error);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const idea = formData.get("idea") as string;
    const files = formData.getAll("files") as File[];
    const timestamp = Date.now();

    // Проверка общего размера всех файлов
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        {
          message: `Общий размер файлов превышает 100 МБ. Пожалуйста, уменьшите количество или размер файлов.`,
        },
        { status: 413 },
      );
    }

    // Сохранение на сервере
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      String(timestamp),
    );
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const savedFiles: string[] = [];
    const savedPaths: string[] = [];

    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        savedFiles.push(filename);
        savedPaths.push(filepath);
      }
    }

    console.log("📝 Новая заявка:", { name, contact, idea, files: savedFiles });

    const messageText = `
📩 Новая заявка на тату

👤 Имя: ${name}
📱 Контакт: ${contact}
📝 Идея: ${idea || "не указана"}
📎 Файлы: ${savedFiles.length ? savedFiles.join(", ") : "нет"}
🕒 Время: ${new Date(timestamp).toLocaleString("ru-RU")}
    `;

    // Явно ждём отправку текста
    await sendTelegramMessage(messageText);

    // Отправляем все файлы параллельно и ждём их завершения
    if (savedPaths.length > 0) {
      await Promise.all(
        savedPaths.map(async (filePath) => {
          const fileName = path.basename(filePath);
          await sendTelegramFile(filePath, fileName);
        }),
      );
    }

    return NextResponse.json(
      { message: "Заявка успешно отправлена" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Ошибка:", error);
    return NextResponse.json(
      { message: "Ошибка при обработке заявки" },
      { status: 500 },
    );
  }
}
