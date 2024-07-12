export class LogoImage {
  private logoImage: HTMLElement;

  constructor(src: string, altText: string, idName: string, parentId: string) {
    this.logoImage = document.createElement("img");
    this.logoImage.setAttribute("src", src);
    this.logoImage.setAttribute("alt", altText);
    this.logoImage.id = idName;
    this.logoImage.style.width = "16rem"

    const parent: HTMLElement | null = document.getElementById(parentId);
    console.log(parent);
    if (parent) {
      parent.appendChild(this.logoImage);
    } else {
      console.error(`Parent element with id "${parentId}" not found.`);
    }
  }
}

export default LogoImage