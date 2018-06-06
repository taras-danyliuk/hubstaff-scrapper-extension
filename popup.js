const email = "taras.danylyuk@coaxsoft.com";
const password = "";

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

document.addEventListener("DOMContentLoaded", function () {
  const includeCheckbox = document.getElementById("include");
  const dayOffInput = document.getElementById("dayOff");

  if (new Date().getHours() <= 16) includeCheckbox.checked = true;
  chrome.storage.sync.get(["dayOffs"], function (result) {
    if (result.dayOffs >= 0) dayOffInput.value = result.dayOffs;
  });

  includeCheckbox.addEventListener("change", getMemoryHours);
  dayOffInput.addEventListener("input", e => {
    chrome.storage.sync.set({ dayOffs: e.target.value });
    getMemoryHours();
  });

  getMemoryHours();

  // Get current value
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status !== 200) {
      document.getElementById("title").innerHTML = "Server not started";
    }

    if (this.readyState === 4 && this.status === 200) {
      // Typical action to be performed when the document is ready:
      const response = JSON.parse(xhttp.responseText);
      const keys = Object.keys(response);

      document.getElementById("title").innerHTML = keys[0];
      document.getElementById("result").innerHTML = response[keys[0]];

      if (keys[0] !== "hours") return;

      chrome.storage.sync.set({ hours: response[keys[0]] });
      prepAndFill(response[keys[0]]);
    }
  };
  xhttp.open("GET", `https://hubstaff-scrapper.herokuapp.com/api/time?email=${email}&password=${password}`, true);
  xhttp.send();
}, false);

function getMemoryHours() {
  chrome.storage.sync.get(["hours"], function (result) {
    if (result.hours) prepAndFill(result.hours);
  });
}

function prepAndFill(value) {
  const now = new Date();
  const finish = getFinalDate();
  const monthIndex = finish.getMonth();

  const dayOff = document.getElementById("dayOff").value;
  const days = workingDaysBetweenDates(now, finish, false);

  const current = value;
  const currentArray = current.split(":");
  const currentS = (+currentArray[0] * 3600) + (+currentArray[1] * 60) + +currentArray[2];

  const { target, targetB, targetBB } = hours[monthIndex];

  const targetS = (target - (dayOff * 6)) * 3600;
  const targetBS = (targetB - (dayOff * 7)) * 3600;
  const targetBBS = (targetBB - (dayOff * 8)) * 3600;

  const avarageTargetS = Math.ceil((targetS - currentS) / days);
  const avarageTargetBS = Math.ceil((targetBS - currentS) / days);
  const avarageTargetBBS = Math.ceil((targetBBS - currentS) / days);

  const avarageTarget = secToDate(avarageTargetS);
  const avarageTargetB = secToDate(avarageTargetBS);
  const avarageTargetBB = secToDate(avarageTargetBBS);

  document.getElementById("normal").innerHTML = avarageTarget;
  document.getElementById("bonus").innerHTML = avarageTargetB;
  document.getElementById("bonus2").innerHTML = avarageTargetBB;

  document.getElementById("days").innerHTML = days;

  const daysWithoutToday = workingDaysBetweenDates(now, finish, true);
  const idealHoursS = daysWithoutToday * 7 * 3600;
  const left = secToDate(targetBS - idealHoursS - currentS)

  document.getElementById("left").innerHTML = left;
  
  const goal = document.getElementById("goal");
  const hoursTillGoal = document.getElementById("hours");

  if (avarageTarget !== "Done") {
    goal.innerHTML = `${target - (dayOff * 6)}:00:00`;
    hoursTillGoal.innerHTML = secToDate(targetS - currentS);
  }
  else if (avarageTargetB !== "Done") {
    goal.innerHTML = `${targetB - (dayOff * 6)}:00:00`;
    hoursTillGoal.innerHTML = secToDate(targetBS - currentS);
  }
  else if (avarageTargetBB !== "Done") {
    goal.innerHTML = `${targetBB - (dayOff * 6)}:00:00`;
    hoursTillGoal.innerHTML = secToDate(targetBBS - currentS);
  }
  else {
    goal.innerHTML = `${targetBB - (dayOff * 6)}:00:00`;
    hoursTillGoal.innerHTML = secToDate(targetBBS - currentS, false);
  }
}

function getFinalDate() {
  const now = new Date();
  const finish = new Date();
  finish.setDate(26);

  if (now.getDate() > 26) finish.setMonth(now.getMonth() + 1);

  return finish;
}

function workingDaysBetweenDates(start, end, forceSkipToday) {
  const startTime = start.getTime();

  const daysToIterate = Math.floor((end.getTime() - startTime) / DAY_MILISECONDS) + 1;
  let days = daysToIterate;
  let i = 0;

  if (!document.getElementById("include").checked || forceSkipToday) {
    i = 1;
    days--;
  }

  for (; i < daysToIterate; i++) {
    const day = new Date(startTime + (DAY_MILISECONDS * i)).getDay();

    if (day === 6 || day === 0) days--;
  }

  return days;
}

function secToDate(seconds, onlyPositive = true) {
  if (seconds < 0 && onlyPositive) return "Done";

  let prefix = "";
  if (seconds < 0) {
    prefix = "-";
    seconds = Math.abs(seconds);
  }

  const fullHours = Math.floor(seconds / 3600);
  seconds = seconds - (fullHours * 3600);

  const fullMinutes = Math.floor(seconds / 60);
  seconds = seconds - (fullMinutes * 60);

  return `${prefix}${fullHours}:${insertZero(fullMinutes)}:${insertZero(seconds)}`
}

function insertZero(number) {
  if (number.toString().length === 1) return `0${number}`;

  return number;
}
