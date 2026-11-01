export function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’‘ʼ]/g, "'")
    .replace(/[-‐‑–—]/g, "")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function accepted(input: string, answers: string[]): boolean {
  const n = normalize(input);
  return n.length > 0 && answers.some((answer) => normalize(answer) === n);
}

export function seededOrder(length: number, seed: string): number[] {
  const idx = Array.from({ length }, (_, i) => i);
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = length - 1; i > 0; i--) {
    h ^= h << 13;
    h = Math.imul(h, 16777619);
    const j = (h >>> 0) % (i + 1);
    const tmp = idx[i];
    idx[i] = idx[j]!;
    idx[j] = tmp!;
  }
  return idx;
}
