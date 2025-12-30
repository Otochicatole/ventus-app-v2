import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1567ff",
            light: "#4d89ff",
            dark: "#0548cc",
        },
        secondary: {
            main: "#a3a3a3",
            light: "#d4d4d4",
            dark: "#737373",
        },
        background: {
            default: "#171717",
            paper: "#262626",
        },
        text: {
            primary: "#f5f5f5",
            secondary: "#a3a3a3",
        },
        error: {
            main: "#dc2626",
            light: "#fca5a5",
            dark: "#991b1b",
        },
        warning: {
            main: "#f59e0b",
            light: "#fcd34d",
            dark: "#92400e",
        },
        success: {
            main: "#10b981",
            light: "#bbf7d0",
            dark: "#166534",
        },
        info: {
            main: "#3b82f6",
            light: "#93c5fd",
            dark: "#1e40af",
        },
        divider: "#404040",
    },
    typography: {
        fontFamily: "Arial, Helvetica, sans-serif",
        h1: {
            fontSize: "2.25rem",
            fontWeight: 700,
            color: "#f5f5f5",
        },
        h2: {
            fontSize: "1.875rem",
            fontWeight: 600,
            color: "#f5f5f5",
        },
        h3: {
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#f5f5f5",
        },
        h4: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#f5f5f5",
        },
        body1: {
            fontSize: "1rem",
            color: "#f5f5f5",
        },
        body2: {
            fontSize: "0.875rem",
            color: "#a3a3a3",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                    padding: "10px 20px",
                    borderRadius: "6px",
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "#262626",
                    borderRadius: "8px",
                    border: "1px solid #404040",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#171717",
                        "& fieldset": {
                            borderColor: "#404040",
                        },
                        "&:hover fieldset": {
                            borderColor: "#525252",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#1567ff",
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: "#171717",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundImage: "none",
                    backgroundColor: "#262626",
                    border: "1px solid #404040",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: "#404040",
                },
                head: {
                    fontWeight: 500,
                    color: "#a3a3a3",
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

