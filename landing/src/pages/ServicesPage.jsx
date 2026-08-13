const serviceRows = [
  ["service-coral", "01", "Global movement", "International courier", "Documents and parcels moved across borders with coordinated pickup and direct support.", "/contact", "Plan a pickup"],
  ["service-yellow", "02", "Worldwide lanes", "Cross-border shipping", "International parcel movement with standard and express preferences based on the shipment.", "/rate-calculator", "Get an estimate"],
  ["service-green", "03", "For growing teams", "Business dispatch", "Recurring pickup and dispatch assistance for sellers, offices and expanding businesses.", "/contact", "Discuss your volume"],
  ["service-purple", "04", "Heavier consignments", "Freight support", "Help coordinating commercial consignments when the parcel needs more planning than a standard courier.", "tel:+442079460958", "Call the team"],
];

export const metadata = {
  title: "Services — UK Courier",
  description: "International courier, cross-border shipping, business dispatch and freight support from UK Courier.",
};

export default function ServicesPage() {
  return (
    <main id="main">
      <section className="page-hero services-page-hero">
        <div className="shell narrow">
          <p className="eyebrow">Services</p>
          <h1>The right movement for each shipment.</h1>
          <p className="lead">From urgent documents to regular international dispatches, we help you choose a practical service for the route, timing and parcel.</p>
        </div>
      </section>

      <section className="section service-showcase">
        <div className="shell service-showcase-grid">
          <div className="service-showcase-photo reveal">
            <img src="/assets/pax-real-warehouse.jpg" alt="Workers moving parcels through a real warehouse" />
            <span>Global desk. Connected movement.</span>
          </div>
          <div className="service-showcase-copy reveal">
            <p className="eyebrow">One team, multiple routes</p>
            <h2>From first pickup to final handoff.</h2>
            <p>Choose international courier, cross-border delivery, recurring business dispatch or planned freight support.</p>
            <div className="service-pills"><span>Priority</span><span>Cross-border</span><span>Business</span><span>Freight</span></div>
          </div>
        </div>
      </section>

      <section className="section page-section service-list-section">
        <div className="shell service-list">
          {serviceRows.map(([tone, number, label, title, copy, link, linkText]) => (
            <article className={`service-row ${tone} reveal`} key={number}>
              <span className="service-index">{number}</span>
              <div><p className="mini-label">{label}</p><h2>{title}</h2></div>
              <div><p>{copy}</p><a href={link}>{linkText} →</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section soft-section">
        <div className="shell compact-cta reveal">
          <div><p className="eyebrow">Not sure what fits?</p><h2>Tell us what you need to move.</h2></div>
          <a className="button button-dark" href="/contact">Contact UK Courier <span>→</span></a>
        </div>
      </section>
    </main>
  );
}
