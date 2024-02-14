import {
  translateArpV1,
  translateArpV2,
  translateArpV3
} from "./translate-arp.js";
import { renderNodes, renderText } from "./render.js";
import { loadSettings, saveSettings } from "./settings.js";

const contentWrapper = document.querySelector("#content-wrapper");
const input = document.querySelector("#input");
const inputCard = document.querySelector("#input-card");
const outputCard = document.querySelector("#output-card");
const output = document.querySelector("#output");
const divV3Controls = document.querySelector("#v3-controls");
const enableHighlightArps = document.querySelector("#enable-highlight-arps");
const arpVersion = document.querySelector("#select-arp-version");


initSettings();

input.focus();
translateAndRender(input.value);
autoSizeElementHeight(input);
autoSizeElementHeight(output);
onChangeArpVersion();
onChangeEnableHighlightArps();

input.addEventListener("input", (ev) => {
  translateAndRender(ev.target.value);
  autoSizeElementHeight(input);
  autoSizeElementHeight(output);
});

arpVersion.addEventListener("change", onChangeArpVersion);

enableHighlightArps.addEventListener("change", onChangeEnableHighlightArps);

function translateAndRender(text) {
  switch (arpVersion.value) {
    case "v1": return renderText(output, translateArpV1(text));
    case "v2": return renderText(output, translateArpV2(text));
    case "v3": return renderNodes(output, translateArpV3(text));
  }
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {number} minHeight 
 */
function autoSizeElementHeight(el, minHeight = 0) {
  el.style.height = 0;
  el.style.height = Math.max(el.scrollHeight, minHeight) + 10 + "px";
}

function onChangeArpVersion() {
  divV3Controls.style.display = arpVersion.value === "v3" ? "block" : "none";
  translateAndRender(input.value);
  saveSettings({
    arpVersion: arpVersion.value,
  });
}

function onChangeEnableHighlightArps() {
  if (enableHighlightArps.checked) {
    output.classList.add("enable-highlight-arps");
  }
  else {
    output.classList.remove("enable-highlight-arps");
  }
  saveSettings({
    enableHighlightArps: enableHighlightArps.checked
  });
}

function initSettings() {
  const settings = loadSettings();
  arpVersion.value = settings.arpVersion || "v3";
  enableHighlightArps.checked = settings.enableHighlightArps || false;
}

