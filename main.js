import * as arpLang from "./arp-lang.js";

const contentWrapper = document.querySelector("#content-wrapper");
const ta = document.querySelector("#input");
const cardInput = document.querySelector("#input-card");
const cardOutput = document.querySelector("#output-card");

ta.focus();
autoSizeElementHeight(ta);
autoSizeElementHeight(contentWrapper);

ta.addEventListener("input", (ev) => {
  autoSizeElementHeight(ta);
  autoSizeElementHeight(contentWrapper);

  const arp = arpLang.translate(ev.target.value);
  cardOutput.textContent = arp;
});

/**
 * 
 * @param {HTMLElement} el 
 * @param {number} minHeight 
 */
function autoSizeElementHeight(el, minHeight = 0) {
  el.style.height = 0;
  el.style.height = Math.max(el.scrollHeight, minHeight) + 10 + "px";
}
