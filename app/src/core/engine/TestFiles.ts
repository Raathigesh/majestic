import Engine from '.';
import { basename } from 'path';
const dirTree = require('directory-tree');
import { parse as parseJavaScript } from 'jest-editor-support';
const { parse: parseTypeScript } = require('jest-test-typescript-parser');
import { FileNode } from './types/FileNode';
import { ItBlock } from './types/ItBlock';

export default class TestFiles {
  engine: Engine;
  nodes: Map<string, FileNode>;
  files: FileNode[];

  constructor(engine: Engine) {
    this.engine = engine;
    this.nodes = new Map();
  }

  public read(path: string) {
    const files = dirTree(path, {
      exclude: /node_modules|\.git/
    });

    this.files = this.transform(files) || [];
    return this.files;
  }

  public transform(node: FileNode, parent?: FileNode) {
    if (!node.children) {
      return;
    }

    const children: FileNode[] = [];
    node.children.forEach(child => {
      const path = child.path;
      let treeNode;

      if (child.type === 'file' && !this.engine.testMatcher(path)) {
        return null;
      }

      if (this.nodes.get(path) && child.type === 'file') {
        treeNode = this.nodes.get(path);
      } else {
        treeNode = this.createFile(path, child);
      }

      if (!treeNode) {
        return null;
      }
      // treeNode.parent = parent;
      if (
        (child.type !== 'file' &&
          treeNode.children &&
          treeNode.children.length > 0) ||
        child.type === 'file'
      ) {
        children.push(treeNode);
      }

      if (child.type === 'file' && !this.nodes.get(path)) {
        this.nodes.set(path, treeNode);
      }
    });

    return children;
  }

  public getItBlocks(path: string): ItBlock[] {
    const parser = this.getParser(path);
    try {
      return parser(path).itBlocks;
    } catch (e) {
      return [];
    }
  }

  public applyRunResult() {
    return null;
  }

  private getParser(path: string) {
    const isTypeScript = path.match(/\.tsx?$/);
    return isTypeScript ? parseTypeScript : parseJavaScript;
  }

  private createFile(path: string, child: FileNode) {
    const node: FileNode = {
      label: basename(path),
      children: [],
      path,
      type: child.type,
      itBlocks: child.type === 'file' ? this.getItBlocks(path) : []
    };
    node.children = this.transform(child, node);
    return node;
  }
}
