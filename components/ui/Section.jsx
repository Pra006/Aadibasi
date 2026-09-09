export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold mb-2">
            {eyebrow}
          </div>
        )}
        <h2 className="font-headline text-3xl sm:text-4xl text-forest-deep leading-tight">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-on-surface-variant max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Section({ className = "", children, id }) {
  return (
    <section id={id} className={`w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">{children}</div>
    </section>
  );
}
