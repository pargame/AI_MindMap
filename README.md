# AI MindMap (Client-only Demo)

간단한 클라이언트 전용 마인드맵 데모입니다. 브라우저에서 직접 AI API를 호출하며, OpenAI 또는 Google Gemini 키를 사용해 노드를 생성할 수 있습니다.

주의: 이 프로젝트는 키를 서버에 저장하지 않습니다(세션 스토리지에만 저장). 공개적으로 사용하실 때는 개인 키 노출에 주의하세요.

## 로컬 실행

1. 의존성 설치

```bash
npm install --prefix web
```

2. 개발 서버

```bash
npm run dev --prefix web
```

3. 브라우저에서 열기

```
http://localhost:5174/
```

## AI 키 테스트 안내 (OpenAI / Gemini)

1. 우측 상단의 `API 키 변경`을 클릭합니다.
2. Provider를 선택합니다.
	- OpenAI: https://platform.openai.com/ 에서 API 키 발급 → 모델 예시: `gpt-4o-mini`
	- Gemini: https://ai.google.dev/ 에서 API 키 발급 → 모델 예시: `gemini-1.5-flash`
3. API 키를 입력하고 `저장(세션)`을 클릭합니다.
4. 필요 시 모델을 조정하고, `max_tokens`를 줄이면 비용/쿼터 소모가 감소합니다.
5. 주제를 입력하고 `생성`을 눌러 동작을 확인합니다.

추가 옵션(OpenAI 전용):
- Organization (`OpenAI-Organization`), Project (`OpenAI-Project`) 헤더를 지정해 유료 워크스페이스로 라우팅할 수 있습니다.
  - 429(Quota exceeded)시 유용합니다.

## 배포

이 프로젝트는 정적 사이트로 GitHub Pages, Netlify, Vercel 등에 배포할 수 있습니다. 자동배포는 `.github/workflows/deploy.yml`에 설정되어 있습니다 (메인 브랜치 푸시 시 자동 빌드·배포).

## 보안

브라우저에 API 키를 저장하면 유출 위험이 있으므로, 공개 서비스로 운영하려면 서버리스 프록시(또는 백엔드)를 사용해 키를 안전하게 보관하세요.

추가 주의(Gemini):
- 브라우저 클라이언트에서 Gemini 호출은 키를 쿼리 파라미터로 전달하는 공식 방식입니다. 공개된 환경에서 개인 키를 사용하지 마세요.

## 버전/커밋 표시
- 배포 시 `meta.json`이 생성되어 페이지 하단 푸터에 버전과 커밋이 표시됩니다.

## Contributing
- See `handbook/CONTRIBUTING.md` for quick workflow and guidelines.

