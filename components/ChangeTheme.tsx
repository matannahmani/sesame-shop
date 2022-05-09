import { Fab } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';

export const darkModeAtom = atomWithStorage('darkMode', true);

const ChangeTheme = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  return (
    <div>
      <Fab
        sx={{
          position: 'fixed',
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        onClick={() => setDarkMode((prev) => !prev)}
        aria-label={darkMode ? 'lightMode' : 'darkMode'}
      >
        {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </Fab>
    </div>
  );
};

export default ChangeTheme;
