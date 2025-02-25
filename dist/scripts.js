function projButtonOnClick(buttonClicked){
    console.log(buttonClicked.id)

    var projDiv = Array.from(document.getElementById("projectsDiv").children)
    projDiv.forEach(project => {
        if (!project.classList.contains(buttonClicked.id) && buttonClicked.id != "all" ){
            project.style = "display:none"
        } else
            project.style -= "display:none"
    });
}