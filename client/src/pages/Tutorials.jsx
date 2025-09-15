// src/pages/Tutorials.jsx
import React, { useMemo, useState } from "react";
import "./tutorials.scoped.css";

/** Minimal dataset — replace with your real teachers later. */
const TEACHERS = [
  {
    id: "sofia",
    name: "Sofia Martinez",
    email: "sofia@example.com",
    year: 2023,
    role: "Cloud Engineer",
    company: "Amazon Web Services",
    location: "Perth, Australia",
    industry: "Cloud Computing",
    avatar: null,            // put '/assets/sofia.jpg' when you have it
    companyBadge: "AWS",
    quote: "Scaling ideas into solutions on the cloud.",
  },
  {
    id: "jacob",
    name: "Jacob Miller",
    email: "jacob@example.com",
    year: 2023,
    role: "Software Engineer",
    company: "Deloitte Digital",
    location: "Sydney, Australia",
    industry: "Software & IT Consulting",
    avatar: null,
    companyBadge: "Deloitte Digital",
    quote: "Engineering solutions that transform businesses.",
  },
  {
    id: "ashley",
    name: "Ashley Hills",
    email: "ashley@example.com",
    year: 2023,
    role: "UI/UX Designer",
    company: "Canva",
    location: "Brisbane, Australia",
    industry: "Software & IT",
    avatar: null,
    companyBadge: "Canva",
    quote: "Designing with purpose to empower creativity.",
  },
  {
    id: "daniel",
    name: "Daniel O’Connor",
    email: "daniel@example.com",
    year: 2024,
    role: "AI/ML Engineer",
    company: "Google",
    location: "Sydney, Australia",
    industry: "AI & ML",
    avatar: null,
    companyBadge: "Google",
    quote: "Pioneering intelligence that learns and adapts.",
  },
];

/** Little pill button */
function Chip({ active, onClick, children }) {
  return (
    <button
      className={`tl-chip ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

/** Card for each teacher */
function TeacherCard({ t }) {
  const initials = t.name.split(" ").map(s => s[0]).slice(0,2).join("");
  return (
    <article className="tl-card">
      <div className="tl-card__left">
        {t.avatar ? (
          <img className="tl-avatar" src={t.avatar} alt={t.name} />
        ) : (
          <div className="tl-avatar tl-avatar--fallback" aria-label={t.name}>
            {initials}
          </div>
        )}
      </div>

      <div className="tl-card__main">
        <header className="tl-head">
          <h3 className="tl-name">{t.name}</h3>
          {t.companyBadge && <span className="tl-badge">{t.companyBadge}</span>}
        </header>

        <dl className="tl-meta">
          <div><dt>Class Year</dt><dd>{t.year}</dd></div>
          <div><dt>Role</dt><dd>{t.role}</dd></div>
          <div><dt>Company</dt><dd>{t.company}</dd></div>
          <div><dt>Location</dt><dd>{t.location}</dd></div>
        </dl>

        <div className="tl-tags">
          <span className="tl-tag">{t.industry}</span>
        </div>

        <blockquote className="tl-quote">“{t.quote}”</blockquote>

        <div className="tl-actions">
          <a className="tl-btn" href={`mailto:${t.email}`} target="_blank" rel="noreferrer">
            Connect
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Tutorials() {
  // lightweight filters
  const [year, setYear] = useState("All");
  const [location, setLocation] = useState("All");
  const [industry, setIndustry] = useState("All");

  const years = useMemo(() => ["All", ...Array.from(new Set(TEACHERS.map(t => t.year))).sort()], []);
  const locations = useMemo(() => ["All", ...Array.from(new Set(TEACHERS.map(t => t.location)))], []);
  const industries = useMemo(() => ["All", ...Array.from(new Set(TEACHERS.map(t => t.industry)))], []);

  const data = useMemo(() => {
    return TEACHERS.filter(t =>
      (year === "All" || t.year === year) &&
      (location === "All" || t.location === location) &&
      (industry === "All" || t.industry === industry)
    );
  }, [year, location, industry]);

  return (
    <section className="tutorials">
      <div className="tl-header">
        <h1>Recommend tutors</h1>
        <p>Explore the achievements of our graduates, forging their paths in the tech industry.</p>
      </div>

      {/* filters */}
      <div className="tl-filters">
        <div className="tl-chip-group">
          {years.map(y => (
            <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>
          ))}
        </div>

        <div className="tl-selects">
          <label className="tl-select">
            <span>Location</span>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>

          <label className="tl-select">
            <span>Industry</span>
            <select value={industry} onChange={e => setIndustry(e.target.value)}>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* grid */}
      <div className="tl-grid">
        {data.map(t => <TeacherCard key={t.id} t={t} />)}
        {!data.length && (
          <div className="tl-empty card">
            <p>No results. Try a different combination.</p>
          </div>
        )}
      </div>
    </section>
  );
}
