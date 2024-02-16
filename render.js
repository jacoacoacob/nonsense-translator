
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
    const div = document.createElement("div");
    paragraph.forEach((word) => {
      const wordSpan = document.createElement("span");
      word.forEach((node) => {
        const span = document.createElement("span");
        span.classList.add(`node--${node.kind}`);
        span.textContent = node.value;
        wordSpan.appendChild(span);
      });
      div.append(wordSpan);
      const spacer = document.createElement("span");
      spacer.style.paddingRight = "8px";
      div.append(spacer);
    });
    target.appendChild(div);
  });
}

export { renderText, renderNodes };
