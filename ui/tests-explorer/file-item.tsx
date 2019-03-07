import React from "react";
import styled from "styled-components";
import { File, Folder, ChevronRight, ChevronDown } from "react-feather";
import { color } from "styled-system";
import { TreeNode } from "./transformer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  ${color};
`;

const Content = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 2.5px;
  cursor: pointer;
  color: ${props => (props.failed ? "red" : null)};
  background-color: ${props => (props.selected ? "#444444" : null)};
  border-radius: 3px;
  margin-bottom: 2px;

  &:hover {
    background-color: #444444;
  }
`;

const Label = styled.div`
  margin-left: 5px;
  font-size: 14px;
`;

const EmptyChevron = styled.div`
  width: 5px;
`;

interface Props {
  item: TreeNode;
  selectedFile: string;
  collapsedItems: { [path: string]: boolean };
  setSelectedFile: (path: string) => void;
  isCollapsed: boolean;
  failedTests: string[];
  onToggle: (path: string, isCollapsed: boolean) => void;
}

export default function FileItem({
  item,
  selectedFile,
  failedTests,
  collapsedItems,
  setSelectedFile,
  onToggle,
  isCollapsed
}: Props) {
  const Icon = item.type === "directory" ? Folder : File;
  let Chevron: any = EmptyChevron;
  if (item.children && item.children.length) {
    Chevron = isCollapsed ? ChevronRight : ChevronDown;
  }

  const handleClick = () => {
    if (item.type === "file") {
      setSelectedFile(item.path);
    }

    if (item.children) {
      onToggle(item.path, !isCollapsed);
    }
  };

  return (
    <Container>
      <Content
        failed={failedTests.indexOf(item.path) > -1}
        selected={selectedFile === item.path}
        onClick={handleClick}
      >
        <Chevron size={11} />
        <Icon size={13} />
        <Label>{item.name}</Label>
      </Content>
      {item.children &&
        !isCollapsed &&
        item.children.map(child => (
          <FileItem
            key={child.path}
            item={child}
            failedTests={failedTests}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isCollapsed={collapsedItems[child.path]}
            collapsedItems={collapsedItems}
            onToggle={onToggle}
          />
        ))}
    </Container>
  );
}
