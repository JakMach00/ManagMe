import Modal from "../components/modal";
import Container from "../components/container";
import { Label } from "../components/labels";
import { AddButton, BackButton } from "../components/buttons";
import { StoryForm } from "../components/forms";
import { StoryItem } from "../components/items";
import { ProjectsApi } from "../helpers/projectApi";
import { StoriesApi } from "../helpers/storyApi";
import { Story } from "../models/story";
import { Status } from "../types/enums";
import LogoImage from "../components/images";
import { UserService } from "../services/userService";

const currentUser = UserService.getLoggedInUser();

const projectApi = new ProjectsApi();
const storiesApi = new StoriesApi();

new Container("header-container", "project-page");
new Container("content-container", "project-page");

new LogoImage(
  "../assets/logo.svg",
  "Project logo",
  "logo-header",
  "header-container"
);

new BackButton("Projects", "header-container");

const handleClick = (): void => {
  modal.open();
};

new AddButton("+", "add-story-btn", "content-container", handleClick);

new Container("stories-container", "content-container");

new Container("stories-container-todo", "stories-container");
new Container("stories-container-doing", "stories-container");
new Container("stories-container-done", "stories-container");

new Label("ToDo", "todo-label", "stories-container-todo");
new Label("Doing", "doing-label", "stories-container-doing");
new Label("Done", "done-label", "stories-container-done");

const modal = new Modal("add-form-modal", "content-container");
const storyForm = new StoryForm("story-form");

if (currentUser) {
  const userName = currentUser.name;
  const welcomeMessage = `<span>
      <img src="../assets/loggedUser.svg" alt="User icon" id="loggedIcon">
      Hello, ${userName}!
    </span>`;
  new Label(welcomeMessage, "welcome-label", "header-container");
}

storyForm.setOnSubmit(async (_event, story: Story) => {
  await storiesApi.create(story);
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

modal.setContent(storyForm.form);

window.onload = async () => {
  try {
    const currentProject = await projectApi.getActiveProject();

    if (currentProject) {
      const stories = await storiesApi.getAllByProjectsUuid(
        currentProject.uuid
      );

      console.info(stories);

      stories.forEach((story) => {
        switch (story.status) {
          case Status.ToDo:
            new StoryItem("stories-container-todo", story);
            break;
          case Status.Doing:
            new StoryItem("stories-container-doing", story);
            break;
          case Status.Done:
            new StoryItem("stories-container-done", story);
            break;
          default:
            break;
        }
      });

      new Label(
        currentProject.name ?? "Project",
        "project-name-label",
        "header-container"
      );
    } else {
      console.error("No active project found");
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};
