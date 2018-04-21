import * as React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { observer } from 'mobx-react';

const PrimaryElement = styled.button`
  border-radius: 3px;
  border: 0;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 6px;
  cursor: pointer;
  min-width: 150px;
  min-height: 31px;
  display: flex;
  align-self: auto;
  justify-content: center;
  align-items: center;
  font-weight: 600;

  &:hover {
    background-color: ${props => darken(0.1, props.theme.primary)};
  }

  &:active {
    background-color: ${props => darken(0.2, props.theme.primary)};
  }

  &:focus {
    outline: none;
  }
`;

const SecondaryElement = PrimaryElement.extend`
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.main};

  &:hover {
    background-color: ${props => darken(0.1, props.theme.secondary)};
  }

  &:active {
    background-color: ${props => darken(0.2, props.theme.secondary)};
  }
`;

const ButtonSpan = styled.span`
  margin-right: 10px;
  margin-top: 2px;
`;

interface ButtonProps {
  label: string;
  primary?: boolean;
  className?: string;
  icon?: any;
  isActive?: boolean;
  onClick?: () => void;
  children?: any;
}

function Button({
  label,
  primary,
  className,
  icon,
  isActive,
  onClick,
  children
}: ButtonProps) {
  const Element = primary ? PrimaryElement : SecondaryElement;
  return (
    <Element className={className} onClick={onClick}>
      {!children && (
        <React.Fragment>
          {icon && <ButtonSpan>{icon}</ButtonSpan>}
          <span>{label}</span>
        </React.Fragment>
      )}
      {children}
    </Element>
  );
}

export default observer(Button);
