export const setColor = {
  mainWhite: '#FFFFFF',
  mainGrey: '#F0F0F0',
  mainBlack: '#272727',
  lightBlack: '#9F9F9F',
  mainRed: '#f50057',
  lightRed: '#ff9696',
  transparentRed: '#ffe6e6',
  darkRed: '#871818',
  primary: '#4463CC',
  primaryDark: '#374FA1',
  primaryLight: '#b0bff7',
  primaryTransparent: '#ebefff',
  secondary: '#4091E3',
};

export const setGradient = (directions: [string, string] = ['right', '']) => {
  return `linear-gradient(to ${directions.join(
    ' '
  )}, #4463c6, #406fce, #3e7ad6, #3e86dd, #4091e3)`;
};

export const setFont = {
  main: "font-family: 'Montserrat', sans-serif",
};

export const setRem = (number = 16) => {
  return `${number / 16}rem`;
};

export const setShadow = {
  main: '2px 2px 3px 0px rgba(126, 126, 126, 0.50)',
  hover: '3px 6px 3px 0px rgba(126, 126, 126, 0.25)',
};
