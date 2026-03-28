import { production } from "@/data/production";

export const metadata = {
  title: "Production Framework, Chasing Chaos",
  description:
    "Tone, style, thematic architecture, and series intentions for Chasing Chaos.",
};

export default function ProductionPage() {
  return (
    <div className="page-container">
      <div className="section-subtitle">Section Three</div>
      <h1 className="page-title">
        Production Framework, Thematic Architecture &amp; Series Intentions
      </h1>
      <p className="page-subtitle">
        The guiding principles that shape how this story is told, from
        editorial philosophy to the handling of the most difficult human
        material.
      </p>

      {production.sections.map((section, i) => (
        <div
          key={section.id}
          className="production-section"
          id={section.id}
          style={{
            animationFillMode: "both",
            animation: `fadeInUp 0.5s var(--ease-out) ${i * 0.05}s`,
          }}
        >
          <h2>{section.title}</h2>
          {section.content.map((paragraph, j) => (
            <p key={j}>{paragraph}</p>
          ))}
        </div>
      ))}

      <div className="final-statement">
        <h2>{production.finalStatement.title}</h2>
        {production.finalStatement.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
