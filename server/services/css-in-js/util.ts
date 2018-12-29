export const ColorPropertyType = "color";
export const BorderPropertyType = "border";

export function getTypeForCSSProperty(propertyName: string) {
  switch (propertyName) {
    case "background-color":
      return ColorPropertyType;
    case "border-top-color":
    case "border-top-width":
    case "border-top-style":
    case "border-right-color":
    case "border-right-width":
    case "border-right-style":
    case "border-left-color":
    case "border-left-width":
    case "border-left-style":
    case "border-bottom-color":
    case "border-bottom-width":
    case "border-bottom-style":
      return BorderPropertyType;
  }
}
