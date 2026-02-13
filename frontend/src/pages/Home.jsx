import emailjs from "@emailjs/browser";
import DOMPurify from "dompurify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import activityIcon from '../assets/activity.svg';
import diagnosisIcon from '../assets/diagnosis.svg';
import treatmentIcon from '../assets/treatment.svg';
import "./Home.css";

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

// Sanitization function
const sanitizeInput = (input) =>
  DOMPurify.sanitize(String(input ?? "").trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

// Character limits
const LIMITS = { fullName: 100, email: 100, message: 2000, website: 100,  }; // honeypot

// Rate limiting
const RATE_LIMIT_MS = 120_000; // 2 minutes


export default function Home() {

  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [startedAt] = useState(() => Date.now());
  const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      message: "",
      website: "", // honeypot
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
      const message = sanitizeInput(formData.message);

      // Name validation
      if (!fullName) {
        newErrors.fullName = "Full name is required.";
      } else if (fullName.length < 2) {
        newErrors.fullName = "Name must be at least 2 characters.";
      } else if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
        newErrors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes.";
      }

      // Email validation
      if (!email) {
        newErrors.email = "Email is required.";
      } else if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      // Message validation
      if (!message) {
        newErrors.message = "Message is required.";
      } else if (message.length < 10) {
        newErrors.message = "Message must be at least 10 characters.";
      } else if (message.length > LIMITS.message) {
        newErrors.message = "Message is too long.";
      }

      // Spam detection
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

      // Time-based check (silent fail)
      if (Date.now() - startedAt < 2500) {
        console.warn("Form submitted too quickly");
        return;
      }

      // Rate limiting
      const now = Date.now();
      const last = Number(sessionStorage.getItem("feedback_last_sent") || 0);
      if (now - last < RATE_LIMIT_MS) {
        const minutesLeft = Math.ceil((RATE_LIMIT_MS - (now - last)) / 60000);
        alert(`Please wait ${minutesLeft} minute(s) before sending another message.`);
        return;
      }

      if (!validate()) return;

      setIsSending(true);

      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const FEEDBACK_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!SERVICE_ID || !FEEDBACK_TEMPLATE_ID || !PUBLIC_KEY) {
        console.error("Email service configuration missing");
        alert("Service temporarily unavailable. Please try again later.");
        setIsSending(false);
        return;
      }

      const stripNewlines = (s) => s.replace(/[\r\n]+/g, " ");

      const templateParams = {
        fullName: sanitizeInput(formData.fullName).slice(0, LIMITS.fullName),
        email: stripNewlines(sanitizeInput(formData.email)).slice(0, LIMITS.email),
        message: sanitizeInput(formData.message).slice(0, LIMITS.message),
        type: "Feedback",
        timestamp: new Date().toISOString(),
      };

      try {
        await emailjs.send(SERVICE_ID, FEEDBACK_TEMPLATE_ID, templateParams, PUBLIC_KEY);

        sessionStorage.setItem("feedback_last_sent", String(Date.now()));

        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          message: "",
          website: "",
        });
        setErrors({});
      } catch (error) {  // ✅ Fixed: Added error parameter
        console.error("Submission failed");
        alert("Failed to send feedback. Please try again later.");
      } finally {
        setIsSending(false);
      }
    };

  return (
    <section>
      
      {/* -- Banner Section -- */}
      <section id="home" className="hero">
        <h1>Transforming Osteoarthritis Care</h1>
        <h2>Early Detection & Personalised Treatment plans</h2>
        <p>Our research proven AI cartilage model reads MRI scans to detect osteoarthritis early and create personalised treatment plans.</p>
        <button className="cta-button" >Coming Soon</button>
        
      </section>

        {/* -- Stats Bar --> */}
        {/*
      <div className="stats-bar">
          <div className="stats-container">
              <div className="stat-item">
                  <div className="stat-number">87%</div>
                  <div className="stat-label">Diagnostic Accuracy</div>
              </div>
              <div className="stat-item">
                  <div className="stat-number">0-4</div>
                  <div className="stat-label">KL Severity Grades</div>
              </div>
              <div className="stat-item">
                  <div className="stat-number">&lt; 1s</div>
                  <div className="stat-label">Analysis Time</div>
              </div>
          </div>
      </div>
          */}


      {/* <-- Benefits Section --> */}
      <section className="benefit-section">
          <h2>Key Benefits</h2>
          <p className="section-subtitle">Empowering clinicians with AI-driven insights for superior osteoarthritis care</p>
          <div className="benefits-grid">
              <div className="benefit-card">
                  <div className="benefit-icon">
                      <img src={diagnosisIcon} alt="Early Diagnosis Icon" />
                  </div>
                  <h3>Early Diagnosis</h3>
                  <p>The processes that lead to osteoarthritis often begin at a young age but are typically diagnosed much later, once joint pain appears. Our physics-based AI model identifies early signs of cartilage degeneration, enabling earlier intervention.</p>
              </div>
              <div className="benefit-card">
                  <div className="benefit-icon">
                    <img src={treatmentIcon} alt="Patient Specific Treatment Icon" />
                  </div>
                  <h3>Patient-Specific Treatment</h3>
                  <p>Osteoarthritis treatments often fail due to generalized approaches. Our model analyses each patient’s knee joint to deliver tailored treatment protocols.</p>
              </div>
              <div className="benefit-card">
                  <div className="benefit-icon">
                    <img src={activityIcon} alt="Activity Map Icon" />
                  </div>
                  <h3>Activity Map</h3>
                  <p>Our model assesses a patient’s full range of activities and produces an activity map highlighting those that support or compromise knee health.</p>
              </div>
          </div>
      </section>



      {/* -- Feedback Section -- */}
      <section className="feedback-hero" aria-labelledby="feedback-title">
        <div className="feedback-hero__inner">
          {/* LEFT */}
          <div className="feedback-hero__left">
            <h2 id="feedback-title" className="feedback-hero__title">
              Help us make this better.
            </h2>
            <p className="feedback-hero__desc">
              Share ideas, report issues, or tell us what you’d love to see next.
              Your feedback directly shapes the product.
            </p>

            <ul className="feedback-hero__bullets">
              <li>Suggestions & feature requests</li>
              <li>Bug reports & usability issues</li>
              <li>General comments</li>
            </ul>
          </div>

          {/* RIGHT */}
          <div className="feedback-hero__right">

          {submitted && (
            <div className="successBox">
              ✅ Your feedback has been submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="formGrid">

            {/* Honeypot */}
            <div style={{ position: "absolute", left: "-9999px", top: "auto" }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="fullName">Full Name *</label>
              <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="John Doe" maxLength={LIMITS.fullName} autoComplete="name" required/>
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" maxLength={LIMITS.email} autoComplete="email" required/>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field fullWidth">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="What should we improve?" maxLength={LIMITS.message} required/>
              {errors.message && <span className="error">{errors.message}</span>}
            </div>

            <div className="field fullWidth">
              <button 
                className={`cta-button ${isSending ? "loading" : ""}`} 
                type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Submit Feedback"}
              </button>
            </div>
          </form>
          </div>
        </div>
      </section>
    </section>
  );
}
