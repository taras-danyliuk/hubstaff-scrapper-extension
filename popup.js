const DAY_MILISECONDS = 86400000;

const target = 120;
const targetB = 140;
const targetBB = 160;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const now = new Date();
        const finish = getFinalDate();

        const days = workingDaysBetweenDates(now, finish);

        const current = "130:21:15";
        const currentArray = current.split(":");
        const currentS = (+currentArray[0] * 3600) + (+currentArray[1] * 60) + +currentArray[2];

        const targetS = target * 3600;
        const targetBS = targetB * 3600;
        const targetBBS = targetBB * 3600;

        const avarageTargetS = Math.ceil((targetS - currentS) / days);
        const avarageTargetBS = Math.ceil((targetBS - currentS) / days);
        const avarageTargetBBS = Math.ceil((targetBBS - currentS) / days);

        const avarageTarget = secToDate(avarageTargetS);
        const avarageTargetB = secToDate(avarageTargetBS);
        const avarageTargetBB = secToDate(avarageTargetBBS);

        document.getElementById('title').innerHTML = "hours";
        document.getElementById('result').innerHTML = current;

        document.getElementById('normal').innerHTML = avarageTarget;
        document.getElementById('bonus').innerHTML = avarageTargetB;
        document.getElementById('bonus2').innerHTML = avarageTargetBB;
    }, 1000);
}, false);

function getFinalDate() {
    const now = new Date();
    const finish = new Date();
    finish.setDate(26);

    if(now.getDate() > 26) finish.setMonth(now.getMonth() + 1);

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

    for(; i < daysToIterate; i++) {
        const day = new Date(startTime + (DAY_MILISECONDS * i)).getDay();

        if(day === 6 || day === 7) days--;
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
    if(number.toString().length === 1) return `0${number}`;

    return number;
}