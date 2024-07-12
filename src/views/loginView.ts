import { LoginForm } from "../components/forms";
import { UserService } from "../services/userService";

const loginForm = new LoginForm("login-page");

document.addEventListener('DOMContentLoaded', (_event) => {
  const button = document.getElementById('registerButton') as HTMLButtonElement;
  button.addEventListener('click', () => {
      window.location.href = 'registerView.html';
  });
});

loginForm.setOnSubmit(async (_event, email, password) => {
  if (await UserService.loginUser(email, password)) {
    window.location.href = '/';
  } else {
    alert("wrong credentials");
  }
});
