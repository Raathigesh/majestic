export class CouldNotResolveJestPath extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CouldNotResolveJestPath";
  }
}
