import styled from 'styled-components';
import { setColor, setRem } from '../../styles';

interface ButtonProps {
  outline?: boolean | number;
  small?: boolean | number;
  extrasmall?: boolean | number;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  background-color: ${({ outline }) =>
    outline ? setColor.mainWhite : setColor.primary};
  color: ${({ outline }) => (outline ? setColor.primary : setColor.mainWhite)};
  min-width: ${({ extrasmall }) => (extrasmall ? '100px' : '135px')};
  padding: ${({ extrasmall }) => (extrasmall ? '8px' : '10px')};
  border: solid ${setColor.primary} 2px;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: 0.3s ease-in-out;
  font-weight: 600;
  text-decoration: none;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: ${({ small, extrasmall }) =>
    (extrasmall && setRem(13)) ?? (small ? setRem(14) : setRem(20))};
  &:hover {
    background-color: ${({ outline }) =>
      outline ? setColor.primaryTransparent : setColor.primaryDark};
    border: ${({ outline }) => outline && `solid ${setColor.primaryDark} 2px`};
    color: ${({ outline }) => outline && setColor.primaryDark};
  }

  &:active {
    background-color: ${({ outline }) =>
      outline ? setColor.primaryLight : setColor.primary};
    border: ${({ outline }) => outline && `solid ${setColor.primary} 2px`};
    transition: 0.1s ease-in-out;
  }
`;
