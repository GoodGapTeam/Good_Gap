import pipeline from "../assets/pipeline.jpg";
import "./HowItWorks.css";

export default function HowItWorks() {
  const steps = [
    { label: "Knee MRI", icon: "🩻", desc: "Patient undergoes a standard knee MRI scan" },
    { label: "Machine Learning", icon: "🤖", desc: "AI model processes and interprets scan data" },
    { label: "Cartilage Model", icon: "🦴", desc: "Physics-based cartilage model is generated" },
    { label: "Activity Map", icon: "🗺️", desc: "Personalised activity recommendations produced" },
    { label: "Outcomes", icon: "✅", desc: "Early diagnosis, tailored treatment & biomaterial design" },
  ];

  return (
    <section className="how-it-works">
      <div className="hiw-header">
        <h2>How It Works</h2>
        <p>From MRI scan to personalised treatment — in four intelligent steps</p>
      </div>

      {/* Pipeline image */}
      <div className="hiw-pipeline-wrap">
        <img
          src={pipeline}
          alt="Pipeline: Knee MRI to Machine Learning to Cartilage Model to Activity Map to Outcomes"
          className="hiw-pipeline-img"
        />
      </div>

      {/* Step cards */}
      <div className="hiw-steps">
        {steps.map((step, i) => (
          <div className="hiw-step" key={i}>
            <div className="hiw-step-number">{i + 1}</div>
            <div className="hiw-step-icon">{step.icon}</div>
            <h3>{step.label}</h3>
            <p>{step.desc}</p>
            {i < steps.length - 1 && <div className="hiw-connector" />}
          </div>
        ))}
      </div>
    </section>
  );
}