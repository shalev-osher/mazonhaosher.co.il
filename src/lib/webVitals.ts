import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

type GtagFn = (...args: unknown[]) => void;

const sendToAnalytics = (metric: Metric) => {
  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof gtag === "function") {
    gtag("event", metric.name, {
      event_category: "Web Vitals",
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }

  if (import.meta.env.DEV) {
    // Lightweight dev visibility
    console.info(`[web-vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }
};

export const initWebVitals = () => {
  try {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch {
    // no-op
  }
};
