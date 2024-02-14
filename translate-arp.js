
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
function translateArpV1(text) {
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
function translateArpV2(text) {
  const visited = {};

  function visit(wordIndex, match, offset) {
    if (!visited[wordIndex]) {
      visited[wordIndex] = [];
    }
    visited[wordIndex].push({
      start: offset,
      end: offset + match.length,
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

  const arp = text
    .split(" ")
    .map((word, wordIndex) => processWord(
      word,
      wordIndex,
      firstReplacer,
      secondReplacer
    ))
    .join(" ");

  return arp;
}


/**
 * @typedef Node
 * @property {string} value
 * @property {"original" | "added"} kind
 */


/**
 * 
 * @param {string} text 
 * @returns {Node[]}
 */
function translateArpV3(text) {

  /**
   * 
   * @param {Match} match 
   */
  function isSilentE(match) {
    return (
      match.start >= match.source.length - 2 &&
      /es?$/i.test(match.source) &&
      !WITH_AUDIBLE_ENDING_E.includes(match.source)
    );
  }

  /**
   * @typedef Match
   * @property {string} source
   * @property {string} target
   * @property {number} start
   * @property {number} end
   */

  /**
   * 
   * @param {string} word 
   * @param {RegExp} regex
   * @returns {Match[]}
   */
  function getMatches(word, regex) {
    return Array.from(word.matchAll(regex)).map((match) => ({
      target: match[0],
      source: match.input,
      start: match.index,
      end: match.index + match[0].length
    }));
  }

  /**
   * 
   * @param {string} word 
   * @param {number} wordIndex
   */
  function parseWord(word, wordIndex) {
    const compoundVowels = getMatches(word, /ou|ee|ea|ay|ey|oo|io|oi(?!ng)|oy|oa|ui|ua/ig);
  
    compoundVowels.forEach((match) => visit(wordIndex, match));
    
    const singleVowels = getMatches(word, /[aeiou]|y$/ig).filter(
      (match) => !isVisited(wordIndex, match) && !isSilentE(match)
    );

    const matches = [...compoundVowels, ...singleVowels].sort(
      (a, b) => a.start - b.start
    );

    let cursor = 0;

    /** @type {Node[]} */
    const nodes = [];


    while (matches.length > 0 && cursor < word.length) {
      const match = matches.shift();

      nodes.push(
        {
          value: word.slice(cursor, match.start),
          kind: "original",
        },
        {
          value: isCaps(match.target) ? "Arp" : "arp",
          kind: "added",
        },
        {
          value: match.target,
          kind: "original",
        }
      );
      
      cursor = match.end;
    }

    if (cursor < word.length) {
      nodes.push({
        value: word.slice(cursor),
        kind: "original",
      });
    }

    return nodes;
  }

  const paragraphs = text.split("\n").map((line) => line.trim().split(" "));

  /** @type {Match[][]} */
  const visited = paragraphs.flatMap((paragraph) => paragraph.map(() => []));

  /**
   * 
   * @param {number} wordIndex 
   * @param {Match} match 
   */
  function isVisited(wordIndex, match) {
    return visited[wordIndex].some((m) => m.start <= match.start && m.end >= match.end);
  }

  function visit(wordIndex, match) {
    visited[wordIndex].push(match);
  }

  return paragraphs.map((paragraph) => paragraph.map((word, wordIndex) => parseWord(
    word,
    wordIndex,
  )));
}


export { translateArpV1, translateArpV2, translateArpV3 };
