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
    iconField: document.querySelector('.pop-up-form input[name="icon"]'),
  },
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
  document.location.replace(document.location.pathname + "#" + activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderMainContent(activeHabbit);
}

function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["comment"]);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalAcctiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ["comment"]);
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

function chekPopUp() {
  if (page.popUp.popup.classList.contains("cover-hidden")) {
    page.popUp.popup.classList.remove("cover-hidden");
  } else {
    page.popUp.popup.classList.add("cover-hidden");
  }
}

function setIcon(context, icon) {
  page.popUp.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.icon-active");
  activeIcon.classList.remove("icon-active");
  context.classList.add("icon-active");
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ["name", "target"]);
  chekPopUp();
  saveData();
  render(maxId + 1);
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
      return;
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
  if (urlHabbit) {
    render(urlHabbit.id);
  } else {
    render(habbits[0].id);
  }
  render(habbits.find);
})();
