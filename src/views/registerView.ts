import { RegisterForm } from "../components/forms";
import { UserService } from "../services/userService";

const registerForm = new RegisterForm("register-page");

registerForm.setOnSubmit(
  async (_event, name, surname, email, password, role) => {
    if (await UserService.registerUser(email, password, name, surname, role)) {
      window.history.back();
    }
  }
);

document.addEventListener('DOMContentLoaded', (_event) => {
  const button = document.getElementById('loginButton') as HTMLButtonElement;
  button.addEventListener('click', () => {
      window.location.href = 'loginView.html';
  });
});