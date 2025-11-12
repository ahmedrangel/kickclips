export default defineNuxtPlugin((nuxtApp) => {
  const adUnits = {
    banner1: "e85d2c29811af72e9a448098142c707c"
  };
  nuxtApp.hook("page:finish", () => {
    window.atOptions = { key: adUnits.banner1, format: "iframe", height: 60, width: 468, params: {} };
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//www.highperformanceformat.com/${adUnits.banner1}/invoke.js`;
    const adContainer = document.getElementById("ad-container");
    if (adContainer) {
      const adTextIndicator = document.createElement("div");
      adTextIndicator.style.fontSize = "10px";
      adTextIndicator.style.color = "#888";
      adTextIndicator.textContent = "Advertisement";
      adContainer.appendChild(script);
      script.onload = () => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of (mutation.addedNodes as NodeListOf<HTMLElement>)) {
              const element = node;
              if (element.tagName === "IFRAME") {
                adContainer.appendChild(adTextIndicator);
                observer.disconnect();
              }
            }
          }
        });
        observer.observe(adContainer, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
      };
    }
  });
});
