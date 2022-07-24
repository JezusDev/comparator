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
        document.getElementById("monaco-container")
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
    diffRequest(dataArray[0], dataArray[1]);
    e.target.removeEventListener("click", diff);
    e.target.textContent = "Повторить";
  });

async function diffRequest(origin, modify) {
  // const data = {
  //   origin: origin,
  //   reviewer: modify,
  // };

  // const response = await fetch(
  //   "https://d5d8ctsk5ep2cvlh7bka.apigw.yandexcloud.net/api/code-comparator/compare",
  //   {
  //     method: "POST",
  //     cache: "no-cache",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   }
  // );
  // console.log(response);
  // return await response.json();
  var url =
    "https://d5d8ctsk5ep2cvlh7bka.apigw.yandexcloud.net/api/code-comparator/compare";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };

  var data = `{
  "origin":"def hello(): print(\"Hello, World!\")",
  "reviewer":"def hello(): print(\"Hello, World!\")"
} `;

  xhr.send(data);
}
