import Container from "../components/container";
import Modal from "../components/modal";
import { Label } from "../components/labels";
import { AddButton, BackButton } from "../components/buttons";
import { TaskForm } from "../components/forms";
import { TaskItem } from "../components/items";
import { Status } from "../types/enums";
import { ProjectsApi } from "../helpers/projectApi";
import { TaskApi } from "../helpers/taskApi";
import { Task } from "../models/task";
import LogoImage from "../components/images";
import { UserService } from "../services/userService";

const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get("storyId");

const currentUser = UserService.getLoggedInUser();

const taskApi = new TaskApi();
const projectApi = new ProjectsApi();

new Container("header-container", "task-page");
new Container("content-container", "task-page");

new LogoImage(
  "../assets/logo.svg",
  "Project logo",
  "logo-header",
  "header-container"
);

new BackButton("Story", "header-container");

const handleClick = (): void => {
  modal.open();
};
new AddButton("+", "add-task-btn", "content-container", handleClick);

new Container("tasks-container", "content-container");

new Container("tasks-container-todo", "tasks-container");
new Container("tasks-container-doing", "tasks-container");
new Container("tasks-container-done", "tasks-container");

new Label("ToDo", "todo-label", "tasks-container-todo");
new Label("Doing", "doing-label", "tasks-container-doing");
new Label("Done", "done-label", "tasks-container-done");

const modal = new Modal("add-form-modal", "content-container");
const taskForm = new TaskForm("task-form", storyId);

if (currentUser) {
  const userName = currentUser.name;
  const welcomeMessage = `<span>
      <img src="../assets/loggedUser.svg" alt="User icon" id="loggedIcon">
      Hello, ${userName}!
    </span>`;
  new Label(welcomeMessage, "welcome-label", "header-container");
}

taskForm.setOnSubmit(async (_event, task: Task) => {
  await taskApi.create(task);
  modal.close();
  location.reload();
});

const logoutButton = document.getElementById(
  "logout-button"
) as HTMLButtonElement;
if (logoutButton) {
  if (!UserService.isLoggedIn()) logoutButton.style.display = "none";
  logoutButton.addEventListener("click", async () => {
    await UserService.logoutUser();
    window.location.href = "./loginView.html";
  });
}

modal.setContent(taskForm.form);

window.onload = async () => {
  const currentProject = await projectApi.getActiveProject();
  
  new Label(
    currentProject?.name ?? "Project",
    "project-name-label",
    "header-container"
  );

  const tasks = await taskApi.getAllByStoryUuid(storyId);
  tasks.forEach((task) => {
    switch (task.status) {
      case Status.ToDo:
        new TaskItem("tasks-container-todo", task);
        break;
      case Status.Doing:
        new TaskItem("tasks-container-doing", task);
        break;
      case Status.Done:
        new TaskItem("tasks-container-done", task);
        break;
      default:
        break;
    }
  });
};
