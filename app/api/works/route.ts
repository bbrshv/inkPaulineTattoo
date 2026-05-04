import { NextResponse } from "next/server";

// Константа с демо-работами - инициализируется только один раз при загрузке модуля
const DEMO_WORKS = [
  {
    id: 1,
    src: "https://scontent-vie1-1.cdninstagram.com/v/t51.82787-15/643556195_17904509352362827_4504889310887866046_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzg0MzkyODkwNjY1NTM3MDUyNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTM1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=SdSBgsZbgWwQ7kNvwFm0Q5N&_nc_oc=AdrQO9h3TxpjZNbMjvMkVpU_TTHrV7BSPeiU35bg7-PzRfIF2yCQAWugp19zxWSl_8A&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_gid=UwgUeYGmsau6hRGxt2WXuA&_nc_ss=7a22e&oh=00_Af4D_Q-WsboqqF1vsiz9lu2WvmTBRVHRdFL-22-Z0bcRJw&oe=69FE76B4",
    alt: "Тату работа 1",
  },
  {
    id: 2,
    src: "https://picsum.photos/id/21/600/600",
    alt: "Тату работа 2",
  },
  {
    id: 3,
    src: "https://picsum.photos/id/22/600/600",
    alt: "Тату работа 3",
  },
  {
    id: 4,
    src: "https://picsum.photos/id/23/600/600",
    alt: "Тату работа 4",
  },
];

// Функция для получения списка изображений из Cloudinary
async function getImagesFromCloudinary(cloudName: string, prefix: string) {
  const url = `https://res.cloudinary.com/${cloudName}/image/list/${prefix}.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.resources) return [];

    return data.resources.map((resource: any) => ({
      id: resource.public_id,
      name: resource.public_id.split("/").pop(),
      url: resource.secure_url,
    }));
  } catch (error) {
    console.error("Cloudinary error:", error);
    return [];
  }
}

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  // Если нет Cloudinary или в разработке — возвращаем заглушки
  if (!cloudName /*|| process.env.NODE_ENV === "development"*/) {
    return NextResponse.json(DEMO_WORKS);
  }

  try {
    const images = await getImagesFromCloudinary(cloudName, "myWorks");

    // Фильтруем только portfolio_ файлы и сортируем
    const portfolioImages = images
      .filter((img: any) => img.name.startsWith("portfolio_"))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Берём первые 4
    const works = portfolioImages
      .slice(0, 4)
      .map((img: any, index: number) => ({
        id: index,
        src: img.url,
        alt: img.name.replace(/\.(jpg|jpeg|png)$/i, ""),
      }));

    // Если нет фото в Cloudinary — заглушки
    if (works.length === 0) {
      return NextResponse.json(DEMO_WORKS);
    }

    return NextResponse.json(works);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json([]);
  }
}
