// 이 파일은 크롬 확장의 백그라운드 스크립트로, 확장이 실행될 때 초기화 작업을 수행합니다.

chrome.runtime.onInstalled.addListener(() => {
    console.log("Catchtable Reservation Extension 설치됨.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);

    if (message.action === 'updateButton') {
        sendResponse({ status: 'Button updated' });
    }

    // 현재 활성 탭 가져오기
    chrome.tabs.query({ url: "https://app.catchtable.co.kr/*", active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                    return;
                } else {
                    console.log("Response from content script:", response);
                    sendResponse(response); // 팝업으로 최종 응답 전달
                }
            });
        } else {
            console.error("No active catch table tab found.");
            return;
        }
    });

    // 비동기 응답을 위해 true 반환
    return true;
});