import { createGlobalStyle } from 'styled-components';
import { setColor, setFont } from '../../styles';

const GlobalStyle = createGlobalStyle`
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    body {
        ${setFont.main};
        background-color: ${setColor.mainWhite};
    }
    textarea, 
    input, 
    button, 
    select { 
        font-family: inherit; 
    }
`;

export default GlobalStyle;
