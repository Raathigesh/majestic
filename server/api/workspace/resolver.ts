import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Workspace } from "./workspace";
import Project from "../../services/project";
import { root } from "../../services/cli";
import JestManager from "../../services/jest-manager";
import { TestFile } from "./test-file";
import { inspect } from "../../services/ast/inspector";

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

  @Query(returns => TestFile)
  file(@Arg("path") path: string) {
    const file = new TestFile();
    inspect(path);
    return file;
  }
}
