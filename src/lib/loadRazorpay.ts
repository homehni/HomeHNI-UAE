// Dynamically loads Razorpay Checkout script once and returns window.Razorpay
let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) return resolve();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });
  
  return scriptPromise;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
