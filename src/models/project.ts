export class Project {
  public uuid: string;
  public name: string;
  public description: string;
  public isActive: boolean;

  constructor(
    uuid: string,
    name: string,
    description: string,
    isActive: boolean = false
  ) {
    (this.uuid = uuid ?? crypto.randomUUID()),
      (this.name = name),
      (this.description = description),
      (this.isActive = isActive);
  }
}
