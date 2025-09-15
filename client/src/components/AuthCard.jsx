export default function AuthCard({ title, description, children, footer }) {
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <span className="logo-dot" />
        <h1 className="auth-title">{title}</h1>
      </div>
      <div className="auth-card__body">
        {description ? <p className="auth-desc">{description}</p> : null}
        {children}
      </div>
      {footer ? <div className="footer">{footer}</div> : null}
    </div>
  );
}
