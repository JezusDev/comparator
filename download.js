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
