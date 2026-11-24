// Bangla Phonetic transliteration (Avro-style) — roman -> Bengali.
// Pure JavaScript, no dependencies. Works in the browser and in Node.
// Scheme (documented in README.md):
//   - Vowels: a=অ/আ i=ই I=ঈ u=উ U=ঊ rri=ঋ e=এ oi=ঐ o=অ/ও O=ও ou=ঔ
//   - Word-initial 'a' before a consonant is আ (ami = আমি, ar = আর);
//     a lone 'a' or 'a' before a vowel is অ.
//   - 'o' after a consonant is the inherent vowel অ: it is dropped, and it
//     also breaks a conjunct (asobo = আসবো, shobdo = শব্দ), except after
//     ম/ন when the next sound is আ/ও or র্ (tomar = তোমার, sonar = সোনার,
//     shona = শোনা, kono = কোনো, tomra = তোমরা; but mone = মনে, kemon = কেমন).
//     'o' at the end of a word after a plain consonant is ও (bhalo = ভালো,
//     koro = করো); after a joined consonant it is dropped (kormo = কর্ম);
//     after য় it is dropped (priyo = প্রিয়). Word-initial 'o' before a
//     consonant is অ (ongko = অঙ্ক). 'O' (capital) is always ও.
//   - Consonant + consonant joins with hasant (bangla = বাংলা, shikkha = শিক্ষা).
//   - 'kh' after a consonant is ষ (shikkha = শিক্ষা).
//   - 'ng' is ঙ only before the velars ক খ গ ঘ or before a vowel;
//     otherwise ং (বাংলা, সংসার, সং).
//   - 'r' after a consonant is ra-phala (amra = আমরা, priyo = প্রিয়);
//     'r' after a vowel and before a consonant is reph (kormo = কর্ম).
//     A plain 'r' at word start never joins (rkkha = রক্ষা).
//     'r'/'R' after a consonant that itself follows a vowel sign does NOT
//     join (tomra = তোমরা, chamRa = চামড়া) — use 'o' as a separator,
//     e.g. tomora = তোমরা.
//   - 'y' after a vowel is য় (bhoy = ভয়), otherwise য.
(function (root) {
  'use strict';

  var VOWELS = {
    'a':   { s: 'অ', k: 'া' },
    'A':   { s: 'আ', k: 'া' },
    'i':   { s: 'ই', k: 'ি' },
    'I':   { s: 'ঈ', k: 'ী' },
    'u':   { s: 'উ', k: 'ু' },
    'U':   { s: 'ঊ', k: 'ূ' },
    'rri': { s: 'ঋ', k: 'ৃ' },
    'e':   { s: 'এ', k: 'ে' },
    'oi':  { s: 'ঐ', k: 'ৈ' },
    'o':   { s: 'ও', k: 'ো' },
    'O':   { s: 'ও', k: 'ো' },
    'ou':  { s: 'ঔ', k: 'ৌ' }
  };

  var CONSONANTS = {
    'k': 'ক', 'kh': 'খ', 'g': 'গ', 'gh': 'ঘ', 'Ng': 'ঙ', 'ng': 'ঙ',
    'c': 'চ', 'ch': 'ছ', 'j': 'জ', 'jh': 'ঝ',
    'T': 'ট', 'Th': 'ঠ', 'D': 'ড', 'Dh': 'ঢ', 'N': 'ণ',
    't': 'ত', 'th': 'থ', 'd': 'দ', 'dh': 'ধ', 'n': 'ন',
    'p': 'প', 'ph': 'ফ', 'f': 'ফ', 'F': 'ফ', 'b': 'ব', 'bh': 'ভ', 'v': 'ভ',
    'm': 'ম', 'l': 'ল', 'sh': 'শ', 'Sh': 'ষ', 's': 'স', 'S': 'শ', 'h': 'হ',
    'R': 'ড়', 'Rh': 'ঢ়', 'z': 'য', 'q': 'ক', 'x': 'ক্স', 'w': 'ৱ'
  };

  var DIGITS = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  var YA = 'য়'; // U+09DF, single code point

  // Token list, longest first, for greedy matching.
  var TOKENS = Object.keys(VOWELS)
    .concat(Object.keys(CONSONANTS))
    .concat(['r', 'y', 'Y'])
    .sort(function (a, b) { return b.length - a.length; });

  function tokenize(text) {
    var tokens = [], i = 0;
    while (i < text.length) {
      var ch = text[i];
      if (/[0-9]/.test(ch)) { tokens.push({ t: 'digit', v: ch }); i++; continue; }
      if (/[a-zA-Z]/.test(ch)) {
        var matched = null;
        for (var k = 0; k < TOKENS.length; k++) {
          var tok = TOKENS[k];
          if (text.substr(i, tok.length) === tok) { matched = tok; break; }
        }
        if (matched) {
          var type = VOWELS.hasOwnProperty(matched) ? 'vowel'
            : CONSONANTS.hasOwnProperty(matched) ? 'cons' : 'special';
          tokens.push({ t: type, v: matched });
          i += matched.length;
          continue;
        }
        tokens.push({ t: 'other', v: ch }); i++; continue;
      }
      tokens.push({ t: 'sep', v: ch }); i++;
    }
    return tokens;
  }

  function isWordEnd(tokens, i) {
    return i + 1 >= tokens.length ||
      tokens[i + 1].t === 'sep' || tokens[i + 1].t === 'other';
  }

  function transliterate(input, opts) {
    opts = opts || {};
    var bengaliDigits = opts.bengaliDigits !== false;
    var tokens = tokenize(input);
    var out = '';
    var lastCons = false;       // last unit is a bare consonant (can take a kar)
    var lastJoinable = false;   // the next consonant may join it with hasant
    var lastJoined = false;     // that consonant was joined with hasant
    var lastConsAfterKar = false; // that consonant follows a vowel sign
    var pendingHasant = false;  // reph waiting for the next consonant
    var prevKar = false;        // the previous token produced a vowel sign

    function emitCons(ch) {
      var afterKar = prevKar;
      var joined = false;
      if (pendingHasant) {
        out += '্' + ch; pendingHasant = false; joined = true;
      } else if (lastJoinable) {
        if ((ch === 'ড়' || ch === 'ঢ়') && lastConsAfterKar) {
          out += ch; // no join after a kar-following consonant (চামড়া)
        } else {
          out += '্' + ch; joined = true;
        }
      } else {
        out += ch;
      }
      lastCons = true; lastJoinable = true; lastJoined = joined;
      lastConsAfterKar = afterKar;
      prevKar = false;
    }

    function clearState() {
      lastCons = false; lastJoinable = false; lastJoined = false;
      lastConsAfterKar = false; pendingHasant = false; prevKar = false;
    }

    for (var i = 0; i < tokens.length; i++) {
      var tk = tokens[i];

      if (tk.t === 'sep' || tk.t === 'other') {
        out += tk.v; clearState(); continue;
      }
      if (tk.t === 'digit') {
        out += bengaliDigits ? DIGITS[tk.v] : tk.v;
        clearState(); continue;
      }

      if (tk.t === 'vowel') {
        var madeKar = false;
        if (tk.v === 'a') {
          var prevTk = i > 0 ? tokens[i - 1] : null;
          var nextTk = i + 1 < tokens.length ? tokens[i + 1] : null;
          var atWordStart = !lastCons && (!prevTk || prevTk.t === 'sep' || prevTk.t === 'other');
          if (atWordStart && nextTk && (nextTk.t === 'cons' || nextTk.t === 'special')) {
            out += 'আ';
          } else if (lastCons) { out += 'া'; madeKar = true; }
          else { out += 'অ'; }
        } else if (tk.v === 'o') {
          if (lastCons) {
            if (isWordEnd(tokens, i)) {
              if (!lastJoined) { out += 'ো'; madeKar = true; }
            } else {
              var nt = tokens[i + 1];
              if (nt.t === 'cons' && (nt.v === 'm' || nt.v === 'n')) {
                var nnt = i + 2 < tokens.length ? tokens[i + 2] : null;
                var keepNext = nnt &&
                  ((nnt.t === 'vowel' && (nnt.v === 'a' || nnt.v === 'A' || nnt.v === 'o' ||
                    nnt.v === 'O' || nnt.v === 'ou')) ||
                   (nnt.t === 'special' && nnt.v === 'r'));
                if (keepNext) { out += 'ো'; madeKar = true; }
              }
            }
          } else if (isWordEnd(tokens, i) && out.charAt(out.length - 1) === YA) {
            // final 'o' after য় is the inherent vowel (priyo = প্রিয়)
          } else {
            var prevTkO = i > 0 ? tokens[i - 1] : null;
            var nextTkO = i + 1 < tokens.length ? tokens[i + 1] : null;
            var atStartO = !prevTkO || prevTkO.t === 'sep' || prevTkO.t === 'other';
            if (atStartO && nextTkO && (nextTkO.t === 'cons' || nextTkO.t === 'special')) {
              out += 'অ'; // ongko = অঙ্ক
            } else {
              out += 'ও';
            }
          }
        } else {
          var vw = VOWELS[tk.v];
          if (lastCons) { out += vw.k; madeKar = true; }
          else { out += vw.s; }
        }
        lastCons = false; lastJoinable = false; lastJoined = false;
        pendingHasant = false; prevKar = madeKar;
        continue;
      }

      if (tk.t === 'cons') {
        if (tk.v === 'ng') {
          var nx = i + 1 < tokens.length ? tokens[i + 1] : null;
          if (nx && ((nx.t === 'cons' && (nx.v === 'k' || nx.v === 'kh' || nx.v === 'g' || nx.v === 'gh')) ||
              nx.t === 'vowel')) {
            emitCons('ঙ');
          } else {
            out += 'ং'; clearState();
          }
          continue;
        }
        if (tk.v === 'kh' && lastCons) {
          emitCons('ষ'); // shikkha = শিক্ষা
          continue;
        }
        emitCons(CONSONANTS[tk.v]);
        continue;
      }

      // special: 'r', 'y', 'Y'
      if (tk.v === 'r') {
        if (lastCons && lastConsAfterKar) {
          out += 'র'; lastCons = true; lastJoinable = false; lastJoined = false; // tomra = তোমরা
        } else if (lastCons) {
          out += '্র'; lastCons = true; lastJoinable = true; lastJoined = true; // ra-phala
        } else if (i > 0 && tokens[i - 1].t === 'vowel' && i + 1 < tokens.length &&
            (tokens[i + 1].t === 'cons' || tokens[i + 1].t === 'special')) {
          out += 'র'; pendingHasant = true; lastCons = false; lastJoinable = false; lastJoined = false; // reph
        } else {
          out += 'র'; lastCons = true; lastJoinable = false; lastJoined = false; // plain r
        }
        lastConsAfterKar = false; prevKar = false;
        continue;
      }
      if (tk.v === 'y') {
        var prev = i > 0 ? tokens[i - 1] : null;
        if (prev && prev.t === 'vowel') {
          out += YA; clearState(); // y after a vowel
        } else {
          emitCons('য');
        }
        continue;
      }
      if (tk.v === 'Y') {
        out += YA; clearState();
        continue;
      }
    }
    return out;
  }

  // Node / browser export.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { transliterate: transliterate, tokenize: tokenize };
  } else {
    root.BanglaPhonetic = { transliterate: transliterate };
  }
})(typeof window !== 'undefined' ? window : globalThis);
