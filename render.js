
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

  console.log(paragraphs)

  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    paragraph.forEach((word) => {
      word.forEach((node) => {
        const span = document.createElement("span");
        span.classList.add("node", `node--${node.kind}`);
        span.textContent = node.value;
        p.appendChild(span);
      });
      const spacer = document.createElement("span");
      spacer.style.marginRight = "8px";
      p.appendChild(spacer);
    });
    target.appendChild(p);
  });
}

export { renderText, renderNodes };
