import { NextResponse } from "next/server";

interface HeroResponse {
  bgUrl: string;
}

export async function GET(): Promise<NextResponse<HeroResponse>> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  // Если нет Cloudinary — заглушка
  if (!cloudName /*|| process.env.NODE_ENV === "development"*/) {
    return NextResponse.json({
      bgUrl:
        "https://scontent-vie1-1.cdninstagram.com/v/t51.75761-15/467892887_17946071657871121_7426245129771538439_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=109&ig_cache_key=MzUwNzAyMTAzNDM5OTI0NjA4NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc5OS5zZHIuQzMifQ%3D%3D&_nc_ohc=MCKkLpAU3U0Q7kNvwHKbWnT&_nc_oc=Adp5PztUMC9kwf8h_e9w8xsv_4PtdPzs1qqVXxdEr9fZd1WyZrWBqFZf9Pv6Ctvd3p8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_gid=OFMk8paKSH9J9f3pUQQRpQ&_nc_ss=7a22e&oh=00_Af4JnE413ZgKhl7uRfXaHGq7BmkTj9ROBOTiRG34gXN6kQ&oe=69FE7FA4",
    });
  }

  // Ссылка на фон из Cloudinary
  const fallbackVideoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto/f_auto/v1777910645/mainBackground.mov`;
  const heroBgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto/f_auto/v1777902076/mainBackground`;

  let bgUrl = fallbackVideoUrl; // Сначала устанавливаем видео как фон

  try {
    const response = await fetch(fallbackVideoUrl, { method: "HEAD" });
    if (!response.ok) {
      bgUrl = heroBgUrl; // Если видео недоступно, пробуем изображение
      const imgResponse = await fetch(heroBgUrl, { method: "HEAD" });
      if (!imgResponse.ok) {
        bgUrl = ""; // Если оба недоступны, можно установить пустую строку или другое значение
      }
    }
  } catch {
    bgUrl = heroBgUrl; // Если произошла ошибка при получении видео, пробуем изображение
  }

  return NextResponse.json({ bgUrl });
}
