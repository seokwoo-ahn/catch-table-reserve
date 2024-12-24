document.addEventListener('DOMContentLoaded', function() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const startMacroButton = document.getElementById('start-macro');
    const stopMacroButton = document.getElementById('stop-macro');
    const nextDayButton = document.getElementById('select-next-day');
    const prevDayButton = document.getElementById('select-prev-day');

    let isMacroRunning = false;

    // 저장된 값을 불러오는 함수
    function loadSavedValues() {
        startDateInput.value = localStorage.getItem('startDate') || '';
        endDateInput.value = localStorage.getItem('endDate') || '';
        startTimeInput.value = localStorage.getItem('startTime') || '';
        endTimeInput.value = localStorage.getItem('endTime') || '';
    }

    // 값을 저장하는 함수
    function saveValues() {
        localStorage.setItem('startDate', startDateInput.value);
        localStorage.setItem('endDate', endDateInput.value);
        localStorage.setItem('startTime', startTimeInput.value);
        localStorage.setItem('endTime', endTimeInput.value);
    }

    // 팝업이 로드될 때 저장된 값을 불러옴
    loadSavedValues();

    startMacroButton.addEventListener('click', function() {
        // 이미 매크로가 실행중이라면 무시
        if (isMacroRunning) {
            console.log('매크로가 이미 실행중입니다.');
            return;
        }

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const startTime = convertTo12HourFormat(startTimeInput.value);
        const endTime = convertTo12HourFormat(endTimeInput.value);

        if (startDate && endDate && startTime && endTime) {
            isMacroRunning = true;
            console.log('매크로가 시작되었습니다.');
            saveValues(); // 값을 저장
            runMacro(startDate, endDate, startTime, endTime, 0);
        } else {
            alert('날짜와 시간을 입력해 주세요.');
        }
    });

    stopMacroButton.addEventListener('click', function() {
        isMacroRunning = false;
        alert('매크로가 중지되었습니다.');
    });

    nextDayButton.addEventListener('click', function() {
        selectNextDay();
    });

    prevDayButton.addEventListener('click', function() {
        selectPrevDay();
    });

    function runMacro(startDate, endDate, startTime, endTime, idx) {
        if (!isMacroRunning) return;

        console.log('예약 시도:', {
            idx: idx,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime
        });

        chrome.runtime.sendMessage({
            action: 'makeReservation',
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            idx: idx
        }, function(response) {
            console.log('Response received from content script:', response);
            if (!response) {
                isMacroRunning = false;
                alert('예약 요청에 실패했습니다. 매크로가 중지되었습니다.');
                return;
            }

            if (response.success) {
                isMacroRunning = false;
                alert('예약이 성공적으로 완료되었습니다!');
                return;
            } else {
                alert("예약에 실패했습니다.", response.message);
                return 
            }
        });
    }

    function selectNextDay() {
        chrome.runtime.sendMessage({
            action: 'selectNextDay'
        }, function(response) {
            console.log('Response received from content script:', response);
        });
    }
    
    function selectPrevDay() {
        chrome.runtime.sendMessage({
            action: 'selectPrevDay'
        }, function(response) {
            console.log('Response received from content script:', response);
        });
    }

    function convertTo12HourFormat(time) {
        const [hour, minute] = time.split(':').map(Number);
        const period = hour >= 12 ? '오후' : '오전';
        const adjustedHour = hour % 12 || 12;
        return `${period} ${adjustedHour}:${minute < 10 ? '0' + minute : minute}`;
    }
});