
const WITH_AUDIBLE_ENDING_E = [
  "be",
  "he",
  "me",
  "the",
  "we",
];

function isCaps(match) {
  return /[A-Z]/.test(match);
}

function isSilent(match, offset, source) {
  if (offset === 0 || source.length === 1) {
    return false;
  }

  const isRepeating = new RegExp(`${match}`, "i").test(source[offset - 1]);

  const isOneSound =
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

  return isRepeating || endsWithE || endsWithES || isOneSound;
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




/**
 * 
 * @param {string} text 
 */
function translateV2(text) {
  const visited = {};

  function visit(wordIndex, match, offset) {
    if (!visited[wordIndex]) {
      visited[wordIndex] = [];
    }
    visited[wordIndex].push({
      start: offset,
      end: offset + match.length,
      repaced: false,
    });
  }

  function isVisited(wordIndex, offset) {
    return visited[wordIndex] && visited[wordIndex].some(
      (x) => x.start <= offset && x.end >= offset
    );
  }

  function isSilentE(match, offset, source) {
    return (
      offset >= source.length - 2 &&
      /es?$/i.test(source) &&
      !WITH_AUDIBLE_ENDING_E.includes(source)
    );
  }

  function firstReplacer(word, wordIndex) {
    const processed = word.replace(
      /ou|ee|ea|ay|ey|oo|io|oi|oy|oa|ui|ua/ig,
      (match, offset, _source) => {
        visit(wordIndex, match, offset);

        console.log("[firstReplacer]", match, offset)

        return `${isCaps(match[0]) ? "A" : "a"}rp${match}`;
      }
    );

    if (visited[wordIndex]) {
      visited[wordIndex].forEach((item) => {
        item.end += 3;
      });
    }

    return processed;
  }

  function secondReplacer(word, wordIndex) {
    return word.replace(/[aeiou]|y$/ig, (match, offset, source) => {
          
      console.log("[second round]", match, offset, source);
      if (isVisited(wordIndex, offset)) {
        return match;
      }

      visit(wordIndex, match, offset);

      if (isSilentE(match, offset, source)) {
        return match;
      }

      return `${isCaps(match) ? "A" : "a"}rp${match}`;
    });
  }

  function processWord(word, wordIndex, ...fns) {
    return fns.reduce((accum, fn) => fn(accum, wordIndex), word.trim());
  }

  return text
    .split(" ")
    .map((word, wordIndex) => processWord(
      word,
      wordIndex,
      firstReplacer,
      secondReplacer
    ))
    .join(" ");
}

export { translate, translateV2 };
