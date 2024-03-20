"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalAcctiveHabbitId;

const page = {
  menu: document.querySelector(".menu-list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progress-percent"),
    progressBarCover: document.querySelector(".progress-bar-cover"),
  },
  main: {
    daysContainer: document.getElementById("days"),
    day: document.querySelector(".habbit-day"),
  },
  popUp: {
      popup: document.getElementById("add-habbit-popup"),
  }
};

function loadData() {
  const habbitsStrings = localStorage.getItem(HABBIT_KEY);
  const nabbitArray = JSON.parse(habbitsStrings);
  if (Array.isArray(nabbitArray)) {
    habbits = nabbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id = '${habbit.id}']`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu-item");
      element.addEventListener("click", () => render(habbit.id));
      element.innerHTML = `<img src="img/${habbit.icon}.svg" alt="${habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("menu-item-active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu-item-active");
    } else {
      existed.classList.remove("menu-item-active");
    }
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + " %";
  page.header.progressBarCover.setAttribute("style", `width: ${progress}%`);
}

function rerenderMainContent(activeHabbit) {
  page.main.daysContainer.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `
      <div class="habbit-day">День ${Number(index) + 1}</div>
      <div class="habbit-comment">${activeHabbit.days[index].comment}</div>
      <button class="habbit-delete">
        <img src="img/trash.svg" alt="Удалить день ${
          index + 1
        }" onclick="deleteDay(${index})"/>
      </button>`;
    page.main.daysContainer.appendChild(element);
  }
  page.main.day.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function render(activeHabbitId) {
  globalAcctiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) return;
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderMainContent(activeHabbit);
}

function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalAcctiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });
  form["comment"].value = "";
  render(globalAcctiveHabbitId);
  saveData();
}

function deleteDay(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalAcctiveHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  render(globalAcctiveHabbitId);
  saveData();
}

function chekPopUp(){
  if(page.popUp.popup.classList.contains('cover-hidden')) {
    page.popUp.popup.classList.remove('cover-hidden')
  } else {
    page.popUp.popup.classList.add('cover-hidden')
  }
}

(() => {
  loadData();
  render(habbits[0].id);
})();
