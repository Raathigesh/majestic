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
  color: ${props => (props.selected ? "wheat" : null)};
`;

const Label = styled.div`
  margin-left: 5px;
`;

const EmptyChevron = styled.div`
  width: 5px;
`;

interface Props {
  item: TreeNode;
  selectedFile: string;
  expandedItems: { [path: string]: boolean };
  setSelectedFile: (path: string) => void;
  isExpanded: boolean;
  onToggle: (path: string, isExpanded: boolean) => void;
}

export default function FileItem({
  item,
  selectedFile,
  expandedItems,
  setSelectedFile,
  onToggle,
  isExpanded
}: Props) {
  const Icon = item.type === "directory" ? Folder : File;
  let Chevron: any = EmptyChevron;
  if (item.children && item.children.length) {
    Chevron = isExpanded === false ? ChevronRight : ChevronDown;
  }

  const handleClick = () => {
    setSelectedFile(item.path);

    if (item.children) {
      onToggle(item.path, isExpanded);
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
        isExpanded !== false &&
        item.children.map(child => (
          <FileItem
            key={child.path}
            item={child}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isExpanded={expandedItems[child.path]}
            expandedItems={expandedItems}
            onToggle={onToggle}
          />
        ))}
    </Container>
  );
}
