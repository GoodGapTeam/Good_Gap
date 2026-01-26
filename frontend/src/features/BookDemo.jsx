import { useState } from "react";
import "./BookDemo.css";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) =>
  phone === "" || /^[0-9+\-()\s]{7,18}$/.test(phone);

export default function BookDemo() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    role: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
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

    if (!formData.organization.trim()) newErrors.organization = "Organization is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";

    if (!validatePhone(formData.phone)) newErrors.phone = "Enter a valid phone number.";

    if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required.";
    if (!formData.preferredTime) newErrors.preferredTime = "Preferred time is required.";

    if (!formData.message.trim()) newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Demo Request Submitted ✅", formData);
    setSubmitted(true);

    setFormData({
      fullName: "",
      email: "",
      organization: "",
      role: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
    setErrors({});
  };

  return (
    <div className="bookDemo">
      
        {/* HERO */}
      <section id="home" className="hero">
        <h1>Ready to Transform Your OA Diagnostics?</h1>
        <p>
          Get in touch to request a demo or learn more about how our AI can elevate
          your osteoarthritis care and improve patient outcomes.
        </p>
        <button className="cta-button" onClick={() => { document.getElementById("demoForm").scrollIntoView({ behavior: "smooth" }); }}>
          Request a Demo
        </button>
        
      </section>

      {/* FORM */}
      <section className="bookDemoFormWrap" id="demoForm">
        <div className="bookDemoCard">
          <h2>Book a Demo</h2>
          <p className="formSubText">
            Fill out the details and we’ll contact you soon.
          </p>

          {submitted && (
            <div className="successBox">
              ✅ Your demo request has been submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="formGrid">
            <div className="field">
              <label>Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="John Doe" />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label>Email *</label>
              <input name="email" value={formData.email} onChange={handleChange}
                placeholder="john@example.com" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Organization *</label>
              <input name="organization" value={formData.organization} onChange={handleChange}
                placeholder="Hospital / Clinic" />
              {errors.organization && ( <span className="error">{errors.organization}</span> )}
            </div>

            <div className="field">
              <label>Role / Title *</label>
              <input name="role" value={formData.role} onChange={handleChange}
                placeholder="Radiologist" />
              {errors.role && <span className="error">{errors.role}</span>}
            </div>

            <div className="field">
              <label>Phone (optional)</label>
              <input name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+44 775 123 4567" />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label>Preferred Date *</label>
              <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
              {errors.preferredDate && ( <span className="error">{errors.preferredDate}</span> )}
            </div>

            <div className="field">
              <label>Preferred Time *</label>
              <input type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} />
              {errors.preferredTime && ( <span className="error">{errors.preferredTime}</span> )}
            </div>

            <div className="field fullWidth">
              <label>Message *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Tell us what you want to see in the demo..." />
              {errors.message && <span className="error">{errors.message}</span>}
            </div>

            <div className="field fullWidth">
              <button className="cta-button" type="submit">
                Submit Demo Request
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
