import emailjs from "@emailjs/browser";
import { useState } from "react";
import "./ContactUs.css";

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) =>
  phone === "" || /^[0-9+\-()\s]{7,18}$/.test(phone);

export default function ContactUs() {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setSubmitted(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email.";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!validatePhone(formData.phone)) newErrors.phone = "Enter a valid phone number.";

    if (!formData.message.trim()) newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);

    const SERVICE_ID = "goodgap.team@gmail.com";
    const CONTACT_TEMPLATE_ID = "template_fm4niww"; 
    const PUBLIC_KEY = "qMUuNa6slI0ouzzeN";

    const templateParams = {
      fullName: formData.fullName,
      email: formData.email,
      subject: formData.subject,
      phone: formData.phone || "Not Provided",
      message: formData.message,
      type: "Contact",
    };

    emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          phone: "",
          message: "",
        });
        setErrors({});
      })
      .catch(() => {
        console.error("Submission failed: ", error);
        alert("Failed to send message. Please try again later.");
      })
      .finally(() => setIsSending(false));

  };

  return (
    <div className="contactUs">
      {/* HERO */}

      <section id="home" className="hero">
        <h1>Contact Us</h1>
        <p>
          Get in touch to request a demo or learn more about our AI-powered OA diagnostics.
        </p>
      </section>

      {/* FORM */}
      <section className="contactFormWrap" id="contactForm">
        <div className="contactCard">
          <h2>Send us a Message</h2>

          {submitted && (
            <div className="successBox">
              ✅ Thanks! Your message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contactForm">
            <div className="field">
              <label>Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label>Email *</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Subject *</label>
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Demo request / Support / Partnership" />
              {errors.subject && <span className="error">{errors.subject}</span>}
            </div>

            <div className="field">
              <label>Phone (optional)</label>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 775 123 4567"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="field fullWidth">
              <label>Message *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Write your message..." />
              {errors.message && <span className="error">{errors.message}</span>}
            </div>

            <div className="field fullWidth">
              <button 
                className={`cta-button ${isSending ? "loading" : ""}`} 
                type="submit" 
                disabled={isSending}
              >
                {isSending ? "Sending Message..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
