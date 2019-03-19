import React from "react";
import styled from "styled-components";
import {
  File,
  Folder,
  ChevronRight,
  ChevronDown,
  Frown,
  ZapOff
} from "react-feather";
import { color } from "styled-system";
import { TreeNode } from "./transformer";
import ExecutionIndicator from "./execution-indicator";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  ${color};
`;

const Content = styled.div<any>`
  display: flex;
  align-items: center;
  padding: 2.5px;
  cursor: pointer;
  color: ${props =>
    props.failed ? "#FE5339" : props.passing ? "#19E28D" : null};
  background-color: ${props => (props.selected ? "#444444" : null)};
  border-radius: 3px;
  margin-bottom: 2px;
  font-weight: 600;
  margin-left: ${props => `${props.hierarchy * 15}px`}

  &:hover {
    background-color: #444444;
  }
`;

const Label = styled.div`
  margin-left: 5px;
  font-size: 12px;
`;

const EmptyChevron = styled.div`
  width: 5px;
`;

const ExecutionWrapper = styled.div`
  margin-top: 11px;
`;

interface Props {
  item: TreeNode;
  style: any;
  selectedFile: string;
  setSelectedFile: (path: string) => void;
  onToggle: (path: string, isCollapsed: boolean) => void;
}

export default function FileItem({
  item,
  selectedFile,
  setSelectedFile,
  onToggle,
  style
}: Props) {
  const Icon =
    item.type === "directory" ? Folder : item.haveFailure ? ZapOff : File;
  let Chevron: any = EmptyChevron;
  if (item.type === "directory") {
    Chevron = item.isCollapsed ? ChevronRight : ChevronDown;
  }

  const handleClick = () => {
    if (item.type === "file") {
      setSelectedFile(item.path);
    }

    if (item.type === "directory") {
      onToggle(item.path, !item.isCollapsed);
    }
  };

  return (
    <Container style={style}>
      <Content
        hierarchy={item.hierarchy}
        passing={item.passing}
        failed={item.haveFailure}
        selected={selectedFile === item.path}
        onClick={handleClick}
      >
        <Chevron size={11} />
        {!item.isExecuting && <Icon size={11} />}
        {item.isExecuting && (
          <ExecutionWrapper>
            <ExecutionIndicator />
          </ExecutionWrapper>
        )}
        <Label>{item.name}</Label>
      </Content>
    </Container>
  );
}
