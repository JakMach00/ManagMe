import { UserService } from "../services/userService";

export class AddButton {
  private button: HTMLButtonElement;

  constructor(
    label: string,
    idName: string,
    parentId: string,
    onClick: () => void
  ) {
    this.button = document.createElement("button");
    this.button.textContent = label;
    this.button.id = idName;
    this.button.onclick = onClick;

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.button);
    } else {
      console.error('Parent element with id "${parentId}" not found');
    }
  }
}

export class BackButton {
  private button: HTMLButtonElement;

  constructor(buttonText: string, parentId: string) {
    this.button = document.createElement("button");
    this.button.className = "back-button";
    this.button.textContent = buttonText;
    this.button.onclick = () => this.goBack();

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.button);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }

  private goBack(): void {
    window.history.back();
  }
}

export class LoginButton {
  private button: HTMLButtonElement;

  constructor(idName: string, parentId: string) {
    this.button = document.createElement("button");
    this.button.textContent = "Login";
    this.button.id = idName;
    this.button.onclick = this.navigateToLoginPage.bind(this);
    if (UserService.isLoggedIn()) this.button.style.display = "none";

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.button);
    } else {
      console.error(`Parent element with id "${parentId}" not found`);
    }
  }

  private navigateToLoginPage(): void {
    window.location.href = `src/views/loginView.html`;
  }
}

export class RegisterButton {
  private button: HTMLButtonElement;

  constructor(idName: string, parentId: string) {
    this.button = document.createElement("button");
    this.button.textContent = "Register";
    this.button.id = idName;
    this.button.onclick = this.navigateToRegisterPage.bind(this);
    if (UserService.isLoggedIn()) this.button.style.display = "none";

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.button);
    } else {
      console.error(`Parent element with id "${parentId}" not found`);
    }
  }

  private navigateToRegisterPage(): void {
    window.location.href = `src/views/registerView.html`;
  }
}
