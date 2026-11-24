# বাংলা টাইপিং — Bangla Typing

Roman (ইংরেজি অক্ষরে) লিখে বাংলা পান — Avro-style phonetic transliteration, সাথে on-screen বাংলা কীবোর্ড। কোনো সার্ভার নেই, কোনো তথ্য সংগ্রহ হয় না। আপনার লেখা আপনার ব্রাউজারেই থাকে।

**Open source — MIT License.** সোর্স কোড সবার জন্য খোলা: দেখুন, বদলান, নিজের প্রজেক্টে ব্যবহার করুন।

## ব্যবহার

শুধু `index.html` ফাইলটা ব্রাউজারে খুলুন — আর কিছু লাগবে না। অথবা:

```bash
# যেকোনো static server দিয়ে, যেমন:
python3 -m http.server 8000
# তারপর http://localhost:8000 খুলুন
```

## ফিচার

- **ফোনেটিক টাইপিং** — Roman e লিখলেই লাইভ বাংলা: `ami banglay likhte pari` → `আমি বাংলায় লিখতে পারি`
- **On-screen কীবোর্ড** — স্বরবর্ণ, ব্যঞ্জনবর্ণ, কার-চিহ্ন, সংখ্যা
- **কপি / .txt ডাউনলোড** — লেখা কপি করুন বা ফাইল হিসেবে নামান
- **বাংলা সংখ্যা** — 2026 → ২০২৬ (বন্ধ করা যায়)
- **অক্ষর ও শব্দ গণনা**
- **সম্পূর্ণ offline** — একবার লোড হলে ইন্টারনেট ছাড়াই চলে (Google Fonts ছাড়া)

## লেখার নিয়ম (সংক্ষেপ)

| লিখুন | পাবেন | উদাহরণ |
|---|---|---|
| ami, tumi, kemon | আমি, তুমি, কেমন | ami bhalo achi → আমি ভালো আছি |
| a / A | অ / আ | ar = আর |
| o / O | অ / ও | kotha = কথা, tOmar = তোমার |
| kh, gh, ch, jh, th, dh, ph, bh | খ, ঘ, ছ, ঝ, থ, ধ, ফ, ভ | kotha = কথা |
| T, Th, D, Dh, N | ট, ঠ, ড, ঢ, ণ | Taka = টাকা |
| sh / Sh / s | শ / ষ / স | shikkha = শিক্ষা |
| ng | ঙ / ং | bangla = বাংলা, song = সং |
| r | র / ্র / র্ | amra = আমরা, kormo = কর্ম |
| y / Y | য / য় | bhoy = ভয়, priyo = প্রিয় |
| rri | ঋ / ৃ | krrishna = কৃশ্না |
| R / Rh | ড় / ঢ় | camRa = চামড়া |
| o মাঝখানে | যুক্ত ভাঙে | asobo = আসবো (আস্বো নয়) |

বিস্তারিত নিয়ম অ্যাপের **লেখার নিয়ম** ট্যাবে আছে।

## ফাইল

| ফাইল | কাজ |
|---|---|
| `index.html` | অ্যাপের পেজ |
| `styles.css` | ডিজাইন |
| `app.js` | UI লজিক (ট্যাব, কপি, ডাউনলোড, কীবোর্ড) |
| `transliterate.js` | ফোনেটিক ইঞ্জিন — কোনো dependency নেই |
| `transliterate.test.js` | ইঞ্জিনের টেস্ট (৫৬টা কেস) |

## টেস্ট

```bash
node transliterate.test.js
# ALL PASS (56 cases)
```

## কন্ট্রিবিউট

1. Fork করুন
2. নতুন branch এ বদল করুন (`git checkout -b fix/amar-bodol`)
3. টেস্ট চালান: `node transliterate.test.js`
4. Pull request পাঠান

নতুন শব্দের transliteration ঠিক না হলে test case সহ issue খুলুন — উদাহরণসহ জানাবেন কী লিখেছিলেন আর কী আশা করেছিলেন।

## লাইসেন্স

MIT License — দেখুন [LICENSE](LICENSE) ফাইল।
