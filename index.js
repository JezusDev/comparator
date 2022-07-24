document
  .querySelector(".app__button")
  .addEventListener("click", function diff(e) {
    e.preventDefault();

    if (!dataArray[0] || !dataArray[1]) {
      return false;
    }
    require.config({ paths: { vs: "../node_modules/monaco-editor/min/vs" } });
    document.getElementById("monaco-container").style.height = "594px";

    require(["vs/editor/editor.main"], function () {
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
    });
    diffRequest(dataArray[0], dataArray[1]).then((data) => {
      if (!data.ok) {
        console.log(data);
        document.querySelector(".out").textContent = "Что-то пошло не так";
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

  document.querySelector(".loader").style.display = "block";

  const response = await fetch(
    "https://d5d8ctsk5ep2cvlh7bka.apigw.yandexcloud.net/api/code-comparator/compare",
    {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  document.querySelector(".loader").style.display = "none";

  return await response;
}
