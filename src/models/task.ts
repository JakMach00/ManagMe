import { Priority, Status } from "../types/enums";

export class Task {
  public uuid: string;
  public name: string;
  public description: string;
  public priority: Priority;
  public storyUuid: string | null;
  public hoursToFinish: number;
  public status: Status;
  public readonly createDate: Date;
  public startDate: Date | null;
  public finishDate: Date | null;
  public assignedUserUuid: string | null;

  constructor(
    uuid: string,
    name: string,
    description: string,
    priority: Priority,
    storyUuid: string | null,
    hoursToFinish: number,
    status: Status,
    createDate: Date,
    startDate: Date | null,
    finishDate: Date | null,
    assignedUserUuid: string | null
  ) {
    (this.uuid = uuid), (this.name = name), (this.description = description);
    this.priority = priority;
    this.storyUuid = storyUuid;
    this.hoursToFinish = hoursToFinish;
    this.status = status;
    this.createDate = createDate;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.assignedUserUuid = assignedUserUuid;
  }
}
