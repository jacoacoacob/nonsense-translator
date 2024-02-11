import * as arpLang from "./arp-lang.js";

const contentWrapper = document.querySelector("#content-wrapper");
const ta = document.querySelector("#input");
const inputCard = document.querySelector("#input-card");
const outputCard = document.querySelector("#output-card");
const output = document.querySelector("#output");
const selectTranslateFn = document.querySelector("#select-translate-fn");

ta.focus();
autoSizeElementHeight(ta);
autoSizeElementHeight(contentWrapper);
doTranslation(ta.value);

ta.addEventListener("input", (ev) => {
  autoSizeElementHeight(ta);
  autoSizeElementHeight(contentWrapper);
  doTranslation(ev.target.value);
});

// inputCard.addEventListener("click", (_ev) => {
//   ta.focus();
// });

selectTranslateFn.addEventListener("change", onChangeSelectTranslateFn);

function doTranslation(text) {
  if (selectTranslateFn.value === "v2") {
    const arp = arpLang.translateV2(text);
    output.textContent = arp;
  }
  if (selectTranslateFn.value === "v1") {
    const arp = arpLang.translate(text);
    output.textContent = arp;
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

function onChangeSelectTranslateFn(ev) {
  doTranslation(ta.value);
} 