import styled from 'styled-components';
import { setColor, setRem } from '../../styles';

interface ButtonProps {
  outline?: boolean | number;
  small?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  background-color: ${({ outline, small }) =>
    outline ? setColor.mainWhite : setColor.primary};
  color: ${({ outline }) => (outline ? setColor.primary : setColor.mainWhite)};
  min-width: 135px;
  padding: 10px;
  border: ${({ outline }) => (outline ? `solid ${setColor.primary}` : 'none')};
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: 0.3s ease-in-out;
  font-weight: 500;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  font-size: ${({ small }) => (small ? setRem(14) : setRem(20))};
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
