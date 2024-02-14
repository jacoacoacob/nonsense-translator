
/**
 * 
 * @param {HTMLElement} target 
 * @param {string} text 
 */
function renderText(target, text) {
  target.textContent = text;
}

/**
 * 
 * @param {HTMLElement} target 
 * @param {import("./translate-arp").Node[][][]} paragraphs 
 */
function renderNodes(target, paragraphs) {
  // Clear previously rendered children
  while (target.lastChild) {
    target.removeChild(target.lastChild);
  }

  paragraphs.forEach((paragraph) => {
    const p = document.createElement("div");
    paragraph.forEach((word) => {
      const wordSpan = document.createElement("span");
      word.forEach((node) => {
        const span = document.createElement("span");
        span.classList.add("node", `node--${node.kind}`);
        span.textContent = node.value;
        wordSpan.appendChild(span);
      });
      p.append(wordSpan);
      const spacer = document.createElement("span");
      spacer.style.paddingRight = "8px";
      p.append(spacer);
    });
    target.appendChild(p);
  });
}

export { renderText, renderNodes };
