import {createTheme} from '@mui/material';


export const rowerTheme = createTheme ({
  palette: {
    primary: {
      main: '#016C72', // Verde Rower
      dark: '#014F54', // Hover
    },
    secondary: {
      main: '#ECB733', // Amarelo Rower
      dark: '#D1A121', // Hover
    },
    background: {
      default: '#f4f6f8', // Um cinza bem clarinho para o fundo
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove o texto TUDO MAIÚSCULO padrão
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        }
      }
    }
  },
});