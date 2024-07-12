import { Label } from "../components/labels";
import { AddButton } from "../components/buttons";
import Container from "../components/container";
import Modal from "../components/modal";
import { ProjectForm } from "../components/forms";
import { ProjectItem } from "../components/items";
import { ProjectsApi } from "../helpers/projectApi";
import { UserApi } from "../helpers/userApi";
import { Project } from "../models/project";
import { UserService } from "../services/userService";
import LogoImage from "../components/images";

const currentUser = UserService.getLoggedInUser();

const projectApi = new ProjectsApi();
const userApi = new UserApi();

new Container("header-container", "app");

new Container("content-container", "app");

const handleClick = (): void => {
  modal.open();
};

new AddButton("+", "add-project-btn", "content-container", handleClick);

new Container("projects-container", "content-container");

const modal = new Modal("add-form-modal", "content-container");
const projectForm = new ProjectForm("project-form");

const loadProjects = async () => {
  const projects = await projectApi.getAll();
  const projectsContainer = document.getElementById("projects-container");

  const displayProjects = (projectsToDisplay: Project[]) => {
    if (projectsContainer) {
      projectsContainer.innerHTML = "";
      projectsToDisplay.forEach(
        (project) => new ProjectItem("projects-container", project)
      );
    }
  };

  const sortedProjects = projects.sort((a, b) => a.name.localeCompare(b.name));

  displayProjects(sortedProjects);
};

projectForm.setOnSubmit(async (_event, project: Project) => {
  await projectApi.create(project);
  await loadProjects();
  modal.close();
});

modal.setContent(projectForm.form);

new LogoImage(
  "src/assets/logo.svg",
  "Project logo",
  "logo-header",
  "header-container"
);

if (currentUser) {
  const userName = currentUser.name;
  const welcomeMessage = `<span>
      <img src="src/assets/loggedUser.svg" alt="User icon" id="loggedIcon">
      Hello, ${userName}!
    </span>`;
  new Label(welcomeMessage, "welcome-label", "header-container");
}

window.onload = async () => {
  await loadProjects();

  const allUsers = await userApi.getAll();
  console.info(allUsers);

  const searchInput = document.getElementById(
    "search-input"
  ) as HTMLInputElement;
  searchInput.addEventListener("input", async () => {
    const searchTerm = searchInput.value.toLowerCase();
    const projects = await projectApi.getAll();
    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm)
    );
    const sortedFilteredProjects = filteredProjects.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const projectsContainer = document.getElementById("projects-container");
    if (projectsContainer) {
      projectsContainer.innerHTML = "";
      sortedFilteredProjects.forEach(
        (project) => new ProjectItem("projects-container", project)
      );
    }
  });

  const logoutButton = document.getElementById(
    "logout-button"
  ) as HTMLButtonElement;
  if (logoutButton) {
    if (!UserService.isLoggedIn()) logoutButton.style.display = "none";
    logoutButton.addEventListener("click", async () => {
      await UserService.logoutUser();
      window.location.href = "src/views/loginView.html";
    });
  }
};
