let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();
let selectedDate = 0;
let selectedMonth = 0;
let selectedYear = 0;
let unmodifiedMonth = date.getMonth();
let unmodifiedYear = date.getFullYear();
let prevNextIcon = document.querySelectorAll(".arrows");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let moodsSummary = [];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Friday", "Saturday"];
const renderCalendar = () => {
  const daysTag = document.querySelector(".days");
  console.log("inside");

  let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
  let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
  let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
  let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

  console.log({
    firstDayofMonth,
    lastDateofMonth,
    lastDayofMonth,
    lastDateofLastMonth,
  });
  let dateTag = "";

  for (let i = firstDayofMonth; i > 0; i--) {
    dateTag += `<li id="calendarDate" class="inactive">${
      lastDateofLastMonth - i + 1
    }</li>`;
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    let currDate =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "present"
        : "";
    dateTag += `<li id="calendarDate" class="${currDate}">${
      i < 10 ? `0${i}` : i
    }</li>`;
  }

  for (let i = 1; i <= 6 - lastDayofMonth; i++) {
    dateTag += `<li id="calendarDate" class="inactive">${
      i < 10 ? `0${i}` : i
    }</li>`;
  }

  daysTag.innerHTML = dateTag;

  console.log("Updated .days:", daysTag.innerHTML);
  let currMonthYear = document.querySelector(".current-date");
  currMonthYear.textContent = `${months[currMonth]}, ${currYear}`;
  let dateSummary = document.querySelector(".dateSummary");
  dateSummary.textContent = `Date Selected: ${date.getDate()} ${
    months[unmodifiedMonth]
  } ${unmodifiedYear}`;
};

const emojiSummaryBox = (selectedDate, selectedMonth, selectedYear) => {
  const emojiBox = document.querySelector(".emojiSummaryBox");
  const newEmojiBox = emojiBox.cloneNode(true);
  emojiBox.parentNode.replaceChild(newEmojiBox, emojiBox);

  newEmojiBox.addEventListener("click", (emojiSummaryClicked) => {
    let clickedElement = emojiSummaryClicked.target;

    if (!clickedElement.classList.contains("emojiSummary")) return;

    document.querySelector(".selectedMood")?.classList.remove("selectedMood");
    clickedElement.classList.add("selectedMood");

    let existingEntry = moodsSummary.find(
      (entry) =>
        entry.selectedDate == selectedDate &&
        entry.selectedMonth == selectedMonth &&
        entry.selectedYear == selectedYear
    );

    if (existingEntry) {
      existingEntry.mood = clickedElement.id;
    } else {
      console.log("here");
      moodsSummary.push({
        selectedDate: selectedDate,
        selectedMonth: selectedMonth,
        selectedYear: selectedYear,
        mood: clickedElement.id,
      });
    }
    console.log(moodsSummary);
  });
};
const renderSummary = () => {
  document.querySelector(".days").addEventListener("click", (dateClicked) => {
    selectedDate = parseInt(dateClicked.target.textContent);
    let isInactive = dateClicked.target.classList.contains("inactive");
    selectedMonth = currMonth;
    selectedYear = currYear;

    if (isInactive) {
      if (selectedDate > 20) {
        selectedMonth = currMonth - 1;
        if (selectedMonth < 0) {
          selectedMonth = 11;
          selectedYear = currYear - 1;
        }
      } else {
        selectedMonth = currMonth + 1;
        if (selectedMonth > 11) {
          selectedMonth = 0;
          selectedYear = currYear + 1;
        }
      }
    }
    let dateSummary = document.querySelector(".dateSummary");
    dateSummary.textContent = `Date Selected: ${selectedDate} ${months[selectedMonth]} ${selectedYear}`;
    document.querySelector(".selectedMood")?.classList.remove("selectedMood");
    let existingEntry = moodsSummary.find(
      (entry) =>
        entry.selectedDate == selectedDate &&
        entry.selectedMonth == selectedMonth &&
        entry.selectedYear == selectedYear
    );
    if (existingEntry) {
      let foundMood = document.getElementById(existingEntry.mood);
      foundMood.classList.add("selectedMood");
    }
    emojiSummaryBox(selectedDate, selectedMonth, selectedYear);
  });
};
renderCalendar();
renderSummary();
emojiSummaryBox(date.getDate(), currMonth, currYear);

prevNextIcon.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    currMonth = arrow.id === "prev" ? currMonth - 1 : currMonth + 1;
    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth, new Date().getDate());
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });
});

document.querySelector(".mood").addEventListener("click", (moodHistory) => {
  console.log("Clicked:", moodHistory.target.id);

  let calendarContainer = document.querySelector(".calendarContainer");

  if (moodHistory.target.id === "CALENDAR") {
    // Reset calendarBody to its original structure
    let calendarDiv = document.querySelector(".calendarBody");
    calendarDiv.innerHTML = `
      <ul class="weeks">
        <li>Sun</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
      </ul>
      <ul class="days mannn"></ul>
    `;

    daysTag = document.querySelector(".days");
    renderCalendar();
    renderSummary();
    return;
  }

  let calendarDiv = document.querySelector(".calendarBody");
  calendarDiv.innerHTML = "";

  let filteredMood = moodsSummary.filter(
    (data) => data.mood === moodHistory.target.id.toLowerCase()
  );

  console.log("Filtered Mood Data:", filteredMood);

  if (filteredMood.length === 0) {
    let emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No data available";
    emptyMessage.classList.add("emptyMessage");
    calendarDiv.appendChild(emptyMessage);
    return;
  }

  let moodGrid = document.createElement("div");
  moodGrid.classList.add("moodGrid");

  filteredMood.forEach((filtered) => {
    let tile = document.createElement("div");
    tile.classList.add("moodTile");
    tile.textContent = `${filtered.selectedDate} ${
      months[filtered.selectedMonth]
    } ${filtered.selectedYear}`;
    moodGrid.appendChild(tile);
  });

  calendarDiv.appendChild(moodGrid);
});
