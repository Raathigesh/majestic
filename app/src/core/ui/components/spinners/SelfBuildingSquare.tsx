import * as React from 'react';
import styled from 'styled-components';
import { styledComponentWithProps } from '../../util/styled';

const BuildingSquareDiv = styledComponentWithProps<
  {
    size: number;
    color: string;
    animationDuration: number;
    initialTopPosition: number;
  },
  HTMLDivElement
>(styled.div);

const BuildingSquare = BuildingSquareDiv`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  top: ${props => -1 * props.initialTopPosition}px;
  * {
    box-sizing: border-box;
  }
  .square {
    height: ${props => props.size / 4}px;
    width: ${props => props.size / 4}px;
    top: ${props => -1 * props.initialTopPosition}px;
    margin-right: calc(${props => props.size / 4}px / 3);
    margin-top: calc(${props => props.size / 4}px / 3);
    background: ${props => props.color};
    float: left;
    position: relative;
    opacity: 0;
    animation: self-building-square-spinner
      ${props => props.animationDuration}ms infinite;
  }
  .square:nth-child(1) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 6);
  }
  .square:nth-child(2) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 7);
  }
  .square:nth-child(3) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 8);
  }
  .square:nth-child(4) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 3);
  }
  .square:nth-child(5) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 4);
  }
  .square:nth-child(6) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 5);
  }
  .square:nth-child(7) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 0);
  }
  .square:nth-child(8) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 1);
  }
  .square:nth-child(9) {
    animation-delay: calc(${props => props.animationDuration * 0.05}ms * 2);
  }
  .clear {
    clear: both;
  }
  @keyframes self-building-square-spinner {
    0% {
      opacity: 0;
    }
    5% {
      opacity: 1;
      top: 0;
    }
    50.9% {
      opacity: 1;
      top: 0;
    }
    55.9% {
      opacity: 0;
      top: inherit;
    }
  }
`;

function generateSpinners(num: number) {
  return Array.from({ length: num }).map((val, index) => (
    <div key={index} className={`square${index % 3 === 0 ? ' clear' : ''}`} />
  ));
}

interface SelfBuildingSquareSpinnerProps {
  color?: string;
}

function SelfBuildingSquareSpinner({
  color = 'white'
}: SelfBuildingSquareSpinnerProps) {
  const initialTopPosition = 14 / 6;

  return (
    <BuildingSquare
      size={14}
      color={color}
      animationDuration={1000}
      className={`self-building-square-spinner`}
      initialTopPosition={initialTopPosition}
    >
      {generateSpinners(9)}
    </BuildingSquare>
  );
}

export default SelfBuildingSquareSpinner;
