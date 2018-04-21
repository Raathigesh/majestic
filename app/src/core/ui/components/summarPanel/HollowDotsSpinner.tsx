import * as React from 'react';
import styled from 'styled-components';
import { styledComponentWithProps } from '../../util/styled';

const HollowSpinnerDiv = styledComponentWithProps<
  {
    size: number;
    dotsNum: number;
    color: string;
    animationDuration: number;
    animationDelay: number;
  },
  HTMLDivElement
>(styled.div);

const HollowSpinner = HollowSpinnerDiv`
  height: ${props => props.size}px;
  width: ${props => 2 * props.size * props.dotsNum}px;
  .dot {
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    margin: 0 calc(${props => props.size}px / 2);
    border: calc(${props => props.size}px / 5) solid ${props => props.color};
    border-radius: 50%;
    float: left;
    transform: scale(0);
    animation: hollow-dots-spinner-animation
      ${props => props.animationDuration}ms ease infinite 0ms;
  }
  .dot:nth-child(1) {
    animation-delay: calc(${props => props.animationDelay}ms * 1);
  }
  .dot:nth-child(2) {
    animation-delay: calc(${props => props.animationDelay}ms * 2);
  }
  .dot:nth-child(3) {
    animation-delay: calc(${props => props.animationDelay}ms * 3);
  }
  @keyframes hollow-dots-spinner-animation {
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

function generateDots(num: number) {
  return Array.from({ length: num }).map((val, index) => (
    <div key={index} className="dot" />
  ));
}

const HollowDotsSpinner = () => {
  const dotsNum = 3;
  const animationDelay = 1000 * 0.3;

  return (
    <HollowSpinner
      size={13}
      color={'white'}
      animationDuration={1000}
      className={`hollow-dots-spinner`}
      dotsNum={dotsNum}
      animationDelay={animationDelay}
    >
      {generateDots(dotsNum)}
    </HollowSpinner>
  );
};

export default HollowDotsSpinner;
