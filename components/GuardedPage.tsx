import { CircularProgress, Container } from '@mui/material';

const GuardPage = ({ children, ...props }) => {
  return (
    <>
      <Container maxWidth="xl">
        <CircularProgress />
      </Container>
    </>
  );
};

export default GuardPage;
