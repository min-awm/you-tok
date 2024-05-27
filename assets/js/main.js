function toggleNavigation() {
  const appWrapperDom = document.getElementById("app-wrapper");
  const navigationDom = document.getElementById("navigation");

  appWrapperDom.classList.toggle("navigation-active");
  navigationDom.classList.toggle("navigation-active");
}

const nav = document.querySelector("nav"),
toggleBtn = nav.querySelector(".toggle-btn");

toggleBtn.addEventListener("click", () => {
nav.classList.toggle("open");
});

function a(e) {
    console.log(e)
}