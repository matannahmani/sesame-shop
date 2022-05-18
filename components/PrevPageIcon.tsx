import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useRouter } from 'next/router';

const PrevPageIcon = () => {
  const router = useRouter();

  return (
    <span onClick={() => router.back()}>
      <ArrowBackOutlinedIcon
        sx={{ position: 'fixed', top: '0px', left: '0px', margin: 2 }}
      />
    </span>
  );
};

export default PrevPageIcon;
