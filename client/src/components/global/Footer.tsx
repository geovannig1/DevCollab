import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { setColor } from '../../styles';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={className}>
      <p>Copyright © {dayjs().year()} Lintang Digdoyo</p>
    </footer>
  );
};

export default styled(Footer)`
  background-color: ${setColor.primary};
  color: ${setColor.mainGrey};
  height: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
