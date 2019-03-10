import React from "react";
import styled from "styled-components";
import { File, Folder, ChevronRight, ChevronDown } from "react-feather";
import { color } from "styled-system";
import { TreeNode } from "./transformer";
import ExecutionIndicator from "./execution-indicator";

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
  color: ${props => (props.failed ? "#ff4954" : null)};
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
  showFailedTests: boolean;
  collapsedItems: { [path: string]: boolean };
  setSelectedFile: (path: string) => void;
  isCollapsed: boolean;
  failedTests: string[];
  executingTests: string[];
  onToggle: (path: string, isCollapsed: boolean) => void;
}

export default function FileItem({
  item,
  selectedFile,
  showFailedTests,
  failedTests,
  executingTests,
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

  const isFailed = failedTests.indexOf(item.path) > -1;
  const isExecuting = executingTests.indexOf(item.path) > -1;

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
        failed={isFailed}
        selected={selectedFile === item.path}
        onClick={handleClick}
      >
        <Chevron size={11} />
        {!isExecuting && <Icon size={13} />}
        {isExecuting && <ExecutionIndicator />}
        <Label>{item.name}</Label>
      </Content>
      {item.children &&
        !isCollapsed &&
        item.children
          .filter(
            child =>
              (failedTests.indexOf(child.path) > -1 &&
                child.type === "file" &&
                showFailedTests) ||
              child.type === "directory" ||
              showFailedTests === false
          )
          .map(child => (
            <FileItem
              key={child.path}
              item={child}
              executingTests={executingTests}
              showFailedTests={showFailedTests}
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
