"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import HeroParallax from "./components/HeroParallax";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    idea: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [works, setWorks] = useState<
    { id: number; src: string; alt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [heroBg, setHeroBg] = useState("");
  const formRef = useRef<HTMLElement | null>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

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

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", contact: "", idea: "" });
        setFiles([]);
        e.currentTarget.reset();
      } else {
        setSubmitStatus("error");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

      <section className="portfolio">
        <div className="container">
          <h2 className="section-title">Работы</h2>
          {loading ? (
            <div className="loading">Загрузка работ...</div>
          ) : (
            <div className="works-grid">
              {works.map((work) => (
                <div key={work.id} className="work-item">
                  {work.src.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={work.src}
                      className="work-image"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={work.src}
                      alt={work.alt}
                      width={600}
                      height={600}
                      className="work-image"
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section ref={formRef} className="booking-form">
        <div className="container">
          <h2 className="section-title">Записаться</h2>
          <form onSubmit={handleSubmit} className="form">
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
    </>
  );
}
