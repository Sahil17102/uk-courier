import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import EstimatePage from "./pages/EstimatePage.jsx";
import WeightCalculatorPage from "./pages/WeightCalculatorPage.jsx";
import TrackPage from "./pages/TrackPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { usePageInteractions } from "./usePageInteractions.js";
import { ADMIN_AUTH_URL, API_BASE_URL, CLIENT_APP_URL, CLIENT_AUTH_URL } from "./config.js";

const primaryNavItems = [
  ["/services", "Services"],
  ["/rate-calculator", "Rate Calculator"],
  ["/track", "Track Shipment"],
  ["/contact", "Contact"],
];

const utilityNavItems = [
  ["/weight-calculator", "Weight Calculator"],
];

const navItems = [...primaryNavItems, ...utilityNavItems];

const footerItems = [
  ["/services", "Services"],
  ["/rate-calculator", "Rate Calculator"],
  ["/weight-calculator", "Weight Calculator"],
  ["/track", "Track"],
  ["/contact", "Contact"],
];

function navigateClient(to) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function AppLink({ to, className, children, ...props }) {
  const isActive = window.location.pathname === to;
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;

  return (
    <a
      href={to}
      className={resolvedClassName}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateClient(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Header({ pathname }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className={`site-header${isHome ? " site-header--home" : ""}`}>
      <div className="header-utility">
        <div className="shell header-utility-inner">
          <span><i></i> International courier and global shipping support</span>
          <nav aria-label="Utility navigation">
            {utilityNavItems.map(([path, label]) => (
              <AppLink key={path} to={path}>{label}</AppLink>
            ))}
            <a href={CLIENT_AUTH_URL}>Sign In</a>
          </nav>
        </div>
      </div>
      <div className="shell nav">
        <AppLink className="brand" to="/" aria-label="UK Courier home">
          <span className="brand-logo"><img src="/assets/uk-courier-logo.png" alt="UK Courier — Global Shipping Solutions" /></span>
        </AppLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavItems.map(([path, label]) => (
            <AppLink
              key={path}
              to={path}
              className={({ isActive }) => isActive ? "is-active" : ""}
            >
              {label}
            </AppLink>
          ))}
          <a href={CLIENT_AUTH_URL} className="nav-signin">
            Log In <span aria-hidden="true">→</span>
          </a>
        </nav>
        {isHome ? (
          <AppLink className="home-quote-button" to="/rate-calculator">
            Get a Quote <span aria-hidden="true">↗</span>
          </AppLink>
        ) : (
          <a className="nav-phone" href="tel:+442079460958">
            <small>Talk to our team</small>
            <strong>+44 20 7946 0958</strong>
          </a>
        )}
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation">
        {navItems.map(([path, label]) => (
          <AppLink key={path} to={path}>{label}</AppLink>
        ))}
        <a href={CLIENT_AUTH_URL}>Sign In</a>
        <a className="button button-dark" href="tel:+442079460958">Call logistics desk</a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <AppLink className="brand footer-brand" to="/">
            <span className="brand-logo"><img src="/assets/uk-courier-logo.png" alt="UK Courier — Global Shipping Solutions" /></span>
          </AppLink>
          <p>Clear, practical international shipping support.</p>
        </div>
        <div className="footer-nav">
          {footerItems.map(([path, label]) => <AppLink key={path} to={path}>{label}</AppLink>)}
        </div>
        <address className="footer-contact">
          <a href="tel:+442079460958">+44 20 7946 0958</a>
          <a href="mailto:support@ukcourier.global">support@ukcourier.global</a>
          <span>Global Operations Centre</span>
          <span>London, United Kingdom</span>
        </address>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} UK Courier</span>
        <span>London · Global Shipping · Worldwide</span>
      </div>
    </footer>
  );
}

function SiteRoutes({ location }) {
  usePageInteractions(location, navigateClient);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const titles = {
      "/": "UK Courier — Global Shipping Solutions",
      "/services": "Services — UK Courier",
      "/estimate": "Rate Calculator — UK Courier",
      "/rate-calculator": "Rate Calculator — UK Courier",
      "/weight-calculator": "Weight Calculator — UK Courier",
      "/track": "Track a Shipment — UK Courier",
      "/contact": "Contact — UK Courier",
    };
    document.title = titles[location.pathname] || titles["/"];
  }, [location.pathname]);

  const pages = {
    "/": <HomePage />,
    "/services": <ServicesPage />,
    "/estimate": <EstimatePage />,
    "/rate-calculator": <EstimatePage />,
    "/weight-calculator": <WeightCalculatorPage />,
    "/track": <TrackPage />,
    "/contact": <ContactPage />,
  };

  return pages[location.pathname] || <HomePage />;
}

function PublicLandingApp() {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname,
    search: window.location.search,
  }));

  useEffect(() => {
    const updateLocation = () => setLocation({
      pathname: window.location.pathname,
      search: window.location.search,
    });
    window.addEventListener("popstate", updateLocation);
    return () => window.removeEventListener("popstate", updateLocation);
  }, []);

  return (
    <div data-api-base={API_BASE_URL}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header pathname={location.pathname} />
      <SiteRoutes location={location} />
      <Footer />
    </div>
  );
}

function ExternalRedirect({ to, label }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <main id="main"><p>Opening {label}… <a href={to}>Continue</a></p></main>;
}

export default function App() {
  const pathname = window.location.pathname;

  if (pathname === "/sign-in") {
    return <ExternalRedirect to={CLIENT_AUTH_URL} label="the UK Courier client login" />;
  }

  if (pathname === "/dashboard" || pathname === "/app" || pathname.startsWith("/app/")) {
    return <ExternalRedirect to={CLIENT_APP_URL} label="the UK Courier client panel" />;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <ExternalRedirect to={ADMIN_AUTH_URL} label="the admin panel" />;
  }

  return <PublicLandingApp />;
}
