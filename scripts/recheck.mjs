/**
 * 재검증 기한 감시 — 「사람이 기억해서 지우는 구조로 만들지 마라」(BRIEF §0-1 ②).
 *
 * questions.json 을 읽어 기한이 지났거나 곧 닥치는 문항을 찾는다.
 * 표준출력에 마크다운을 뱉고, 걸린 것이 있으면 종료코드 1 이다.
 */
import { readFileSync } from 'node:fs';

/** 근거 유형별 재검증 주기(개월). 앱의 content.ts 와 같은 값이어야 한다. */
const RECHECK_MONTHS = { LIFE: 24, LAW: 12, PROPOSAL: 6, CURRENT: 3 };
/** 며칠 앞부터 미리 알릴까. */
const WARN_DAYS = 30;

const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

function recheckBy(q) {
  const [y, m, d] = q.source.checkedOn.split('-').map(Number);
  const due = new Date(Date.UTC(y, m - 1, d));
  due.setUTCMonth(due.getUTCMonth() + (RECHECK_MONTHS[q.basisType] ?? 12));
  return due.toISOString().slice(0, 10);
}

const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

const { questions } = JSON.parse(readFileSync('questions.json', 'utf8'));

/** 근거 단위로 묶는다 — 진짜·가짜 짝은 같은 원문을 보므로 같이 처리한다. */
const byBasis = new Map();
for (const q of questions) {
  const due = recheckBy(q);
  const cur = byBasis.get(q.basisKey);
  if (cur == null || due < cur.due) {
    byBasis.set(q.basisKey, { due, agency: q.source.agency, url: q.source.url, type: q.basisType });
  }
}

const expired = [];
const soon = [];
for (const [key, v] of byBasis) {
  const left = days(today, v.due);
  if (left < 0) expired.push({ key, ...v, left });
  else if (left <= WARN_DAYS) soon.push({ key, ...v, left });
}

const rows = (list) =>
  list
    .sort((a, b) => a.due.localeCompare(b.due))
    .map((x) => `| \`${x.key}\` | ${x.type} | ${x.due} | ${x.left}일 | [원문](${x.url}) |`)
    .join('\n');

if (expired.length === 0 && soon.length === 0) {
  console.log(`재검증 기한이 닥친 근거가 없다. (기준일 ${today}, 근거 ${byBasis.size}개)`);
  process.exit(0);
}

console.log(`기준일 **${today}** · 근거 ${byBasis.size}개 중 손볼 것이 있다.\n`);
if (expired.length > 0) {
  console.log(`## 🔴 기한이 지났다 — ${expired.length}개\n`);
  console.log('앱은 이미 목록에서 빼고 있다(\`isFresh\`). 원문을 다시 열어 **아직 맞으면 확인일자만 갱신**하고, 틀려졌으면 그 근거를 통째로 뺀다.\n');
  console.log('| 근거 | 유형 | 기한 | 지난 일수 | |\n|---|---|---|---|---|');
  console.log(rows(expired) + '\n');
}
if (soon.length > 0) {
  console.log(`## ⏳ ${WARN_DAYS}일 안에 닥친다 — ${soon.length}개\n`);
  console.log('| 근거 | 유형 | 기한 | 남은 일수 | |\n|---|---|---|---|---|');
  console.log(rows(soon) + '\n');
}
console.log('> 🔴 **정답이 바뀐 것을 발견하면 고치지 말고 버려라.** 이미 푼 사람의 기록에 「맞음」으로 남아 있는데 정답이 뒤집히면 그 기록이 거짓이 된다.');
process.exit(1);
