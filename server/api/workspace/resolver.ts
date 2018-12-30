import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Workspace } from "./workspace";
import Project from "../../services/project";
import { root } from "../../services/cli";
import JestManager from "../../services/jest-manager";

@Resolver(Workspace)
export default class WorkspaceResolver {
  private project: Project;
  private jestManager: JestManager;

  constructor() {
    this.project = new Project(root);
    this.jestManager = new JestManager(this.project);
  }

  @Query(returns => Workspace)
  workspace() {
    const workspace = new Workspace();
    workspace.projectRoot = this.project.projectRoot;
    workspace.name = "Jest project";

    const jestConfig = this.jestManager.getConfig();
    const fileMap = this.project.readTestFiles(jestConfig);
    workspace.files = Object.entries(fileMap).map(([key, value]) => ({
      name: value.name,
      path: value.path,
      parent: value.parent,
      type: value.type
    }));

    return workspace;
  }
}
