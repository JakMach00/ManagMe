class Modal {
  private overlay: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(idName: string, parentId: string) {
    this.overlay = document.createElement("div");
    this.overlay.id = idName;
    this.overlay.className = "modal-overlay";

    this.closeButton = document.createElement("button");
    this.closeButton.className = "modal-close-button";
    this.closeButton.textContent = "✖";
    this.closeButton.onclick = () => this.close();

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.appendChild(this.closeButton);

    this.overlay.appendChild(modalContent);

    const parent: HTMLElement | null = document.getElementById(parentId);
    if (parent) {
      parent.appendChild(this.overlay);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }

  public close(): void {
    this.overlay.style.display = "none";
  }

  public open(): void {
    this.overlay.style.display = "flex";
  }

  public setContent(content: HTMLElement): void {
    const modalContent = this.overlay.querySelector(".modal-content");
    if (modalContent) {
      modalContent.innerHTML = "";
      modalContent.appendChild(this.closeButton);
      modalContent.appendChild(content);
    }
  }
}

export default Modal;
