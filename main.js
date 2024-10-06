
function main() {
  const markedAsFixedKey = "disney-fixed";
  const expectedNumberOfFixedKeyElements = 3; // can't count shadowRoot buttons
  
  const getShadowRootButton = (body, selector) => {
    return body.querySelector(selector)?.shadowRoot?.querySelector("info-tooltip button");
  }

  const buttonsToOverride = [
    (body) => body.querySelector("button.mute-btn"),
    (body) => body.querySelector("button.play-from-start-icon"),
    (body) => body.querySelector(".audio-subtitles-control > button.control-icon-btn"),
    (body) => getShadowRootButton(body, "quick-rewind"),
    (body) => getShadowRootButton(body, "toggle-play-pause"),
    (body) => getShadowRootButton(body, "quick-fast-forward"),
    (body) => getShadowRootButton(body, "toggle-fullscreen-button"),
  ];

  const fixDisneyPlayerUX = () => {
    buttonsToOverride.forEach(getButton => {
      const element = getButton(document.body);
      if (element == null) {
        return;
      }

      element.addEventListener("keydown", e => {
        if (e.code === "Space") {
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);

      element.addEventListener("keypress", e => {
        if (e.code === "Space") {
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);

      element.addEventListener("keyup", e => {
        if (e.code === "Space") {
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
          getShadowRootButton(document.body, "toggle-play-pause")?.click();
        }
      }, true);

      element.setAttribute(markedAsFixedKey, true);
    });
  }

  setInterval(() => {
    const fixedDomElements = document.body.querySelectorAll(`[${markedAsFixedKey}="true"]`).length;
    if (fixedDomElements !== expectedNumberOfFixedKeyElements) {
      fixDisneyPlayerUX();
      document.body.querySelector("disney-web-player")
        ?.querySelector("video")
        ?.style
        ?.setProperty("outline", "0", "important");
    }
  }, 1000);
}

chrome.webNavigation.onCompleted.addListener((details) => {
  if (!details.url.includes('chrome://')) {
    if (details.frameId === 0) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        function: main
      });
    };
  }
});