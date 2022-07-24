import * as monaco from "monaco-editor";

import metroMap from "./img/Vector.svg";

import "./index.html";

import "./js/download.js";

import "./css/index.css";

const out = document.querySelector(".out");
const loader = document.querySelector(".loader");

const dataArray = [];
const loaders = document.querySelectorAll(".file-downloader");

loaders.forEach((loader, index) => {
  loader.addEventListener("change", (event) => {
    const item = event.target.files;
    const selector = event.target.id;
    const reader = new FileReader();
    reader.onload = () => {
      dataArray[index] = reader.result;
      document.querySelector(`.${selector} .code-block__name`).textContent =
        item[0].name;
    };
    reader.readAsText(item[0]);
  });
});

document
  .querySelector(".app__button")
  .addEventListener("click", function diff(e) {
    e.preventDefault();

    if (!dataArray[0] || !dataArray[1]) {
      out.innerHTML = "Добавьте два файла для сравнения";
      return false;
    }
    document.getElementById("monaco-container").style.height = "594px";

    var diffEditor = monaco.editor.createDiffEditor(
      document.getElementById("monaco-container"),
      {
        renderOverviewRuler: false,
        enableSplitViewResizing: true,
      }
    );

    Promise.all(dataArray).then(function (r) {
      const origin = r[0];
      const modify = r[1];
      diffEditor.setModel({
        original: monaco.editor.createModel(origin, "javascript"),
        modified: monaco.editor.createModel(modify, "javascript"),
      });
    });

    diffRequest(dataArray[0], dataArray[1]).then((data) => {
      if (!data.ok) {
        console.log(data);
        out.textContent = "Что-то пошло не так";
        return;
      }
      document.querySelector(".out .out__text").innerHTML =
        parseInt(data.json().result, 10) * 100 + "%";
    });
    e.target.removeEventListener("click", diff);
    e.target.textContent = "Повторить";
  });

async function diffRequest(origin, modify) {
  const data = {
    origin: origin,
    reviewer: modify,
  };

  loader.style.display = "block";

  const response = await fetch(
    "https://d5d8ctsk5ep2cvlh7bka.apigw.yandexcloud.net/api/code-comparator/compare",
    {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    }
  );

  loader.style.display = "none";

  return await response;
}
