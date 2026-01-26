import './Services.css';

export default function Services() {
    return (
        // <-- Services Section -->
        <section className="services-section" id="services">
            <section className='services'>
                <h2>Our Services</h2>
                <p className="section-subtitle">Comprehensive AI-powered solutions for osteoarthritis diagnostics and image analysis</p>
                <div className="services-list">
                    <div className="service-item">
                        <h3>
                            <span className="service-icon">🔍</span>
                            Automated OA Detection
                        </h3>
                        <p>State-of-the-art machine learning automatically scans and detects signs of osteoarthritis in X-ray images. Our algorithm examines radiographs for telltale features such as joint space narrowing, osteophytes, and changes in bone texture, with detected findings highlighted for easy clinical review.</p>
                    </div>
                    <div className="service-item">
                        <h3>
                            <span className="service-icon">📈</span>
                            Severity Grading & Classification
                        </h3>
                        <p>Every positive OA finding receives an objective severity grade based on the Kellgren-Lawrence scale (grades 0-4). This quantification of disease severity supports treatment decisions and enables confident tracking of progression over time.</p>
                    </div>
                    <div className="service-item">
                        <h3>
                            <span className="service-icon">🖼️</span>
                            X-ray Image Preprocessing
                        </h3>
                        <p>Our pipeline automatically standardizes image resolution, optimizes contrast, applies enhancement filters, and isolates regions of interest. This preprocessing improves AI performance and helps both algorithms and human experts make more accurate interpretations.</p>
                    </div>
                    <div className="service-item">
                        <h3>
                            <span className="service-icon">💡</span>
                            Clinical Decision Support
                        </h3>
                        <p>Seamlessly integrate AI insights into clinical workflows with user-friendly summary reports, annotated X-rays, and evidence-based recommendations. Our solution integrates with standard hospital systems (PACS/EHR), supporting clinical judgment while enhancing confidence and efficiency.</p>
                    </div>
                </div>
            </section>
        </section>
    )
}