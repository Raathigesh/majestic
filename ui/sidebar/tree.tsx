import React from "react";
import styled from "styled-components";
import { FixedSizeList as List } from "react-window";
import AutoResizer from "react-virtualized-auto-sizer";
import FileItem from "./file-item";
import { TreeNode } from "./transformer";

const FileTreeContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 173px);
  margin-left: -20px;
`;

interface Props {
  results: TreeNode[];
  selectedFile: string;
  onFileSelection: (path: string) => void;
  onToggle: (path: string, isCollapsed: boolean) => void;
}

export default function Tree({
  results,
  selectedFile,
  onFileSelection,
  onToggle
}: Props) {
  return (
    <FileTreeContainer>
      <AutoResizer>
        {({ height, width }: any) => {
          return (
            <List
              height={height - 90}
              itemCount={results.length}
              itemSize={20}
              width={width}
            >
              {({ index, style }: any) => (
                <FileItem
                  style={style}
                  key={results[index].path}
                  item={results[index]}
                  selectedFile={selectedFile}
                  setSelectedFile={onFileSelection}
                  onToggle={onToggle}
                />
              )}
            </List>
          );
        }}
      </AutoResizer>
    </FileTreeContainer>
  );
}
