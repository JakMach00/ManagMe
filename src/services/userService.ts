import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { UserApi } from "../helpers/userApi";
import { User } from "../models/user";
import { auth } from "../helpers/firebase";
import { Role } from "../types/enums";

const userApi = new UserApi();
export class UserService {
  private static readonly USER_KEY = "loggedInUser";

  //@ts-ignore
  private static loggedInUser: User | null = null;

  static async loginUser(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = await userApi.get(userCredential.user.uid);

      if (user) {
        this.loggedInUser = user;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error loggin in:", error);
      return false;
    }
  }

  static async logoutUser() {
    try {
      await signOut(auth);
      this.loggedInUser = null;
      localStorage.removeItem(UserService.USER_KEY);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  static isLoggedIn(): boolean {
    return localStorage.getItem(UserService.USER_KEY) !== null;
  }

  static getLoggedInUser(): User | null {
    const userJSON = localStorage.getItem(UserService.USER_KEY);
    return userJSON ? JSON.parse(userJSON) : null;
  }

  static async registerUser(
    email: string,
    password: string,
    name: string,
    surname: string,
    role: Role
  ): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = new User(
        userCredential.user.uid,
        name,
        surname,
        email,
        role
      );

      await userApi.create(user);
      localStorage.setItem(UserService.USER_KEY, JSON.stringify(user));

      return true;
    } catch (error) {
      console.error("Error registering user:", error);
      return false;
    }
  }
}
