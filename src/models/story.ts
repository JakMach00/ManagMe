import { Priority, Status } from "../types/enums";

export class Story {
  public uuid: string;
  public name: string;
  public description: string;
  public priority: Priority;
  public readonly createDate: Date;
  public status: Status;
  public projectUuid: string;
  public ownerUuid: string;

  constructor(
    uuid: string,
    name: string,
    description: string,
    priority: Priority,
    status: Status,
    createDate: Date,
    projectUuid: string,
    ownerUuid: string
  ) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.createDate = createDate;
    this.projectUuid = projectUuid;
    this.ownerUuid = ownerUuid;
  }
}
