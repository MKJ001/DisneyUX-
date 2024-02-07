
function main() {
  const buttonsToOverride = [
    "button.rwd-10sec-icon",
    "button.ff-10sec-icon",
    "button.fullscreen-icon",
    "button.exit-fullscreen-icon",
    "button.play-pause-icon",
    "button.mute-btn",
    ".audio-subtitles-control > button.control-icon-btn"
  ];
  const markedAsFixedKey = "disney-fixed";

  const fixDisneyPlayerUX = () => {
    buttonsToOverride.forEach(buttonClass => {
      const element = document.body.querySelector(`${buttonClass}`);
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
          document.body.querySelector("button.play-pause-icon").click();
        }
      }, true);

      element.setAttribute(markedAsFixedKey, true);
    });
  }

  setInterval(() => {
    const fixedDomElements = document.body.querySelectorAll(`[${markedAsFixedKey}="true"]`).length;
    const expectedNumberOfElements = buttonsToOverride.length - 1; // (minus 1 due to fullscreen has 2 variants)
    if (fixedDomElements !== expectedNumberOfElements) {
      fixDisneyPlayerUX();
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