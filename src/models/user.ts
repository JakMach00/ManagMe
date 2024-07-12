import { Role } from "../types/enums";
import { v4 as uuidv4 } from "uuid";

export class User {
  public uuid: string;
  public name: string;
  public lastname: string;
  public email: string;
  public role: Role;

  constructor(
    uuid: string = uuidv4(),
    name: string,
    lastname: string,
    email: string,
    role: Role
  ) {
    this.uuid = uuid ?? uuidv4();
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.role = role;
  }
}
