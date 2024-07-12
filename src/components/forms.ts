import { Project } from "../models/project";
import { Role, Status, Priority } from "../types/enums";
import { Story } from "../models/story";
import { UserApi } from "../helpers/userApi";
import { ProjectsApi } from "../helpers/projectApi";
import { Task } from "../models/task";

export class LoginForm {
  public form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;

  constructor(parentId: string) {
    this.form = document.createElement("form");
    this.form.className = "login-form";

    this.emailInput = document.createElement("input");
    this.emailInput.type = "email";
    this.emailInput.placeholder = "Email";
    this.emailInput.name = "email";
    this.emailInput.required = true;

    this.passwordInput = document.createElement("input");
    this.passwordInput.type = "password";
    this.passwordInput.placeholder = "Password";
    this.passwordInput.name = "password";
    this.passwordInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Login";

    this.form.appendChild(this.emailInput);
    this.form.appendChild(this.passwordInput);
    this.form.appendChild(submitButton);

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.form);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }

  public setOnSubmit(
    onSubmitHandler: (event: Event, email: string, password: string) => void
  ): void {
    this.form.onsubmit = (event: Event) => {
      event.preventDefault();
      const email = this.emailInput.value;
      const password = this.passwordInput.value;
      onSubmitHandler(event, email, password);
    };
  }
}

export class ProjectForm {
  public form: HTMLFormElement;
  private projectInput: HTMLInputElement;
  private descInput: HTMLInputElement;

  constructor(idName: string) {
    this.form = document.createElement("form");
    this.form.className = "form-component";
    this.form.id = idName;

    this.projectInput = document.createElement("input");
    this.projectInput.type = "text";
    this.projectInput.placeholder = "Enter project name";
    this.projectInput.name = "projectName";

    this.descInput = document.createElement("input");
    this.descInput.type = "text";
    this.descInput.placeholder = "Enter project description";
    this.descInput.name = "projectDescription";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    this.form.appendChild(this.projectInput);
    this.form.appendChild(this.descInput);
    this.form.appendChild(submitButton);
  }

  public setOnSubmit(
    onSubmitHandler: (event: Event, project: Project) => void
  ): void {
    this.form.onsubmit = (event: Event) => {
      event.preventDefault();
      const project = new Project(
        crypto.randomUUID(),
        this.projectInput.value,
        this.descInput.value
      );
      this.projectInput.value = "";
      this.descInput.value = "";
      onSubmitHandler(event, project);
    };
  }

  public setProjectData(project: Project): void {
    this.projectInput.value = project.name;
    this.descInput.value = project.description;
  }
}

export class RegisterForm {
  public form: HTMLFormElement;
  private nameInput: HTMLInputElement;
  private surnameInput: HTMLInputElement;
  private emailInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private roleSelect: HTMLSelectElement;

  constructor(parentId: string) {
    this.form = document.createElement("form");
    this.form.className = "login-form";

    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.placeholder = "Enter your name";
    this.nameInput.name = "name";
    this.nameInput.required = true;

    this.surnameInput = document.createElement("input");
    this.surnameInput.type = "text";
    this.surnameInput.placeholder = "Enter your surname";
    this.surnameInput.name = "name";
    this.surnameInput.required = true;

    this.emailInput = document.createElement("input");
    this.emailInput.type = "email";
    this.emailInput.placeholder = "Email";
    this.emailInput.name = "email";
    this.emailInput.required = true;

    this.passwordInput = document.createElement("input");
    this.passwordInput.type = "password";
    this.passwordInput.placeholder = "Password";
    this.passwordInput.name = "password";
    this.passwordInput.required = true;

    this.roleSelect = document.createElement("select");
    this.roleSelect.name = "role";
    Object.keys(Role)
      .filter((key) => isNaN(Number(key)))
      .forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        this.roleSelect.appendChild(option);
      });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Register";

    this.form.appendChild(this.nameInput);
    this.form.appendChild(this.surnameInput);
    this.form.appendChild(this.emailInput);
    this.form.appendChild(this.passwordInput);
    this.form.appendChild(this.roleSelect);
    this.form.appendChild(submitButton);

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.form);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }

  public setOnSubmit(
    onSubmitHandler: (
      event: Event,
      name: string,
      surname: string,
      email: string,
      password: string,
      role: Role
    ) => void
  ): void {
    this.form.onsubmit = (event: Event) => {
      event.preventDefault();
      const name = this.nameInput.value;
      const surname = this.surnameInput.value;
      const email = this.emailInput.value;
      const password = this.passwordInput.value;
      const role = Role[this.roleSelect.value as keyof typeof Role];
      onSubmitHandler(event, name, surname, email, password, role);
    };
  }
}

