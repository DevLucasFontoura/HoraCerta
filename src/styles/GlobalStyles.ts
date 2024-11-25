import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
    color: #333;
  }

  button {
    font-family: inherit;
  }

  :root {
    --primary: #007bff;
    --primary-light: #f0f7ff;
    --danger: #dc3545;
    --danger-light: #fff1f1;
    --text: #333;
    --text-light: #666;
    --background: #f8f9fa;
    --white: #ffffff;
  }
`;

export default GlobalStyles;