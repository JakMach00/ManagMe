export class Label {
  private headerLabel: HTMLElement;

  constructor(htmlContent: string, idName: string, parentId: string) {
    this.headerLabel = document.createElement("p");
    this.headerLabel.innerHTML = htmlContent;
    this.headerLabel.id = idName;

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.headerLabel);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }
}

export class HeaderLabel {
  private headerLabel: HTMLElement;

  constructor(text: string, idName: string, parentId: string) {
    this.headerLabel = document.createElement("h1");
    this.headerLabel.innerText = text;
    this.headerLabel.id = idName;

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.headerLabel);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }
}
