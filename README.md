# AI MindMap (Client-only Demo)

간단한 클라이언트 전용 마인드맵 데모입니다. OpenAI API 키를 입력하면 AI로부터 응답을 받아 노드를 생성할 수 있습니다.

주의: 이 프로젝트는 키를 서버에 저장하지 않습니다. 공개적으로 사용하실 때는 개인 키 노출에 주의하세요.

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

## OpenAI 키 테스트 안내

1. https://platform.openai.com/ 에 가입 후 API 키를 발급받습니다.
2. 앱에서 우측 상단의 `API 키 변경`을 클릭하고 키를 붙여넣은 뒤 `저장(세션)`을 클릭합니다.
3. 주제를 입력하고 `생성`을 눌러 동작을 확인합니다.

## 배포

이 프로젝트는 정적 사이트로 GitHub Pages, Netlify, Vercel 등에 배포할 수 있습니다. 자동배포는 `.github/workflows/deploy.yml`에 설정되어 있습니다 (메인 브랜치 푸시 시 자동 빌드·배포).

## 보안

브라우저에 API 키를 저장하면 유출 위험이 있으므로, 공개 서비스로 운영하려면 서버리스 프록시(또는 백엔드)를 사용해 키를 안전하게 보관하세요.

