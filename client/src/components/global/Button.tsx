import styled from 'styled-components';
import { setColor, setRem } from '../../styles';

interface ButtonProps {
  outline?: boolean | number;
  small?: boolean | number;
  extrasmall?: boolean | number;
  danger?: boolean;
  size?: string;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  background-color: ${({ outline }) =>
    outline ? setColor.mainWhite : setColor.primary};
  color: ${({ outline }) => (outline ? setColor.primary : setColor.mainWhite)};
  min-width: ${({ extrasmall }) => (extrasmall ? '100px' : '135px')};
  padding: ${({ extrasmall }) => (extrasmall ? '5px' : '10px')};
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
  user-select: none;
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

export const RoundedButton = styled.button<ButtonProps>`
  background-color: ${({ danger }) =>
    danger ? setColor.mainWhite : setColor.primary};
  color: ${setColor.mainWhite};
  border: ${({ danger }) =>
    danger ? `2px solid ${setColor.mainRed}` : 'none'};
  height: ${({ size }) => size ?? '25'}px;
  width: ${({ size }) => size ?? '25'}px;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  outline: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  user-select: none;
  &:hover {
    background-color: ${({ danger }) =>
      danger ? setColor.transparentRed : setColor.primaryDark};
  }
  &:active {
    background-color: ${({ danger }) =>
      danger ? setColor.lightRed : setColor.primary};
  }
`;
