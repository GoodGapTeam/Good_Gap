import './About.css';

export default function About() {
    return (
        // <!-- About Section -->
        <section className="about-section" id="about">
            <section className="about">
                <h2>About Good Gap</h2>
                <p className="section-subtitle">Leading the revolution in AI-powered osteoarthritis diagnostics</p>
                <div className="about-content">
                    <div className="about-box">
                        <h3>Our Mission</h3>
                        <p>To revolutionize osteoarthritis diagnosis through artificial intelligence and accessible medical imaging. We believe that early detection and accurate evaluation are key to improving patients' quality of life. By merging advanced AI technology with clinical insight, we empower healthcare professionals to diagnose OA sooner, more objectively, and with greater confidence.</p>
                    </div>
                    <div className="about-box">
                        <h3>Our Expertise</h3>
                        <p>Founded by experts at the intersection of AI and healthcare, we bring together seasoned data scientists, radiologists, and orthopedic clinicians. With years of experience in machine learning, computer vision, and medical image analysis, our solutions are grounded in scientific research and real-world healthcare needs.</p>
                    </div>
                    <div className="about-box">
                        <h3>Innovation & Accuracy</h3>
                        <p>Committed to quality and clinical validation, our AI model has been extensively trained and tested, showing high accuracy in distinguishing OA severity levels. We validate our tools against expert assessments and published benchmarks, maintaining robust quality assurance and continuously refining our algorithms with new data.</p>
                    </div>
                </div>
            </section>
        </section>
    )
}