export default function PageHeader({ title, description, children }) {
  return (
    <div className="heading">
      <div>
        <div className="eyebrow">TUITIONPRO / WORKSPACE</div>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {children}
    </div>
  );
}
