# 헷갈리는 화제 퀴즈 — 공개 문항 데이터

미니앱 **「헷갈리는 화제 퀴즈」**(`intoss://yozum-real-fake`)가 읽는 문항 파일이다.
**앱 코드는 여기 없다.** 이 리포에는 `questions.json` 하나만 둔다.

- 배포 주소: <https://liquidation-man.github.io/tricky-topic-quiz-content/questions.json>
- 이 리포가 공개인 이유는 **GitHub Pages 로 서빙해야 앱이 받아 갈 수 있기 때문**이다.
  정답이 같이 공개되지만 v1 에는 리워드가 없어 손해가 없다.

## 문항은 어떻게 만들어졌나

- 출처는 **국가기관(부·처·청) 법령 원문**뿐이다. 저작권법 제24조의2 ①에 따라
  허락 없이 이용할 수 있는 공공저작물이고, 부처 저작권정책도 공공누리 제1유형으로
  개방하고 있다.
- **원문을 복제하지 않는다.** 사실관계만 가져와 문장은 새로 썼다.
- 문항 문장은 공공기관 원문을 바탕으로 **AI가 작성하고 사람이 검수**한다.
- 항목마다 `source.agency`(기관명) · `source.checkedOn`(확인일자) · `source.url`(원문)이 있다.

## 모양

```jsonc
{
  "version": 1,
  "builtOn": "2026-08-12",
  "questions": [
    {
      "id": "jeonip-14d-r",
      "claim": "이사하면 사유가 생긴 날부터 14일 이내에 전입신고를 해야 한다.",
      "verdict": "REAL",              // REAL | FAKE
      "explanation": "주민등록법 제11조 …",
      "basisKey": "jeonip-14d",       // 같은 근거의 진짜/가짜 짝을 묶는다
      "basisType": "LAW",             // LIFE | LAW | PROPOSAL | CURRENT
      "source": { "agency": "…", "url": "https://www.law.go.kr/…", "checkedOn": "2026-08-12" }
    }
  ]
}
```

`basisKey` 가 같은 두 문항은 **한 사람에게 같이 나가지 않는다** — 앞 문항이 뒤 문항의
정답이 되기 때문이다.

## 틀린 내용을 발견하면

이슈로 알려 달라. **정답이 바뀐 문항은 고치지 않고 버린다** — 이미 푼 사람의 기록에
「맞음」으로 남아 있는데 정답이 뒤집히면 그 기록이 거짓이 된다.
