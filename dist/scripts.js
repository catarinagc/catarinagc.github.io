function projButtonOnClick(buttonClicked){
    console.log(buttonClicked.id)
    const allButtons = document.querySelectorAll("#projectsTab button");
    allButtons.forEach(button => button.classList.remove("active-tab"));
    buttonClicked.classList.add("active-tab");
    console.log(buttonClicked.classList)
    var projDiv = Array.from(document.getElementById("projectsDiv").children)
    projDiv.forEach(project => {
        if (!project.classList.contains(buttonClicked.id) && buttonClicked.id != "all" ){
            project.style = "display:none"
        } else
            project.style -= "display:none"
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navBar = document.getElementById("navBar");

  menuToggle.addEventListener("click", () => {
    navBar.classList.toggle("active");
  });
});
