
const WITH_AUDIBLE_ENDING_E = [
  "me", "be"
];

function isCaps(match) {
  return /[A-Z]/.test(match);
}

function isSilent(match, offset, source) {
  if (source.length === 1) {
    return false;
  }

  const isRepeating = new RegExp(`${match}`, "i").test(source[offset - 1]);

  const isAAfterE =
    /a/i.test(match) &&
    offset > 0 &&
    /e/i.test(source[offset - 1]);

  const isSilentE =
    /e/i.test(match) &&
    offset + 1 === source.length &&
    !WITH_AUDIBLE_ENDING_E.includes(source);

  return isRepeating || isSilentE || isAAfterE;
}

/**
 * 
 * @param {string} text 
 */
function translate(text) {
  return text
    .split(" ")
    .map((word) =>
      word.trim().replace(/[aeiou]/ig, (match, offset, source) => {
        if (isSilent(match, offset, source)) {
          return match;
        }

        return `${isCaps(match) ? "A" : "a"}rp${match}`;
      })
    )
    .join(" ");
}

export { translate };
