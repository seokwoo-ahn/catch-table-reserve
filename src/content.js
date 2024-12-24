console.log('content.js loaded');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Message received in content.js:', request);
    if (request.action === 'makeReservation') {
        const { startDate, endDate, startTime, endTime, idx } = request;
        makeReservation(startDate, endDate, startTime, endTime, idx, sendResponse);
    } else if (request.action === 'selectNextDay') {
        selectNextDay(sendResponse);
    } else if (request.action === 'selectPrevDay') {
        selectPrevDay(sendResponse);
    }
});

function makeReservation(startDate, endDate, startTime, endTime, idx, sendResponse) {
    const [startYear, startMonth, startDay] = startDate.split('-');
    const [endYear, endMonth, endDay] = endDate.split('-');

    // 날짜 범위 내의 버튼 클릭하는 로직
    let dateButtons = Array.from(document.querySelectorAll('div[role="button"]'))
        .filter(button => !button.hasAttribute('aria-disabled'))
        .filter(button => !button.closest('.mbsc-calendar-day-outer'));

    if (dateButtons.length === 0) {
        sendResponse({ success: false, message: '날짜 버튼이 없습니다.' });
        return;
    }

    let dateClicked = false;

    let startIdx = 0;
    let endIdx = dateButtons.length - 1;
    for (let i = 0; i < dateButtons.length; i++) {
        const button = dateButtons[i];
        const ariaLabel = button.getAttribute('aria-label');

        if (ariaLabel) {
            const dateParts = ariaLabel.match(/(\d+)월 (\d+), (\d+)/);
            const [_, month, day, year] = dateParts;
            const buttonDate = new Date(`${year}-${month}-${day}`);
            const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);
            const endDateObj = new Date(`${endYear}-${endMonth}-${endDay}`);

            if (buttonDate.getTime() === startDateObj.getTime()) {
                startIdx = i;
            } else if (buttonDate.getTime() === endDateObj.getTime()) {
                endIdx = i;
                break;
            }
        }
    }

    if (startIdx >= endIdx) {
        console.log(startIdx, endIdx);
        sendResponse({ success: false, message: '해당 날짜 범위에 예약 가능한 버튼이 없습니다.' });
        return;
    }

    if (startIdx + idx > endIdx) {
        console.log(startIdx, idx, endIdx);
        sendResponse({ success: false, idx: 0, message: '처음부터 다시 시작합니다.' });
        return;
    }

    const button = dateButtons[startIdx + idx];
    const ariaLabel = button.getAttribute('aria-label');

    if (ariaLabel) {
        const dateParts = ariaLabel.match(/(\d+)월 (\d+), (\d+)/);
        const [_, month, day, year] = dateParts;
        const buttonDate = new Date(`${year}-${month}-${day}`);
        const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);
        const endDateObj = new Date(`${endYear}-${endMonth}-${endDay}`);

        if (buttonDate.getTime() >= startDateObj.getTime() && buttonDate.getTime() <= endDateObj.getTime()) {
            button.click();
            dateClicked = true;

            // 응답 대기를 위해 0.2초에서 0.4초 사이의 랜덤한 시간을 단순대기
            const randomWaitTime = Math.random() * 200 + 200;
            setTimeout(() => {
            }, randomWaitTime)

            // 시간 범위 내의 버튼 클릭하는 로직
            // const timeButtons = document.querySelectorAll('button._1ltqxco1r');

            // for (let j = 0; j < timeButtons.length; j++) {
            //     const timeButton = timeButtons[j];
            //     const buttonText = timeButton.querySelector('.time').textContent.trim();
            //     const [period, time] = buttonText.split(' ');
            //     const [buttonHour, buttonMinute] = time.split(':').map(Number);
            //     const adjustedButtonHour = period === '오후' && buttonHour !== 12 ? buttonHour + 12 : buttonHour;
            //     const buttonTime = adjustedButtonHour * 60 + buttonMinute;

            //     const [startPeriod, startTimeValue] = startTime.split(' ');
            //     const [startHour, startMinute] = startTimeValue.split(':').map(Number);
            //     const adjustedStartHour = startPeriod === '오후' && startHour !== 12 ? startHour + 12 : startHour;
            //     const startTimeMinutes = adjustedStartHour * 60 + startMinute;

            //     const [endPeriod, endTimeValue] = endTime.split(' ');
            //     const [endHour, endMinute] = endTimeValue.split(':').map(Number);
            //     const adjustedEndHour = endPeriod === '오후' && endHour !== 12 ? endHour + 12 : endHour;
            //     const endTimeMinutes = adjustedEndHour * 60 + endMinute;

            //     if (buttonTime >= startTimeMinutes && buttonTime <= endTimeMinutes) {
            //         timeButton.click();
            //         sendResponse({ success: true });
            //         return;
            //     }
            // }
        }
    }

    if (!dateClicked) {
        sendResponse({ success: false, message: '해당 날짜 범위에 예약 가능한 버튼이 없습니다.' });
        return;
    }
    sendResponse({ success: false, idx: idx + 1, message: '해당 시간 범위에 예약 가능한 버튼이 없습니다.' });
}

function selectNextDay(sendResponse) {
    // 날짜 범위 내의 버튼 클릭하는 로직
    const dateButtons = Array.from(document.querySelectorAll('div[role="button"]'))
        .filter(button => !button.hasAttribute('aria-disabled'));
    if (dateButtons.length === 0) {
        sendResponse({ success: false, message: '날짜 버튼이 없습니다.' });
        return;
    }

    for (let i = 0; i < dateButtons.length; i++) {
        const button = dateButtons[i];

        if (button.getAttribute('aria-pressed') === 'true') {
            if (i === dateButtons.length - 1) {
                sendResponse({ success: false, message: '클릭 가능한 마지막 날 입니다.' });
                return;
            } else {
                dateButtons[i + 1].click();
                sendResponse({ success: true });
                return;
            }
        }
    }
    nextDayButton.click();
}

function selectPrevDay(sendResponse) {
        // 날짜 범위 내의 버튼 클릭하는 로직
        const dateButtons = Array.from(document.querySelectorAll('div[role="button"]'))
        .filter(button => !button.hasAttribute('aria-disabled'));
    if (dateButtons.length === 0) {
        sendResponse({ success: false, message: '날짜 버튼이 없습니다.' });
        return;
    }

    for (let i = 0; i < dateButtons.length; i++) {
        const button = dateButtons[i];

        if (button.getAttribute('aria-pressed') === 'true') {
            if (i === 0) {
                sendResponse({ success: false, message: '클릭 가능한 첫 날 입니다.' });
                return;
            } else {
                dateButtons[i - 1].click();
                sendResponse({ success: true });
                return;
            }
        }
    }
}
