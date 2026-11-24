// Bangla Typing — UI logic. Uses BanglaPhonetic.transliterate from transliterate.js.
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  // ---- Tabs ----
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      $('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // ---- Phonetic ----
  var romanInput = $('romanInput');
  var banglaOutput = $('banglaOutput');
  var digitToggle = $('digitToggle');
  var countInfo = $('countInfo');
  var copyMsg = $('copyMsg');

  function bnNum(n) {
    return String(n).replace(/[0-9]/g, function (d) { return '০১২৩৪৫৬৭৮৯'[+d]; });
  }

  function updateOutput() {
    var out = BanglaPhonetic.transliterate(romanInput.value, { bengaliDigits: digitToggle.checked });
    banglaOutput.value = out;
    var words = out.trim() ? out.trim().split(/\s+/).length : 0;
    countInfo.textContent = bnNum(out.length) + ' অক্ষর • ' + bnNum(words) + ' শব্দ';
  }

  romanInput.addEventListener('input', updateOutput);
  digitToggle.addEventListener('change', updateOutput);

  $('btnSample').addEventListener('click', function () {
    romanInput.value = 'ami banglay likhte pari. amar sonar bangla, ami tomake bhalobashi.';
    updateOutput();
    romanInput.focus();
  });
  $('btnClear').addEventListener('click', function () {
    romanInput.value = '';
    updateOutput();
    romanInput.focus();
  });

  function copyText(text, msgEl, okMsg) {
    if (!text) { msgEl.textContent = 'কপি করার মতো লেখা নেই।'; return; }
    var done = function () { msgEl.textContent = okMsg; setTimeout(function () { msgEl.textContent = ''; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text); done();
    }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function downloadText(text, filename) {
    if (!text) return;
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 100);
  }

  $('btnCopy').addEventListener('click', function () {
    copyText(banglaOutput.value, copyMsg, 'কপি হয়েছে! ✅');
  });
  $('btnDownload').addEventListener('click', function () {
    downloadText(banglaOutput.value, 'bangla-typing.txt');
  });

  // ---- Keyboard ----
  var kbOutput = $('kbOutput');
  var kbCount = $('kbCount');
  var rows = [
    ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'],
    ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ট', 'ঠ'],
    ['ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম'],
    ['য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ড়', 'ঢ়', 'য়', '্'],
    ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', 'ং', 'ঃ', 'ঁ'],
    ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  ];
  var kb = $('keyboard');
  rows.forEach(function (row) {
    var div = document.createElement('div');
    div.className = 'kb-row';
    row.forEach(function (ch) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'key';
      b.textContent = ch;
      b.addEventListener('click', function () { insertAtCaret(kbOutput, ch); });
      div.appendChild(b);
    });
    kb.appendChild(div);
  });
  var ctrlRow = document.createElement('div');
  ctrlRow.className = 'kb-row';
  [['স্পেস', ' '], ['ব্যাকস্পেস', 'BACK'], ['নতুন লাইন', '\n']].forEach(function (pair) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'key wide';
    b.textContent = pair[0];
    b.addEventListener('click', function () {
      if (pair[1] === 'BACK') {
        var s = kbOutput.selectionStart, e = kbOutput.selectionEnd;
        if (s === e && s > 0) { kbOutput.value = kbOutput.value.slice(0, s - 1) + kbOutput.value.slice(e); kbOutput.selectionStart = kbOutput.selectionEnd = s - 1; }
        else if (s !== e) { kbOutput.value = kbOutput.value.slice(0, s) + kbOutput.value.slice(e); kbOutput.selectionStart = kbOutput.selectionEnd = s; }
      } else {
        insertAtCaret(kbOutput, pair[1]);
      }
      updateKbCount();
      kbOutput.focus();
    });
    ctrlRow.appendChild(b);
  });
  kb.appendChild(ctrlRow);

  function insertAtCaret(ta, text) {
    var s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.focus();
    updateKbCount();
  }

  function updateKbCount() {
    kbCount.textContent = bnNum(kbOutput.value.length) + ' অক্ষর';
  }
  kbOutput.addEventListener('input', updateKbCount);

  $('kbClear').addEventListener('click', function () {
    kbOutput.value = '';
    updateKbCount();
    kbOutput.focus();
  });
  $('kbCopy').addEventListener('click', function () {
    copyText(kbOutput.value, copyMsg, 'কপি হয়েছে! ✅');
  });
  $('kbDownload').addEventListener('click', function () {
    downloadText(kbOutput.value, 'bangla-typing.txt');
  });

  updateOutput();
})();
