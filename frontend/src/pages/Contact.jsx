import { useNavigate } from 'react-router-dom';
import './Contact.css';

export default function Contact() {

    const navigate = useNavigate();

    return (
        //  <!-- Contact/CTA Section -->
        <section id="contact">
            <h2>Ready to Transform Your OA Diagnostics?</h2>
            <p>Get in touch to request a demo or learn more about how our AI can elevate your osteoarthritis care and improve patient outcomes.</p>
            <button className='cta-button' onClick={() => navigate('/contact/contactUs')}>Contact Us Today</button>
        </section>
    )
}