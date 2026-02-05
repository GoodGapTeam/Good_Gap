import emailjs from "@emailjs/browser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Home() {

  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  const [formData, setFormData] = useState({
      fullName: "",
      email: "",
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
  
      if (!formData.message.trim()) newErrors.message = "Message is required.";
      else if (formData.message.length < 10)
        newErrors.message = "Message must be at least 10 characters.";
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSending(true)

      const SERVICE_ID = "goodgap.team@gmail.com";
      const FEEDBACK_TEMPLATE_ID = "template_qnjmmem";
      const PUBLIC_KEY = "qMUuNa6slI0ouzzeN";
  
      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        message: formData.message,
        type: "Feedback",
      };

      emailjs.send(SERVICE_ID, FEEDBACK_TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then(() => {
          setSubmitted(true);
          setFormData({
            fullName: "",
            email: "",
            message: "",
          });
          setErrors({});
        })
        .catch(() => {
          alert("Failed to send feedback. Please try again later.");
        })
        .finally(() => setIsSending(false));
    };

  return (
    <section>
      
      {/* -- Banner Section -- */}
      <section id="home" className="hero">
        <h1>Transforming Osteoarthritis Diagnosis with AI</h1>
        <h2>Early Detection and Accurate Grading Through X-ray Machine Learning</h2>
        <p>Our platform leverages cutting-edge AI and medical imaging to diagnose osteoarthritis from X-rays with speed and precision. By analyzing standard radiographs, we identify subtle signs of joint degeneration that may be missed by the naked eye, enabling early intervention and better patient outcomes.</p>
        <button className="cta-button" onClick={() => navigate("/book-demo")}>Request a Demo</button>
        
      </section>

        {/* -- Stats Bar --> */}
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

      {/* <-- Benefits Section --> */}
      <section className="benefit-section">
          <h2>Key Benefits</h2>
          <p className="section-subtitle">Empowering clinicians with AI-driven insights for superior osteoarthritis care</p>
          <div className="benefits-grid">
              <div className="benefit-card">
                  <div className="benefit-icon">🎯</div>
                  <h3>Accurate AI Detection</h3>
                  <p>Advanced neural networks automatically recognize osteoarthritis indicators like joint space narrowing and bone spurs on X-rays, matching expert diagnostic accuracy in 87% of cases.</p>
              </div>
              <div className="benefit-card">
                  <div className="benefit-icon">⚡</div>
                  <h3>Early Intervention</h3>
                  <p>Catch early-stage OA changes that traditional methods often overlook, enabling proactive treatment plans to slow disease progression and potentially avoid invasive procedures.</p>
              </div>
              <div className="benefit-card">
                  <div className="benefit-icon">📊</div>
                  <h3>Objective Severity Grading</h3>
                  <p>Standardized OA severity classification using the Kellgren-Lawrence scale (Grade 0-4) reduces inter-observer variability and ensures consistent evaluation criteria.</p>
              </div>
              <div className="benefit-card">
                  <div className="benefit-icon">⏱️</div>
                  <h3>Improved Efficiency</h3>
                  <p>Automated analysis delivers results within seconds, saving radiologists and orthopedic specialists valuable time while streamlining clinical workflows.</p>
              </div>
              <div className="benefit-card">
                  <div className="benefit-icon">🧠</div>
                  <h3>Data-Driven Insights</h3>
                  <p>Built on robust datasets including the Osteoarthritis Initiative, our AI continually learns and improves, providing cutting-edge diagnostic insight at all times.</p>
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
            <div className="field">
              <label>Full Name *</label>
              <input name="fullName" value={formData.fullName.trim()} onChange={handleChange}
                placeholder="John Doe" />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label>Email *</label>
              <input name="email" value={formData.email.trim()} onChange={handleChange}
                placeholder="john@example.com" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field fullWidth">
              <label>Message *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="What should we improve?" />
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
