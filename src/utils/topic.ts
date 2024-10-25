// ひらがな文字の定数配列
const HIRAGANA = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "が",
  "ぎ",
  "ぐ",
  "げ",
  "ご",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  "ざ",
  "じ",
  "ず",
  "ぜ",
  "ぞ",
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "だ",
  "ぢ",
  "づ",
  "で",
  "ど",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "は",
  "ひ",
  "ふ",
  "へ",
  "ほ",
  "ば",
  "び",
  "ぶ",
  "べ",
  "ぼ",
  "ぱ",
  "ぴ",
  "ぷ",
  "ぺ",
  "ぽ",
  "ま",
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "り",
  "る",
  "れ",
  "ろ",
  "わ",
] as const;

export const generateHiragana = (): string => {
  const randomIndex = Math.floor(Math.random() * HIRAGANA.length);
  return HIRAGANA[randomIndex];
};

export const generateTopicTitle = (
  hiragana: string,
  phrase: string
): string => {
  return `「${hiragana}」からはじまる${phrase}`;
};

export const validateTopicPhrase = (phrase: string): boolean => {
  return phrase.length >= 3 && phrase.length <= 50;
};

export const isValidHiragana = (char: string): boolean => {
  return HIRAGANA.includes(char as (typeof HIRAGANA)[number]);
};
