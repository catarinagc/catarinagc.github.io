// import { toggleTouchInput } from './main.js';

function projButtonOnClick(buttonClicked){
  const allButtons = document.querySelectorAll("#projectsTab button");
  allButtons.forEach(button => {
    if (button.id == buttonClicked.id)
      button.classList.add("active-tab");
    else
      button.classList.remove("active-tab")
  });
  
  const select = document.getElementById("projectsTabSel");
  select.value = buttonClicked.id;

  var projDiv = Array.from(document.getElementById("projectsDiv").children)
  projDiv.forEach(project => {
      if (!project.classList.contains(buttonClicked.id) && buttonClicked.id != "all" ){
          project.style = "display:none"
      } else
          project.style -= "display:none"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("projectsTabSel");
  if (select) {
    select.addEventListener("change", (e) => {
      const fakeButton = { id: e.target.value };
      projButtonOnClick(fakeButton);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navBar = document.getElementById("navBar");

  menuToggle.addEventListener("click", () => {
    navBar.classList.toggle("active");
    document.addEventListener("click", handleOutsideClick);
  });

  const interactButton = document.getElementById("interactButton");

  if (interactButton) {
    interactButton.addEventListener("click", () => {
      let interactable = window.toggleTouchInput();
      interactButton.innerText = interactable ? "Stop Interact" : "Interact";
    });
  }
});


function handleOutsideClick(event) {
  const menuToggle = document.getElementById("menuToggle");
  const navBar = document.getElementById("navBar");
  if (!navBar.contains(event.target) && !menuToggle.contains(event.target)) {
    navBar.classList.remove("active");
    document.removeEventListener("click", handleOutsideClick);
  }
}

window.projButtonOnClick = projButtonOnClick;