import * as React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
const { Planet } = require('react-kawaii');

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
`;

const MidContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HintText = styled.div`
  margin-top: 10px;
  color: ${props => lighten(0.1, props.theme.text)};
  font-weight: 600;
  font-size: 17px;
`;

export default function Empty() {
  return (
    <Container>
      <MidContainer>
        <Planet
          size={100}
          mood="happy"
          color="#EBEDF0"
          showTextOnHover={false}
        />
        <HintText>Select a file to begin</HintText>
      </MidContainer>
    </Container>
  );
}
