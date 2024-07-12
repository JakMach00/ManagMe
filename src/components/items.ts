import { Status, Priority } from "../types/enums";
import { Project } from "../models/project";
import { ProjectsApi } from "../helpers/projectApi";
import Modal from "./modal";
import { ProjectForm, StoryForm, TaskForm } from "./forms";
import { Story } from "../models/story";
import { StoriesApi } from "../helpers/storyApi";
import { UserApi } from "../helpers/userApi";
import { TaskApi } from "../helpers/taskApi";
import { Task } from "../models/task";

export class ProjectItem {
  private element: HTMLElement;
  private projectApi: ProjectsApi;
  private modal: Modal;

  constructor(parentId: string, project: Project) {
    this.projectApi = new ProjectsApi();
    this.modal = new Modal("edit-form-modal", "content-container");

    this.element = document.createElement("div");
    this.element.className = "project-item";

    if (project.isActive) {
      this.element.style.border = "1px solid #00ff00";
    }

    const title = document.createElement("h2");
    title.className = "project-item-title";
    title.textContent = project.name;
    title.onclick = async () => await this.navigateToProject(project);

    const desc = document.createElement("h4");
    desc.className = "project-item-desc";
    desc.textContent = project.description;

    const deleteButton = document.createElement("button");
    deleteButton.className = "project-item-delete";
    deleteButton.textContent = "x";
    deleteButton.onclick = () => this.deleteProject(project);

    const editButton = document.createElement("button");
    editButton.className = "project-item-edit";
    editButton.textContent = "Edit";
    editButton.onclick = () => this.openEditModal(project);

    this.element.appendChild(deleteButton);
    this.element.appendChild(title);
    this.element.appendChild(desc);
    this.element.appendChild(editButton);

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.element);
    } else {
      console.error(`Parent element with id "${parentId}" not found`);
    }
  }

  private async deleteProject(project: Project): Promise<void> {
    await this.projectApi.delete(project.uuid);
    this.element.remove();
  }

  private openEditModal(project: Project): void {
    const editForm = new ProjectForm("edit-project-form");
    editForm.setProjectData(project);

    editForm.setOnSubmit((_event: Event, updatedProject: Project) => {
      updatedProject.uuid = project.uuid;
      this.projectApi.update(updatedProject);
      this.modal.close();
      location.reload();
    });

    this.modal.setContent(editForm.form);
    this.modal.open();
  }

  private async navigateToProject(project: Project): Promise<void> {
    const allProjects = await this.projectApi.getAll();
    allProjects.forEach(async (p) => {
      p.isActive = false;
      await this.projectApi.update(p);
    });

    project.isActive = true;
    await this.projectApi.update(project);

    window.location.href = `src/views/storyView.html`;
  }
}

export class StoryItem {
  private element: HTMLElement;
  private storiesApi: StoriesApi;
  private modal: Modal;
  private userApi: UserApi = new UserApi();

  constructor(parentId: string, story: Story) {
    this.storiesApi = new StoriesApi();
    this.modal = new Modal("edit-form-modal", "content-container");

    this.element = document.createElement("div");
    this.element.className = "story-item";

    const title = document.createElement("h2");
    title.className = "story-item-title";
    title.textContent = story.name;
    title.onclick = () => this.navigateToStory(story);

    const desc = document.createElement("p");
    desc.className = "story-item-desc";
    desc.textContent = story.description;

    const priority = document.createElement("p");
    priority.className = "story-item-priority";
    priority.textContent = `Priority: ${Priority[story.priority]}`;
    priority.style.color = this.getPriorityColor(story.priority);

    const assignedUser = document.createElement("p");
    assignedUser.className = "story-item-assigned-user";

    this.setUserDetails(story.ownerUuid, assignedUser);

    const deleteButton = document.createElement("button");
    deleteButton.className = "story-item-delete";
    deleteButton.textContent = "x";
    deleteButton.onclick = () => this.deleteStory(story);

    const editButton = document.createElement("button");
    editButton.className = "story-item-edit";
    editButton.textContent = "Edit";
    editButton.onclick = () => this.openEditModal(story);

    this.element.appendChild(deleteButton);
    this.element.appendChild(title);
    this.element.appendChild(desc);
    this.element.appendChild(priority);
    this.element.appendChild(assignedUser);
    this.element.appendChild(editButton);

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.element);
    } else {
      console.error(`Parent element with id "${parentId}" not found`);
    }
  }

  private getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return "green";
      case Priority.Medium:
        return "orange";
      case Priority.High:
        return "red";
      default:
        return "black";
    }
  }

  private async setUserDetails(
    ownerUuid: string,
    assignedUserElement: HTMLElement
  ): Promise<void> {
    try {
      const user = await this.userApi.get(ownerUuid);
      if (user)
        assignedUserElement.textContent = `Assigned to: ${user.name} ${user.lastname}`;
    } catch (error) {
      console.error("Failed to fetch user details", error);
      assignedUserElement.textContent = "Assigned to: Unknown";
    }
  }

  private async deleteStory(story: Story): Promise<void> {
    await this.storiesApi.delete(story.uuid);
    this.element.remove();
  }

  private openEditModal(story: Story): void {
    const editForm = new StoryForm("edit-story-form");
    editForm.setStoryData(story);

    editForm.setOnSubmit(async (_event: Event, updatedStory: Story) => {
      updatedStory.uuid = story.uuid;
      await this.storiesApi.update(updatedStory);
      this.modal.close();
      location.reload();
    });

    this.modal.setContent(editForm.form);
    this.modal.open();
  }

  private navigateToStory(story: Story): void {
    window.location.href = `taskView.html?storyId=${story.uuid}`;
  }
}

