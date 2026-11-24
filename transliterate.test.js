// Tests for transliterate.js. Expected strings use \u09cd (hasant) and
// \u09df (য়) explicitly where needed, so a missing conjunct fails loudly.
const { transliterate: t } = require('./transliterate.js');
const H = '\u09cd'; // hasant
const Y = '\u09df'; // য়

const cases = [
  ['ami', 'আমি'],
  ['bangla', 'বাংলা'],
  ['tumi kemon acho', 'তুমি কেমন আছো'],
  ['ami bhalo achi', 'আমি ভালো আছি'],
  ['dhonnobad', 'ধ' + 'ন' + H + 'নবাদ'], // scheme: o before n+n is dropped; ধন্যবাদ is dhonyobad
  ['dhonyobad', 'ধ' + 'ন' + H + 'যবাদ'],
  ['amar sonar bangla', 'আমার সোনার বাংলা'],
  ['kotha', 'কথা'],
  ['shikkha', 'শি' + 'ক' + H + 'ষা'],
  ['kormo', 'ক' + 'র' + H + 'ম'],
  ['bhoy', 'ভ' + Y],
  ['song', 'সং'],
  ['ami banglay likhte pari', 'আমি বাংলা' + Y + ' লি' + 'খ' + H + 'তে পারি'],
  ['tomar', 'তোমার'],
  ['tOmar', 'তোমার'],
  ['tOmake', 'তোমাকে'],
  ['tomake', 'তোমাকে'],
  ['hobe', 'হবে'],
  ['shobdo', 'শ' + 'ব' + H + 'দ'],
  ['koro', 'করো'],
  ['kor', 'কর'],
  ['dhormo', 'ধ' + 'র' + H + 'ম'],
  ['amra', 'আ' + 'ম' + H + 'রা'],
  ['asobo', 'আসবো'],
  ['kotha bolo', 'কথা বলো'],
  ['bhalobashi', 'ভালবাশি'],
  ['bhalObashi', 'ভালোবাশি'],
  ['bhalobasi', 'ভালবাসি'],
  ['bhalObasi', 'ভালোবাসি'],
  ['rakkha', 'রা' + 'ক' + H + 'ষা'],
  ['rkkha', 'র' + 'ক' + H + 'ষা'],
  ['anondo', 'আন' + 'ন' + H + 'দ'],
  ['sonar', 'সোনার'],
  ['shona', 'শোনা'],
  ['kono', 'কোনো'],
  ['shono', 'শোনো'],
  ['mone', 'মনে'],
  ['kemon', 'কেমন'],
  ['priyo', 'প' + H + 'রি' + Y],
  ['jayo', 'জা' + Y],
  ['yao', 'যাও'],
  ['khao', 'খাও'],
  ['krishna', 'ক' + H + 'রিশ' + H + 'না'],
  ['krrishna', 'কৃশ' + H + 'না'],
  ['krriShna', 'কৃ' + 'ষ' + H + 'না'],
  ['krriShNa', 'কৃ' + 'ষ' + H + 'ণা'],
  ['songshar', 'সংশার'],
  ['songsar', 'সংসার'],
  ['shongshar', 'শংশার'],
  ['ongko', 'অ' + 'ঙ' + H + 'ক'],
  ['shomman', 'শ' + 'ম' + H + 'মান'],
  ['tomra', 'তোমরা'],
  ['chamRa', 'ছা' + 'ম' + '\u09dc' + 'া'],
  ['camRa', 'চা' + 'ম' + '\u09dc' + 'া'],
  ['shomoy', 'শো' + 'ম' + Y],
  ['ami tomake bhalObasi', 'আমি তোমাকে ভালোবাসি'],
];

let fail = 0;
for (const [inp, exp] of cases) {
  const got = t(inp);
  const ok = got === exp;
  if (!ok) fail++;
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + JSON.stringify(inp) + ' -> ' + got + (ok ? '' : ' (expected ' + exp + ')'));
}
console.log(fail === 0 ? 'ALL PASS (' + cases.length + ' cases)' : fail + ' FAILURES');
process.exit(fail === 0 ? 0 : 1);
