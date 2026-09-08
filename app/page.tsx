"use client";

import { useState, useRef, useEffect } from "react";
import HeroParallax from "./components/HeroParallax";
import WorksCarousel from "./components/WorksCarousel";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 МБ

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    idea: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [works, setWorks] = useState<
    { id: number; src: string; alt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [heroBg, setHeroBg] = useState("");
  const formRef = useRef<HTMLElement | null>(null);
  const formElementRef = useRef<HTMLFormElement>(null);

  const fetchWorks = async () => {
    try {
      const response = await fetch("/api/works");
      const data = await response.json();
      setWorks(data);
    } catch (error) {
      console.error("Ошибка загрузки работ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => setHeroBg(data.bgUrl))
      .catch((err) => console.error("Ошибка загрузки фона:", err));
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // Проверка каждого файла
    const oversized = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileError(
        `Файл "${oversized.name}" превышает допустимый размер (100 МБ). Пожалуйста, выберите меньший файл.`,
      );
      e.target.value = "";
      return;
    }

    // Проверка общего размера
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      setFileError(
        `Общий размер файлов превышает 100 МБ. Пожалуйста, уменьшите количество или размер файлов.`,
      );
      e.target.value = "";
      return;
    }

    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setFileError(null);

    // Проверка общего размера перед отправкой
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      setFileError(
        `Общий размер файлов превышает 100 МБ. Пожалуйста, удалите некоторые файлы.`,
      );
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("idea", formData.idea);
    files.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        body: formDataToSend,
      });

      console.log("response.status:", response.status);
      console.log("response.ok:", response.ok);
      const responseText = await response.text();
      console.log("response body:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Не удалось распарсить JSON:", parseError);
      }

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", contact: "", idea: "" });
        setFiles([]);
        formElementRef.current?.reset();
      } else {
        console.error("Ошибка от сервера:", responseData || responseText);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Сетевая ошибка:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {heroBg && (
        <HeroParallax
          mediaUrl={heroBg}
          isVideo={heroBg.match(/\.(mp4|webm|mov)$/i) ? true : false}
        />
      )}

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-name">inkpauline</h1>
          <button onClick={scrollToForm} className="cta-button">
            Записаться
          </button>
        </div>
      </section>

      <div className="content-wrapper">
        <section className="portfolio">
          <div className="container">
            <h2 className="section-title">Работы</h2>
            {loading ? (
              <div className="loading">Загрузка работ...</div>
            ) : (
              <WorksCarousel works={works} />
            )}
          </div>
        </section>

        <section ref={formRef} className="booking-form">
          <div className="container">
            <h2 className="section-title">Записаться</h2>
            <form onSubmit={handleSubmit} className="form" ref={formElementRef}>
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Telegram / Instagram / Phone *</label>
                <input
                  type="text"
                  id="contact"
                  required
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="idea">Идея тату / Эскиз *</label>
                <textarea
                  id="idea"
                  rows={4}
                  required
                  value={formData.idea}
                  onChange={(e) =>
                    setFormData({ ...formData, idea: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="files">Референсы (несколько файлов)</label>
                <input
                  type="file"
                  id="files"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {fileError && <p className="file-error-message">{fileError}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>

              {submitStatus === "success" && (
                <p className="success-message">
                  Заявка отправлена! Я свяжусь с вами в ближайшее время.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="error-message">
                  Ошибка при отправке. Попробуйте позже.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