export class TaskItem {
  private element: HTMLElement;
  private taskApi: TaskApi;
  private userApi: UserApi;
  private modal: Modal;

  constructor(parentId: string, task: Task) {
    this.taskApi = new TaskApi();
    this.userApi = new UserApi();
    this.modal = new Modal("edit-task-modal", "content-container");

    this.element = document.createElement("div");
    this.element.className = "task-item";

    const title = document.createElement("h2");
    title.className = "task-item-title";
    title.textContent = task.name;

    const desc = document.createElement("p");
    desc.className = "task-item-desc";
    desc.textContent = task.description;

    const hours = document.createElement("p");
    hours.className = "task-item-hours";
    hours.textContent = `Hours to complete: ${task.hoursToFinish + "h"}`;

    const priority = document.createElement("p");
    priority.className = "task-item-priority";
    priority.textContent = `Priority: ${Priority[task.priority]}`;

    const assignedUser = document.createElement("p");
    assignedUser.className = "task-item-assigned-user";
    this.setUserDetails(task.assignedUserUuid, assignedUser);
    priority.style.color = this.getPriorityColor(task.priority);

    const deleteButton = document.createElement("button");
    deleteButton.className = "task-item-delete";
    deleteButton.textContent = "x";
    deleteButton.onclick = () => this.deleteTask(task);

    const editButton = document.createElement("button");
    editButton.id = "task-item-edit";
    editButton.textContent = "Edit";
    editButton.onclick = () => this.openEditModal(task);
    if (task.status === Status.Done) editButton.style.visibility = "hidden";

    const finishButton = document.createElement("button");
    finishButton.id = "task-item-finish";
    finishButton.textContent = "Finish";
    finishButton.onclick = () => this.finishTask(task);
    if (task.status === Status.Done) finishButton.style.visibility = "hidden";

    this.element.appendChild(deleteButton);
    this.element.appendChild(title);
    this.element.appendChild(desc);
    this.element.appendChild(hours);
    this.element.appendChild(priority);
    this.element.appendChild(assignedUser);
    this.element.appendChild(editButton);
    if (task.assignedUserUuid) this.element.appendChild(finishButton);

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.element);
    } else {
      console.error(`Parent element with id "${parentId}" not found`);
    }
  }

  private getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return "green";
      case Priority.Medium:
        return "orange";
      case Priority.High:
        return "red";
      default:
        return "black";
    }
  }

  private async setUserDetails(
    userUuid: string | null,
    element: HTMLElement
  ): Promise<void> {
    if (userUuid) {
      try {
        const user = await this.userApi.get(userUuid);
        element.textContent = `Assigned to: ${user?.name} ${user?.lastname}`;
      } catch (error) {
        console.error("Failed to fetch user details", error);
        element.textContent = "Assigned to: Unknown";
      }
    } else {
      element.textContent = "Assigned to: Not assigned";
    }
  }

  private async deleteTask(task: Task) {
    await this.taskApi.delete(task.uuid);
    this.element.remove();
  }

  private openEditModal(task: Task): void {
    const editForm = new TaskForm("edit-task-form", task.storyUuid);
    editForm.setTaskData(task);

    editForm.setOnSubmit(async (_event: Event, updatedTask: Task) => {
      updatedTask.uuid = task.uuid;
      await this.taskApi.update(updatedTask);
      this.modal.close();
      location.reload();
    });

    this.modal.setContent(editForm.form);
    this.modal.open();
  }

  private async finishTask(task: Task) {
    task.status = Status.Done;
    task.finishDate = new Date();
    await this.taskApi.update(task);
    location.reload();
  }
}
