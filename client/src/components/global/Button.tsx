import styled from 'styled-components';
import { setColor, setRem } from '../../styles';

interface ButtonProps {
  outline?: boolean;
}

export const Button = styled.button<ButtonProps>`
  background-color: ${({ outline }) =>
    outline ? setColor.mainWhite : setColor.primary};
  color: ${({ outline }) => (outline ? setColor.primary : setColor.mainWhite)};
  height: 50px;
  width: 150px;
  border: ${({ outline }) => (outline ? `solid ${setColor.primary}` : 'none')};
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: 0.3s ease-in-out;
  font-weight: 500;
  font-size: ${setRem(20)};
  &:hover {
    background-color: ${({ outline }) => !outline && setColor.primaryDark};
    border: ${({ outline }) => outline && `solid ${setColor.primaryDark}`};
    color: ${({ outline }) => outline && setColor.primaryDark};
  }

  &:active {
    background-color: ${({ outline }) => !outline && setColor.primary};
    border: ${({ outline }) => outline && `solid ${setColor.primary}`};
    transition: 0.1s ease-in-out;
  }
`;
