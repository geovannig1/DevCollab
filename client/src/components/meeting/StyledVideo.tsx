import styled from 'styled-components';
import { setColor } from '../../styles';

export const StyledVideo = styled.video`
  margin: 0 10px;
`;

export const StyledVideoContainer = styled.div`
  position: relative;
  width: 420px;
  height: 200px;
  margin: 0 10px;
  margin-top: 40px;
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
      margin: 0 3px;
    }
  }
`;
