# Catchtable Reservation Extension

이 프로젝트는 Catchtable 웹사이트에서 특정 날짜에 예약을 할 수 있는 Chrome 확장을 제공합니다.

## 파일 구조

```text
catchtable-reservation-extension
├── src
│   ├── background.js       // 백그라운드 스크립트
│   ├── content.js          // 콘텐츠 스크립트
│   ├── popup
│   │   ├── popup.html      // 팝업 UI
│   │   ├── popup.js        // 팝업 동작 제어
│   │   └── popup.css       // 팝업 스타일
├── manifest.json           // 확장 메타데이터
└── README.md               // 프로젝트 문서
```

## 설치 방법

1. 이 저장소를 클론합니다.

   ```bash
   git clone <repository-url>
   ```

2. Chrome 브라우저에서 `chrome://extensions/`로 이동합니다.

3. 오른쪽 상단의 "개발자 모드"를 활성화합니다.

4. "압축 해제된 확장 프로그램 로드" 버튼을 클릭하고, 클론한 프로젝트의 경로를 선택합니다.

## 사용 방법

1. 확장을 설치한 후, 브라우저의 도구 모음에서 확장 아이콘을 클릭합니다.

2. 팝업에서 예약 정보를 입력합니다.

3. 원하는 날짜와 시간을 선택한 후, 예약 요청을 제출합니다.

## 기여

기여를 원하시는 분은 이 저장소를 포크한 후, 변경 사항을 커밋하고 풀 리퀘스트를 제출해 주세요.
