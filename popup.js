const DAY_MILISECONDS = 86400000;

const hours = [
    {
        target: 126,
        targetB: 146,
        targetBB: 166,
    }, {
        target: 126,
        targetB: 146,
        targetBB: 166,
    }, {
        target: 114,
        targetB: 133,
        targetBB: 152,
    }, {
        target: 132,
        targetB: 154,
        targetBB: 176,
    }, {
        target: 120,
        targetB: 140,
        targetBB: 160,
    }, {
        target: 132,
        targetB: 154,
        targetBB: 176,
    }, {
        target: 132,
        targetB: 154,
        targetBB: 176,
    }, {
        target: 120,
        targetB: 140,
        targetBB: 160,
    }, {
        target: 138,
        targetB: 161,
        targetBB: 184,
    }, {
        target: 126,
        targetB: 147,
        targetBB: 168,
    }, {
        target: 126,
        targetB: 147,
        targetBB: 168,
    }, {
        target: 126,
        targetB: 147,
        targetBB: 168,
    }
]

document.addEventListener('DOMContentLoaded', function () {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status !== 200) {
            document.getElementById("title").innerHTML = "Server not started";
        }
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            const response = JSON.parse(xhttp.responseText);
            const keys = Object.keys(response);

            document.getElementById("title").innerHTML = keys[0];
            document.getElementById("result").innerHTML = response[keys[0]];

            if (keys[0] !== 'hours') return;

            const now = new Date();
            const finish = getFinalDate();
            const monthIndex = finish.getMonth();

            const days = workingDaysBetweenDates(now, finish);

            const current = response[keys[0]];
            const currentArray = current.split(":");
            const currentS = (+currentArray[0] * 3600) + (+currentArray[1] * 60) + +currentArray[2];

            const { target, targetB, targetBB } = hours[monthIndex];

            const targetS = target * 3600;
            const targetBS = targetB * 3600;
            const targetBBS = targetBB * 3600;

            const avarageTargetS = Math.ceil((targetS - currentS) / days);
            const avarageTargetBS = Math.ceil((targetBS - currentS) / days);
            const avarageTargetBBS = Math.ceil((targetBBS - currentS) / days);

            const avarageTarget = secToDate(avarageTargetS);
            const avarageTargetB = secToDate(avarageTargetBS);
            const avarageTargetBB = secToDate(avarageTargetBBS);

            document.getElementById('normal').innerHTML = avarageTarget;
            document.getElementById('bonus').innerHTML = avarageTargetB;
            document.getElementById('bonus2').innerHTML = avarageTargetBB;
        }
    };
    xhttp.open("GET", "http://localhost:12345/api/time", true);
    xhttp.send();
}, false);

function getFinalDate() {
    const now = new Date();
    const finish = new Date();
    finish.setDate(26);

    if (now.getDate() > 26) finish.setMonth(now.getMonth() + 1);

    return finish;
}

function workingDaysBetweenDates(start, end) {
    const startTime = start.getTime();

    const daysToIterate = Math.floor((end.getTime() - startTime) / DAY_MILISECONDS) + 1;
    let days = daysToIterate;
    let i = 0;

    if (start.getHours() > 16) {
        i = 1;
        days--;
    }

    for (; i < daysToIterate; i++) {
        const day = new Date(startTime + (DAY_MILISECONDS * i)).getDay();

        if (day === 6 || day === 7) days--;
    }

    return days;
}

function secToDate(seconds) {
    const fullHours = Math.floor(seconds / 3600);
    seconds = seconds - (fullHours * 3600);

    const fullMinutes = Math.floor(seconds / 60);
    seconds = seconds - (fullMinutes * 60);

    return `${fullHours}:${insertZero(fullMinutes)}:${insertZero(seconds)}`
}

function insertZero(number) {
    if (number.toString().length === 1) return `0${number}`;

    return number;
}