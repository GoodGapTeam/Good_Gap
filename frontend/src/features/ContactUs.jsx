import emailjs from "@emailjs/browser";
import DOMPurify from "dompurify";
import { useState } from "react";
import "./ContactUs.css";

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const validatePhone = (phone) => phone === "" || /^[0-9+\-()\s]{7,18}$/.test(phone);

// Sanitize (no tags/attrs)
const sanitizeInput = (input) =>
  DOMPurify.sanitize(String(input ?? "").trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

// Centralized limits
const LIMITS = {
  fullName: 100,
  email: 100,
  subject: 200,
  phone: 20,
  message: 2000,
  website: 100, // honeypot
};

// Client-side rate limiting (basic)
const RATE_LIMIT_MS = 120_000; // 2 minute

export default function ContactUs() {
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [startedAt] = useState(() => Date.now());

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
    website: "", // ✅ include honeypot in state
  });

  const handleChange = (e) => {
    setSubmitted(false);

    const { name, value } = e.target;
    const limit = LIMITS[name] ?? 2000;

    if (value.length <= limit) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const fullName = sanitizeInput(formData.fullName);
    const email = sanitizeInput(formData.email);
    const subject = sanitizeInput(formData.subject);
    const phone = sanitizeInput(formData.phone);
    const message = sanitizeInput(formData.message);

    if (!fullName) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
      newErrors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes.";
    }

    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Enter a valid email.";

    if (!subject) {
      newErrors.subject = "Subject is required.";
    } else if (subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters.";
    }
    if (!validatePhone(phone)) newErrors.phone = "Enter a valid phone number.";

    if (!message) newErrors.message = "Message is required.";
    else if (message.length < 10) newErrors.message = "Message must be at least 10 characters.";
    else if (message.length > LIMITS.message) newErrors.message = "Message is too long.";

    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount > 2) {
      newErrors.message = "Please limit the number of links in your message.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check - check both state AND DOM
    const honeypotValue = formData.website || document.getElementById('website')?.value;
    if (honeypotValue && honeypotValue.trim()) {
      console.warn("Honeypot triggered");
      return;
    }
    if (Date.now() - startedAt < 2500) return;

    // Basic client rate limit
    const now = Date.now();
    const last = Number(sessionStorage.getItem("contact_last_sent") || 0);
    if (now - last < RATE_LIMIT_MS) {
      alert("Please wait a minute before sending another message.");
      return;
    }

    if (!validate()) return;

    setIsSending(true);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !CONTACT_TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("Email service configuration missing");
      alert("Service temporarily unavailable. Please try again later.");
      setIsSending(false);
      return;
    }

    const stripNewlines = (s) => s.replace(/[\r\n]+/g, " ");

    const cleanFullName = sanitizeInput(formData.fullName).slice(0, LIMITS.fullName);
    const cleanEmail = stripNewlines(sanitizeInput(formData.email)).slice(0, LIMITS.email);
    const cleanSubject = stripNewlines(sanitizeInput(formData.subject)).slice(0, LIMITS.subject);
    const cleanPhone = (sanitizeInput(formData.phone) || "Not Provided").slice(0, LIMITS.phone);
    const cleanMessage = sanitizeInput(formData.message).slice(0, LIMITS.message);

    const templateParams = {
      fullName: cleanFullName,
      email: cleanEmail,
      subject: cleanSubject,
      phone: cleanPhone,
      message: cleanMessage,
      type: "Contact",
    };


    try {
      await emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams, PUBLIC_KEY);

      sessionStorage.setItem("contact_last_sent", String(Date.now()));

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
        website: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submission failed:");
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contactUs">
      <section id="home" className="hero">
        <h1>Contact Us</h1>
        <p>Get in touch to request a demo or learn more about our AI-powered OA diagnostics.</p>
      </section>

      <section className="contactFormWrap" id="contactForm">
        <div className="contactCard">
          <h2>Send us a Message</h2>

          {submitted && <div className="successBox">✅ Thanks! Your message has been sent successfully.</div>}

          <form onSubmit={handleSubmit} className="contactForm" noValidate>
            {/* Honeypot */}
            <div style={{ position: "absolute", left: "-9999px", top: "auto" }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                maxLength={LIMITS.fullName}
                autoComplete="name"
                required
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                maxLength={LIMITS.email}
                autoComplete="email"
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Demo request / Support / Partnership"
                maxLength={LIMITS.subject}
                required
              />
              {errors.subject && <span className="error">{errors.subject}</span>}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 775 123 4567"
                maxLength={LIMITS.phone}
                autoComplete="tel"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="field fullWidth">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
                maxLength={LIMITS.message}
                required
              />
              {errors.message && <span className="error">{errors.message}</span>}
            </div>

            <div className="field fullWidth">
              <button className={`cta-button ${isSending ? "loading" : ""}`} type="submit" disabled={isSending}>
                {isSending ? "Sending Message..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