export class StoryForm {
  public form: HTMLFormElement;
  private nameInput: HTMLInputElement;
  private descriptionInput: HTMLInputElement;
  private prioritySelect: HTMLSelectElement;
  private statusSelect: HTMLSelectElement;
  private ownerSelect: HTMLSelectElement;
  private usersApi: UserApi;
  private projectApi: ProjectsApi;
  private ownerSelectPopulated: Promise<void>;

  constructor(idName: string) {
    this.form = document.createElement("form");
    this.form.className = "form-component";
    this.form.id = idName;

    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.placeholder = "Enter story name";
    this.nameInput.name = "storyName";

    this.descriptionInput = document.createElement("input");
    this.descriptionInput.type = "text";
    this.descriptionInput.placeholder = "Enter story description";
    this.descriptionInput.name = "storyDescription";

    this.prioritySelect = document.createElement("select");
    this.prioritySelect.name = "priority";
    Object.keys(Priority)
      .filter((key) => isNaN(Number(key)))
      .forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        this.prioritySelect.appendChild(option);
      });

    this.statusSelect = document.createElement("select");
    this.statusSelect.name = "status";
    Object.keys(Status)
      .filter((key) => isNaN(Number(key)))
      .forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        this.statusSelect.appendChild(option);
      });

    this.ownerSelect = document.createElement("select");
    this.ownerSelect.name = "ownerUuid";

    this.usersApi = new UserApi();
    this.projectApi = new ProjectsApi();
    this.ownerSelectPopulated = this.populateOwnerSelect();

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    this.form.appendChild(this.nameInput);
    this.form.appendChild(this.descriptionInput);
    this.form.appendChild(this.prioritySelect);
    this.form.appendChild(this.statusSelect);
    this.form.appendChild(this.ownerSelect);
    this.form.appendChild(submitButton);
  }

  private async populateOwnerSelect() {
    const users = await this.usersApi.getAll();
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.uuid;
      option.textContent = `${user.name} ${user.lastname} - ${Role[user.role]}`;
      this.ownerSelect.appendChild(option);
    });
  }

  public async setOnSubmit(
    onSubmitHandler: (event: Event, story: Story) => void
  ) {
    this.form.onsubmit = async (event: Event) => {
      event.preventDefault();

      const activeProject = await this.projectApi.getActiveProject();
      console.info(activeProject);

      if (activeProject) {
        const story = new Story(
          crypto.randomUUID(),
          this.nameInput.value,
          this.descriptionInput.value,
          Priority[this.prioritySelect.value as keyof typeof Priority],
          Status[this.statusSelect.value as keyof typeof Status],
          new Date(),
          activeProject.uuid,
          this.ownerSelect.value
        );

        this.clearForm();
        onSubmitHandler(event, story);
      } else {
        console.error("No active project found");
      }
    };
  }

  public async setStoryData(story: Story): Promise<void> {
    await this.ownerSelectPopulated;

    this.nameInput.value = story.name;
    this.descriptionInput.value = story.description;
    this.prioritySelect.value = Priority[
      story.priority
    ] as keyof typeof Priority;
    this.statusSelect.value = Status[story.status] as keyof typeof Status;
    this.ownerSelect.value = story.ownerUuid;
  }

  private clearForm(): void {
    this.nameInput.value = "";
    this.descriptionInput.value = "";
    this.prioritySelect.value = "";
    this.statusSelect.value = "";
    this.ownerSelect.value = "";
  }
}

