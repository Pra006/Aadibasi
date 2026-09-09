import Icon from "./Icon";

export default function EmptyState({ icon = "inbox", title, description, action }) {
  return (
    <div className="w-full py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
        <Icon name={icon} size={32} className="text-forest-base/70" />
      </div>
      <h3 className="mt-4 font-headline text-xl text-forest-deep">{title}</h3>
      {description && <p className="mt-1 text-sm text-on-surface-variant max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
