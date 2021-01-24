export const setColor = {
  mainWhite: '#FFFFFF',
  mainGrey: '#F0F0F0',
  mainBlack: '#272727',
  primary: '#4A58B2',
  primaryDark: '#2E397B',
  secondary: '#99A1D8',
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
