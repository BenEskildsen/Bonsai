const {config} = require('./config');

const initGrid = (width, height, initial) => {
  const grid = [];
  for (let x = 0; x < width; x++) {
    const row = [];
    for (let y = 0; y < height; y++) {
      row.push(initial);
    }
    grid.push(row);
  }
  return grid;
}

const getParenLevel = (grammar, index) => {
  let numOpens = 0;
  for (let i = 0; i < index; i++) {
    if (grammar[i] == '[') numOpens++;
    if (grammar[i] == ']') numOpens--;
  }
  return numOpens;
}

const getNextDir = (grammar, index) => {
  if (index >= grammar.length - 1) return [];
  if (grammar[index + 1] == '^') return ['UP'];
  if (grammar[index + 1] == 'V') return ['DOWN'];
  if (grammar[index + 1] == '<') return ['LEFT'];
  if (grammar[index + 1] == '>') return ['RIGHT'];
  if (grammar[index + 1] == ']') return [];
  // HACK: we've hardcoded how the branching works
  if (grammar[index + 1] == '[') return ['LEFT', 'RIGHT'];
  return [];
}

const getPrevSymbol = (grammar, index) => {
  for (let i = index - 1; i >= 0; i--) {
    const s = grammar[i];
    if (s == '[') return null;
    if (config.symbols[s] != null) {
      return {symbol: s, index: i};
    }
  }
  return null;
};

const encodeGrammar = (grammar) => {
  let encodedGrammar = '';
  for (let c of grammar) {
    if (c == '^') {
      encodedGrammar += 'Z';
    } else if (c == '>') {
      encodedGrammar += 'Y';
    } else if (c == '<') {
      encodedGrammar += 'X';
    } else if (c == '[') {
      encodedGrammar += 'W';
    } else if (c == ']') {
      encodedGrammar += 'U';
    } else {
      encodedGrammar += c;
    }
  }
  return encodedGrammar;
}

const isControlChar = (c, parensCount) => {
  if (c == '^') return true;
  if (c == 'V') return true;
  if (c == '<') return true;
  if (c == '>') return true;
  if (c == ']') return parensCount;
  if (c == '[') return parensCount;
  return false;
}

// from the starting index (an open [), if there are no symbols inside
// that levels of brackets, then return the index of the matching close ]
const isEmptyParens = (grammar, index) => {
  let numOpens = 0;
  let symbolsSeen = 0;
  for (let i = index; i < grammar.length; i++) {
    if (!isControlChar(grammar[i], true)) return false;
    if (grammar[i] == '[') numOpens++;
    if (grammar[i] == ']') numOpens--;
    if (numOpens == 0) return i; // found matching close paren without seeing a symbol
  }
  // should be unreachable:
  return false;
}

const cleanupGrammar = (grammar) => {
  let nextGrammar = '';

  // remove empty parens
  let prevIndex = 0;
  for (let i = 0; i < grammar.length; i++) {
    if (grammar[i] == '[') {
      let endIndex = isEmptyParens(grammar, i);
      if (endIndex > 0) {
        nextGrammar += grammar.slice(prevIndex, i)
        prevIndex = endIndex + 1;
      }
    }
  }
  nextGrammar += grammar.slice(prevIndex);

  let finalGrammar = '';
  prevIndex = 0;
  // remove any parens ending with control chars
  for (let i = 0; i < nextGrammar.length; i++) {
    if (nextGrammar[i] == ']') {
      let j = i - 1;
      for (j; isControlChar(nextGrammar[j]); j--);
      finalGrammar += nextGrammar.slice(prevIndex, j + 1);
      prevIndex = i;
    }
  }
  finalGrammar += nextGrammar.slice(prevIndex);

  // remove trailing control chars
  while (finalGrammar.length >= 2 && isControlChar(finalGrammar[finalGrammar.length - 1])) {
    finalGrammar = finalGrammar.slice(0, finalGrammar.length - 1);
  }
  return finalGrammar;
}

window.cleanupGrammar = cleanupGrammar;

module.exports = {
  initGrid,
  getParenLevel,
  getNextDir,
  encodeGrammar,
  getPrevSymbol,
  cleanupGrammar,
  isControlChar,
};

