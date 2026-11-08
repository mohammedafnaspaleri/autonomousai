import { Reveal, Eyebrow } from "../Reveal";

export default function SectionHead({ label, title, intro, align = "left", id }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`} id={id}>
      <Reveal><Eyebrow>{label}</Eyebrow></Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem]" data-testid={id ? `${id}-title` : undefined}>
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-brand-muted sm:text-lg">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
