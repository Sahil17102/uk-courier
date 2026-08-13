export const metadata = {
  title: "Contact — UK Courier",
  description: "Contact UK Courier for international shipping support.",
};

export default function ContactPage() {
  return (
    <main id="main">
      <section className="page-hero contact-page-hero">
        <div className="shell narrow">
          <p className="eyebrow">Contact</p>
          <h1>Talk to a global shipping desk.</h1>
          <p className="lead">Call or email the UK Courier team. We will help you plan the next international shipment.</p>
        </div>
      </section>

      <section className="section page-section contact-section">
        <div className="shell contact-layout">
          <div className="contact-list">
            <a href="tel:+442079460958"><small>Phone</small><strong>+44 20 7946 0958</strong><span>→</span></a>
            <a href="mailto:support@ukcourier.global"><small>Email</small><strong>support@ukcourier.global</strong><span>→</span></a>
            <a href="https://maps.google.com/?q=London+United+Kingdom" target="_blank" rel="noreferrer"><small>Address</small><strong>Global Operations Centre,<br />London, United Kingdom</strong><span>↗</span></a>
          </div>
          <form className="form-card contact-form" id="contact-form">
            <div className="form-card-tag">Shipment enquiry</div>
            <h2>Send the basic details.</h2>
            <label>Your name<input id="contact-name" required placeholder="Name" /></label>
            <label>Phone number<input id="contact-phone" inputMode="tel" required placeholder="+44" /></label>
            <label>What do you need to send?<textarea id="contact-message" rows="4" required placeholder="Route, parcel and preferred date"></textarea></label>
            <p className="form-error" id="contact-error" role="alert"></p>
            <button className="button button-dark full-button" type="submit">Send shipment enquiry <span>→</span></button>
          </form>
        </div>
      </section>
    </main>
  );
}
