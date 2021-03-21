import styled from 'styled-components';
import { media, setColor } from '../../styles';

export const StyledVideo = styled.video`
  margin: 0 10px;
  background-color: ${setColor.mediumBlack};
`;

export const StyledVideoContainer = styled.div`
  position: relative;
  width: 420px;
  height: 200px;
  margin: 0 10px;
  margin-bottom: 10px;
  user-select: none;
  span {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 5px 20px;
    font-weight: 500;
    background-color: ${setColor.mainBlack};
    color: ${setColor.mainWhite};
    opacity: 60%;
    display: flex;
    align-items: center;
    svg {
      color: ${setColor.mainRed};
      margin-right: 2px;
    }
  }
`;

export const StyledShareScreen = styled.video`
  height: 50%;
  position: absolute;
  left: 20px;
  bottom: 80px;

  @media ${media.sm} {
    height: 20%;
  }
`;
