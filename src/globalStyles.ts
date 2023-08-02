import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    font-family: 'Kanit', sans-serif;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;
