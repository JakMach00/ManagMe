export class Container {
  private container: HTMLDivElement;

  constructor(idName: string, parentId: string) {
    this.container = document.createElement("div");
    this.container.id = idName;

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.container);
    } else {
      console.error('Parent element with id "${parentId}" not found');
    }
  }
}

export default Container;
