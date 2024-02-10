
const WITH_AUDIBLE_ENDING_E = [
  "me", "be", "the"
];

function isCaps(match) {
  return /[A-Z]/.test(match);
}

function isSilent(match, offset, source) {
  if (offset === 0 || source.length === 1) {
    return false;
  }

  const isRepeating = new RegExp(`${match}`, "i").test(source[offset - 1]);

  const isAAfterE =
    offset > 0 &&
    /a/i.test(match) &&
    /e/i.test(source[offset - 1]);

  const endsWithE =
    offset + 1 === source.length &&
    /e/i.test(match) &&
    !WITH_AUDIBLE_ENDING_E.includes(source);

  const endsWithES =
    offset + 2 === source.length &&
    /e/i.test(match) &&
    /s/i.test(source[offset + 1])

  return isRepeating || endsWithE || endsWithES || isAAfterE;
}

/**
 * 
 * @param {string} text 
 */
function translate(text) {
  return text
    .split(" ")
    .map((word) =>
      word.trim().replace(/[aeiouy]/ig, (match, offset, source) => {
        if (isSilent(match, offset, source)) {
          return match;
        }

        return `${isCaps(match) ? "A" : "a"}rp${match}`;
      })
    )
    .join(" ");
}

export { translate };
