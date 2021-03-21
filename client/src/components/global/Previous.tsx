import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { media, setColor } from '../../styles';

interface PreviousProps {
  link: string;
  previousTo: string;
  title: string;
}

const Previous: React.FC<PreviousProps> = ({ link, previousTo, title }) => {
  return (
    <Container>
      <PreviousContainer to={link}>
        <ArrowBackIosIcon fontSize='small' />
        <span>{previousTo}</span>
      </PreviousContainer>
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const PreviousContainer = styled(Link)`
  color: ${setColor.lightBlack};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: 0.2s ease-in-out;
  user-select: none;
  outline: none;
  span {
    font-weight: 600;
  }
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

const Title = styled.h3`
  margin: 0 15px;
  color: ${setColor.mainBlack};
  font-weight: 500;
  width: 500px;
  word-wrap: break-word;

  @media ${media.sm} {
    width: 400px;
  }
  @media ${media.xs} {
    width: 150px;
  }
`;

export default Previous;
