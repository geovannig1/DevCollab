import React from 'react';
import styled from 'styled-components';

import { setColor, setShadow, setRem } from '../../styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

interface CardNoteProps {}

const CardNote: React.FC<CardNoteProps> = ({}) => {
  return (
    <Container>
      <CardContainer>
        <Title>Notes Title</Title>
        <Content>
          <Creator>By John Doe</Creator>
          <Date>1 hour ago</Date>
        </Content>
      </CardContainer>
      <StyledHoriz fontSize='large' />
    </Container>
  );
};

const Container = styled.div`
  height: 100px;
  width: 250px;
  position: relative;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
  height: 100%;
  background-color: ${setColor.mainWhite};
  border-radius: 8px;
  box-shadow: ${setShadow.main};
  transition: 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    box-shadow: ${setShadow.hover};
  }
  &:active {
    box-shadow: ${setShadow.main};
  }
`;

const Title = styled.h4`
  font-weight: 600;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  user-select: none;
`;

const Creator = styled.span`
  font-weight: 500;
  font-size: ${setRem(14)};
`;

const Date = styled.span`
  font-size: ${setRem(12)};
`;

const StyledHoriz = styled(MoreHorizIcon)`
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  color: ${setColor.lightBlack};
  transition: 0.2s ease-in-out;
  &:hover {
    color: ${setColor.mainBlack};
  }
  &:active {
    color: ${setColor.lightBlack};
  }
`;

export default CardNote;
