import { useEffect } from "react";
import { API_BASE_URL } from "./config.js";

async function trackShipment(reference) {
  const response = await fetch(`${API_BASE_URL}/api/tracking/${encodeURIComponent(reference)}`, {
    headers: { Accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Shipment status could not be loaded.");
  }
  return payload.data || payload;
}

export function usePageInteractions(location, navigate) {
  useEffect(() => {
    const cleanups = [];
    const listen = (element, event, handler) => {
      if (!element) return;
      element.addEventListener(event, handler);
      cleanups.push(() => element.removeEventListener(event, handler));
    };

    document.querySelectorAll('input[inputmode="numeric"]').forEach((input) => {
      const sanitize = () => {
        input.value = input.value.replace(/\D/g, "").slice(0, input.maxLength || 6);
      };
      listen(input, "input", sanitize);
    });

    const validRouteCode = (value) => /^[A-Z0-9][A-Z0-9 -]{1,11}$/i.test(String(value || "").trim());

    document.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector("button");
      listen(button, "click", () => {
        const willOpen = !item.classList.contains("is-open");
        document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
          openItem.classList.remove("is-open");
          openItem.querySelector("button")?.setAttribute("aria-expanded", "false");
        });
        item.classList.toggle("is-open", willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
      });
    });

    const homeRateForm = document.querySelector("#home-rate-form");
    listen(homeRateForm, "submit", (event) => {
      event.preventDefault();
      const pickup = document.querySelector("#home-pickup-pin")?.value.trim() || "";
      const delivery = document.querySelector("#home-delivery-pin")?.value.trim() || "";
      const error = document.querySelector("#home-rate-error");
      if (!validRouteCode(pickup) || !validRouteCode(delivery)) {
        error.textContent = "Please enter valid origin and destination codes.";
        return;
      }
      error.textContent = "";
      navigate(`/rate-calculator?pickup=${encodeURIComponent(pickup)}&delivery=${encodeURIComponent(delivery)}`);
    });

    const rateForm = document.querySelector("#rate-form");
    if (rateForm) {
      const pickupInput = document.querySelector("#pickup-pin");
      const deliveryInput = document.querySelector("#delivery-pin");
      const query = new URLSearchParams(location.search);
      const queryPickup = query.get("pickup") || "";
      const queryDelivery = query.get("delivery") || "";
      if (validRouteCode(queryPickup)) pickupInput.value = queryPickup.toUpperCase();
      if (validRouteCode(queryDelivery)) deliveryInput.value = queryDelivery.toUpperCase();

      listen(rateForm, "submit", (event) => {
        event.preventDefault();
        const pickup = pickupInput.value.trim();
        const delivery = deliveryInput.value.trim();
        const weight = Number(document.querySelector("#weight").value);
        const speed = document.querySelector("#speed").value;
        const rateError = document.querySelector("#rate-error");
        const rateResult = document.querySelector("#rate-result");
        rateError.textContent = "";
        rateResult.classList.remove("is-visible");
        if (!validRouteCode(pickup) || !validRouteCode(delivery)) {
          rateError.textContent = "Please enter valid origin and destination codes.";
          return;
        }

        const origin = pickup.toUpperCase();
        const destination = delivery.toUpperCase();
        const sameZone = origin.slice(0, 2) === destination.slice(0, 2);
        const sameRegion = origin[0] === destination[0];
        const routeBase = sameZone ? 18 : sameRegion ? 28 : 42;
        const weightCharge = Math.ceil(weight * (sameZone ? 6 : 9));
        const estimate = Math.round((routeBase + weightCharge) * (speed === "express" ? 1.48 : 1));
        const lower = Math.max(12, Math.round(estimate));
        const upper = Math.round(estimate * 1.28);

        document.querySelector("#rate-value").textContent = `$${lower}–$${upper}`;
        document.querySelector("#rate-route").textContent = `${origin} → ${destination} · ${weight} kg · ${speed === "express" ? "Express" : "Standard"}`;
        const message = `Hello UK Courier,\nPlease confirm an international rate for ${origin} to ${destination}, ${weight} kg, ${speed}. Website estimate: $${lower}–$${upper}`;
        document.querySelector("#rate-whatsapp").href = `mailto:support@ukcourier.global?subject=International shipping rate&body=${encodeURIComponent(message)}`;
        rateResult.classList.add("is-visible");
      });
    }

    const trackingForm = document.querySelector("#tracking-form");
    if (trackingForm) {
      const input = document.querySelector("#tracking-id");
      const error = document.querySelector("#tracking-error");
      const panel = document.querySelector("#tracking-panel");
      const showTracking = (shipment) => {
        document.querySelector("#shown-tracking-id").textContent = shipment.id;
        const status = document.querySelector("#tracking-status");
        const update = document.querySelector("#tracking-current-update");
        const note = document.querySelector("#tracking-note");
        if (status) status.textContent = shipment.status;
        if (update) update.textContent = shipment.status;
        if (note) note.textContent = shipment.destination ? `Latest destination: ${shipment.destination}` : "Latest status received from UK Courier operations.";
        const stageByStatus = { "Pickup scheduled": 0, "In transit": 2, "Out for delivery": 2, Delivered: 3, Exception: 2, RTO: 2 };
        const activeStage = stageByStatus[shipment.status] ?? 0;
        document.querySelectorAll("#tracking-panel .tracking-steps li").forEach((step, index) => {
          step.classList.toggle("done", index < activeStage || shipment.status === "Delivered");
          step.classList.toggle("active", index === activeStage && shipment.status !== "Delivered");
        });
        error.textContent = "";
        panel.classList.remove("flash");
        void panel.offsetWidth;
        panel.classList.add("flash");
        panel.scrollIntoView({ behavior: "smooth", block: "center" });
      };
      listen(trackingForm, "submit", async (event) => {
        event.preventDefault();
        const reference = input.value.trim().toUpperCase();
        if (!/^UKC[-\s]?[A-Z0-9]{6,20}$/.test(reference)) {
          error.textContent = "Enter a valid UK Courier shipment reference.";
          return;
        }
        error.textContent = "Checking live shipment status…";
        try {
          showTracking(await trackShipment(reference.replace(/\s/g, "-")));
        } catch (requestError) {
          error.textContent = requestError.message || "Shipment status could not be loaded.";
        }
      });
    }

    const weightForm = document.querySelector("#weight-form");
    listen(weightForm, "submit", (event) => {
      event.preventDefault();
      const actual = Number(document.querySelector("#actual-weight")?.value);
      const length = Number(document.querySelector("#parcel-length")?.value);
      const width = Number(document.querySelector("#parcel-width")?.value);
      const height = Number(document.querySelector("#parcel-height")?.value);
      const divisor = Number(document.querySelector("#weight-divisor")?.value);
      const error = document.querySelector("#weight-error");
      const result = document.querySelector("#weight-result");

      error.textContent = "";
      result.classList.remove("is-visible");
      if (![actual, length, width, height, divisor].every((value) => Number.isFinite(value) && value > 0)) {
        error.textContent = "Please enter valid weight and parcel dimensions.";
        return;
      }

      const volumetric = (length * width * height) / divisor;
      const chargeable = Math.max(actual, volumetric);
      document.querySelector("#actual-result").textContent = `${actual.toFixed(2)} kg`;
      document.querySelector("#volumetric-result").textContent = `${volumetric.toFixed(2)} kg`;
      document.querySelector("#chargeable-result").textContent = `${chargeable.toFixed(2)} kg`;
      result.classList.add("is-visible");
    });

    const contactForm = document.querySelector("#contact-form");
    listen(contactForm, "submit", (event) => {
      event.preventDefault();
      const name = document.querySelector("#contact-name")?.value.trim();
      const phone = document.querySelector("#contact-phone")?.value.trim();
      const details = document.querySelector("#contact-message")?.value.trim();
      const error = document.querySelector("#contact-error");
      if (!name || !phone || !details) {
        error.textContent = "Please complete all three fields.";
        return;
      }
      error.textContent = "";
      const message = `Hello UK Courier,\nName: ${name}\nPhone: ${phone}\nShipment details: ${details}`;
      window.open(`mailto:support@ukcourier.global?subject=Shipment enquiry&body=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [location.pathname, location.search, navigate]);
}
