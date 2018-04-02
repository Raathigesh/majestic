import { ItBlock } from './ItBlock';

export interface FileNode {
  label: string;
  children?: FileNode[];
  path: string;
  type: 'file' | 'directory';
  parent?: FileNode;
  itBlocks?: ItBlock[];
}
