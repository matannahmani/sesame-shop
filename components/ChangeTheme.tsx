import { Fab, PaletteMode, Switch } from "@mui/material";
import React, { FC } from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

interface Props {
    mode: PaletteMode;
    onClick?: () => void;
}
const ChangeTheme: FC<Props> = ({ mode, onClick }) => {
    return (
        <div>
            {mode === "dark" ? (
                <Fab
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    aria-label="lightMode"
                    onClick={onClick}
                >
                    <LightModeOutlinedIcon />
                </Fab>
            ) : (
                <Fab
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    aria-label="darkMode"
                    onClick={onClick}
                >
                    <DarkModeOutlinedIcon />
                </Fab>
            )}
        </div>
    );
};

export default ChangeTheme;
