import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Subscription,
  PubSubEngine,
  PubSub,
  Root
} from "type-graphql";
import ComponentFile from "../../../types/component-file/type";
import {
  getSyledDeclarations,
  updateCSSProperty
} from "../../services/css-in-js";
import StyleDeclaration from "../../../types/style-declaration/type";

@Resolver(ComponentFile)
export default class ComponentFileResolver {
  @Query(returns => ComponentFile)
  async getStyledComponents(@Arg("path") path: string) {
    const componentFile = new ComponentFile();
    componentFile.path = path;
    componentFile.styledComponents = await getSyledDeclarations(path);
    return componentFile;
  }

  @Mutation(returns => ComponentFile)
  async updateCSSVariable(
    @Arg("path") path: string,
    @Arg("name") name: string,
    @Arg("property") property: string,
    @Arg("value") value: string,
    @PubSub() pubSub: PubSubEngine
  ): Promise<ComponentFile> {
    const result = await updateCSSProperty(path, name, property, value);

    const componentFile = new ComponentFile();
    componentFile.path = path;
    componentFile.styledComponents = await getSyledDeclarations(path);
    return componentFile;
  }

  @Subscription(returns => ComponentFile, {
    topics: "FILE_CHANGE"
  })
  async changeToFile(@Root() filePath: string): Promise<ComponentFile> {
    const componentFile = new ComponentFile();
    componentFile.path = filePath;
    componentFile.styledComponents = await getSyledDeclarations(filePath);
    return componentFile;
  }
}
