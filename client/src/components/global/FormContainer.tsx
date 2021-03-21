import styled from 'styled-components';
import { media, setColor, setRem } from '../../styles';

export const Form = styled.form`
  word-wrap: break-word;
  margin-bottom: 10px;
  span {
    color: ${setColor.mainRed};
  }
  label {
    margin-bottom: 5px;
    margin-top: 10px;
    color: ${setColor.mainBlack};
    font-weight: 600;
    font-size: ${setRem(15)};
  }
`;

export const InputContainer = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => (width ? `${width}vw` : '45vw')};
  margin-bottom: 10px;
  margin-top: 5px;
  input {
    border-radius: 5px;
    height: 20px;
    padding: 15px;
    border: solid ${setColor.lightBlack} 1px;
    outline: none;
    &:focus {
      border-color: ${setColor.primary};
    }
    @media ${media.xs} {
      width: 200px;
    }
  }
  textarea {
    border-radius: 5px;
    padding: 10px;
    resize: none;
    border: solid ${setColor.lightBlack} 1px;
    outline: none;
    &:focus {
      border-color: ${setColor.primary};
    }
    @media ${media.xs} {
      width: 200px;
      height: 100px;
    }
  }
`;

export const FileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  input {
    outline: none;
  }

  @media ${media.sm} {
    width: 200px;
  }
`;

export const DateContaiener = styled.div`
  display: flex;
  flex-direction: column;
  width: 12vw;
  input {
    outline: none;
    padding: 5px;
    border-radius: 5px;
    border: solid ${setColor.lightBlack} 1px;
    &:focus {
      border-color: ${setColor.primary};
    }
  }

  @media ${media.sm} {
    width: 200px;
  }
`;
