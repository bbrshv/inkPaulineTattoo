import { NextResponse } from "next/server";

async function getImagesFromCloudinary(cloudName: string, prefix: string) {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error("Missing Cloudinary API credentials");
    return [];
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?prefix=${encodeURIComponent(prefix)}&max_results=50&type=upload`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await response.json();
    if (!data.resources) return [];
    return data.resources.map((resource: any) => ({
      id: resource.public_id,
      name: resource.public_id.split("/").pop(),
      url: resource.secure_url,
    }));
  } catch (error) {
    console.error("Cloudinary Admin API error:", error);
    return [];
  }
}

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return NextResponse.json([]);
  }

  try {
    const images = await getImagesFromCloudinary(
      cloudName,
      "myWorks/portfolio",
    );

    const portfolioImages = images
      .filter((img: any) => img.name && img.name.startsWith("portfolio_"))
      .sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

    const works = portfolioImages.map((img: any, index: number) => {
      // Базовый URL без трансформаций
      const baseUrl = img.url;
      // Превью – квадрат 600x600 с обрезкой
      const src = baseUrl.replace(
        "/upload/",
        "/upload/w_600,h_600,c_fill,q_auto,f_auto/",
      );
      // Полноэкранный – без обрезки, с ограничением по размеру 1200px, автокачество
      const fullSrc = baseUrl.replace(
        "/upload/",
        "/upload/w_1200,c_limit,q_auto,f_auto/",
      );

      return {
        id: index,
        src,
        fullSrc,
        alt: (img.name || "").replace(/\.(jpg|jpeg|png)$/i, ""),
      };
    });

    return NextResponse.json(works);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json([]);
  }
}
