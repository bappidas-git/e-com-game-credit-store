import React, { createContext, useState, useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};

// Alias for useTheme to match naming convention
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }
  return { mode: context.isDarkMode ? "dark" : "light", toggleTheme: context.toggleTheme };
};

export const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.body.style.backgroundColor = isDarkMode ? "#0a0e27" : "#f5f7fa";

    // Add/remove .dark class on body for CSS selectors
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#667eea",
        light: "#8b9af3",
        dark: "#4c5ed0",
      },
      secondary: {
        main: "#f093fb",
        light: "#f4b3fc",
        dark: "#d673e0",
      },
      background: {
        default: "#f5f7fa",
        paper: "#ffffff",
      },
      text: {
        primary: "#1a202c",
        secondary: "#4a5568",
      },
      action: {
        hover: "rgba(102, 126, 234, 0.08)",
      },
    },
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontSize: "3rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.6,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            padding: "10px 24px",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
            },
          },
          contained: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&:hover fieldset": {
                borderColor: "#667eea",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
                borderWidth: "2px",
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#a855f7",
        light: "#c084fc",
        dark: "#9333ea",
      },
      secondary: {
        main: "#ec4899",
        light: "#f472b6",
        dark: "#db2777",
      },
      background: {
        default: "#0a0e27",
        paper: "#1a1f3a",
      },
      text: {
        primary: "#f5f7fa",
        secondary: "#a0aec0",
      },
      action: {
        hover: "rgba(168, 85, 247, 0.15)",
      },
    },
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontSize: "3rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.6,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            padding: "10px 24px",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(168, 85, 247, 0.4)",
            },
          },
          contained: {
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            background: "rgba(26, 31, 58, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 30px rgba(168, 85, 247, 0.3)",
              borderColor: "rgba(168, 85, 247, 0.4)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&:hover fieldset": {
                borderColor: "#a855f7",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#a855f7",
                borderWidth: "2px",
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "rgba(26, 31, 58, 0.95)",
            backdropFilter: "blur(20px)",
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