export class TaskForm {
  public form: HTMLFormElement;
  private nameInput: HTMLInputElement;
  private descriptionInput: HTMLInputElement;
  private hoursToCompleteInput: HTMLInputElement;
  private prioritySelect: HTMLSelectElement;
  private ownerSelect: HTMLSelectElement;
  private statusSelect: HTMLSelectElement;
  private usersApi: UserApi;
  private storyUuid: string | null;

  constructor(idName: string, storyUuid: string | null) {
    this.form = document.createElement("form");
    this.form.className = "form-component";
    this.form.id = idName;

    this.storyUuid = storyUuid;

    this.nameInput = document.createElement("input");
    this.nameInput.type = "text";
    this.nameInput.placeholder = "Enter task name";
    this.nameInput.name = "taskName";

    this.descriptionInput = document.createElement("input");
    this.descriptionInput.type = "text";
    this.descriptionInput.placeholder = "Enter task description";
    this.descriptionInput.name = "taskDescription";

    this.hoursToCompleteInput = document.createElement("input");
    this.hoursToCompleteInput.type = "text";
    this.hoursToCompleteInput.placeholder = "Enter expected hours to complete";
    this.hoursToCompleteInput.name = "taskHoursToComplete";

    this.prioritySelect = document.createElement("select");
    this.prioritySelect.name = "priority";
    Object.keys(Priority)
      .filter((key) => isNaN(Number(key)))
      .forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        this.prioritySelect.appendChild(option);
      });

    this.ownerSelect = document.createElement("select");
    this.ownerSelect.name = "ownerUuid";

    this.statusSelect = document.createElement("select");
    this.statusSelect.name = "status";
    Object.keys(Status)
      .filter((key) => isNaN(Number(key)))
      .forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        this.statusSelect.appendChild(option);
      });

    this.usersApi = new UserApi();
    this.populateOwnerSelect();

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";

    this.form.appendChild(this.nameInput);
    this.form.appendChild(this.descriptionInput);
    this.form.appendChild(this.hoursToCompleteInput);
    this.form.appendChild(this.prioritySelect);
    this.form.appendChild(this.ownerSelect);
    this.form.appendChild(this.statusSelect);
    this.form.appendChild(submitButton);
  }

  private async populateOwnerSelect() {
    let users = await this.usersApi.getAll();
    users = users.filter(
      (x) => x.role === Role.Developer || x.role === Role.Devops
    );
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.uuid;
      option.textContent = `${user.name} ${user.lastname} - ${Role[user.role]}`;
      this.ownerSelect.appendChild(option);
    });
  }

  public setOnSubmit(
    onSubmitHandler: (event: Event, task: Task) => void
  ): void {
    this.form.onsubmit = (event: Event) => {
      event.preventDefault();
      console.log(`Value ${this.prioritySelect.value}`);
      const task = new Task(
        crypto.randomUUID(),
        this.nameInput.value,
        this.descriptionInput.value,
        Priority[this.prioritySelect.value as keyof typeof Priority],
        this.storyUuid,
        Number(this.hoursToCompleteInput.value),
        Status[this.statusSelect.value as keyof typeof Status],
        new Date(),
        null,
        null,
        null
      );
      if (this.ownerSelect.value) {
        task.assignedUserUuid = this.ownerSelect.value;
        task.startDate = new Date();
      }
      this.clearForm();
      onSubmitHandler(event, task);
    };
  }

  public setTaskData(task: Task): void {
    this.populateOwnerSelect();
    this.nameInput.value = task.name;
    this.descriptionInput.value = task.description;
    this.hoursToCompleteInput.value = task.hoursToFinish.toString();
    this.prioritySelect.value = Priority[task.priority];
    this.ownerSelect.value = task.assignedUserUuid ?? "";
    this.statusSelect.value = Status[task.status];
    this.ownerSelect.style.visibility = "visible";
  }

  private clearForm(): void {
    this.nameInput.value = "";
    this.descriptionInput.value = "";
    this.hoursToCompleteInput.value = "";
    this.prioritySelect.value = "";
    this.ownerSelect.value = "";
    this.statusSelect.value = "";
  }
}
