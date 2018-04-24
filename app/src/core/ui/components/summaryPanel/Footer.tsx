import * as React from 'react';
import styled from 'styled-components';
const { Settings } = require('react-feather');
import Button from '../button';
import { lighten } from 'polished';

const PreferenceButton = styled(Button)`
  padding: 1px;
  min-width: 108px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Version = styled.div`
  padding-top: 8px;
  color: ${props => lighten(0.4, props.theme.main)};
`;

interface FooterProps {
  version: number;
  onPreferenceClick: () => void;
}

export default function Footer({ version, onPreferenceClick }: FooterProps) {
  return (
    <Container>
      <Version>Version {version}</Version>
      <PreferenceButton
        label="Preference"
        icon={<Settings size={14} />}
        minimal={true}
        onClick={onPreferenceClick}
      />
    </Container>
  );
}
