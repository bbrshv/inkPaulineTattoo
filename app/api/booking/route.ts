import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const contact = formData.get("contact");
    const idea = formData.get("idea");
    const files = formData.getAll("files");
    
    const timestamp = Date.now();
    const uploadDir = path.join(process.cwd(), "public", "uploads", String(timestamp));
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const savedFiles = [];
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        savedFiles.push(filename);
      }
    }
    
    console.log("📝 Новая заявка:", { name, contact, idea, files: savedFiles });
    
    return NextResponse.json(
      { message: "Заявка успешно отправлена" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { message: "Ошибка при обработке заявки" },
      { status: 500 }
    );
  }
}
