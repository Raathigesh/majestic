import React from "react";
import styled from "styled-components";
import { File, Folder, ChevronRight, ChevronDown } from "react-feather";
import { color } from "styled-system";
import { TreeNode } from "./transformer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  ${color};
`;

const Content = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 1.5px;
  cursor: pointer;
  color: ${props => (props.selected ? "#FF4954" : null)};
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
  onToggle: (path: string, isCollapsed: boolean) => void;
}

export default function FileItem({
  item,
  selectedFile,
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
    setSelectedFile(item.path);

    if (item.children) {
      onToggle(item.path, !isCollapsed);
    }
  };

  return (
    <Container>
      <Content selected={selectedFile === item.path} onClick={handleClick}>
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
