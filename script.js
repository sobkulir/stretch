const MONTHS = [
  {name: 'Jan', days: 31},
  {name: 'Feb', days: 29},
  {name: 'Mar', days: 31},
  {name: 'Apr', days: 30},
  {name: 'May', days: 31},
  {name: 'Jun', days: 30},
  {name: 'Jul', days: 31},
  {name: 'Aug', days: 31},
  {name: 'Sep', days: 30},
  {name: 'Oct', days: 31},
  {name: 'Nov', days: 30},
  {name: 'Dec', days: 31},
]

function getGlobalDayIdx(monthIdx, day) {
  return day + MONTHS.slice(0, monthIdx).reduce((accum, cur) => accum + cur.days, 0);
}

function getDayDivId(monthIdx, day) {
  return `day-${getGlobalDayIdx(monthIdx, day)}`;
}

function isActiveDay(monthIdx, day, activeDays) {
  return activeDays.includes(getGlobalDayIdx(monthIdx, day));
}

function toggleDay(monthIdx, day) {
  const dayDivId = getDayDivId(monthIdx, day);
  const dayGlobalId = getGlobalDayIdx(monthIdx, day);
  const dayDiv = document.getElementById(dayDivId);

  const uid = firebase.auth().currentUser.uid;
  const docRef = db.collection("users").doc(uid);

  if (dayDiv.classList.contains('active')) {
    dayDiv.classList.remove('active');
    docRef.update({
      activeDays: firebase.firestore.FieldValue.arrayRemove(dayGlobalId)
    })
  } else {
    dayDiv.classList.add('active');
    docRef.update({
      activeDays: firebase.firestore.FieldValue.arrayUnion(dayGlobalId)
    })
  }
}

function renderMonth(monthIdx, activeDays) {
  const month = MONTHS[monthIdx];
  const monthDiv = document.createElement('div');
  monthDiv.classList.add('month');
  
  const monthLabel = document.createElement('div');
  monthLabel.innerText = month.name;
  monthLabel.classList.add('month-label');
  monthDiv.appendChild(monthLabel);

  const table = document.getElementById('table');
  table.appendChild(monthDiv);

  for (let i = 0; i < month.days; ++i) {
    const day = document.createElement('div');
    day.innerText = i+1;
    day.classList.add('day');
    if (isActiveDay(monthIdx, i, activeDays)) {
      day.classList.add('active');
    }

    day.id = getDayDivId(monthIdx, i);
    day.onclick = () => {toggleDay(monthIdx, i)}
    monthDiv.appendChild(day);
  }
}

function renderCalendar() {
  const uid = firebase.auth().currentUser.uid;
  const docRef = db.collection("users").doc(uid);
  docRef.get().then((doc) => {
    if (doc.exists) {
      renderFromDb(doc.data().activeDays);
    } else {
      docRef.set({activeDays: []}).then(()=>renderFromDb([]));
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

function renderFromDb(activeDays) {
  for (let i = 0; i < MONTHS.length; ++i) {
    renderMonth(i, activeDays)
  }
}

function deleteCalendar() {
  const table = document.getElementById('table');
  table.innerHTML = '';
}
