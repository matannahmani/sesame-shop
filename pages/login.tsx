import { LoadingButton } from '@mui/lab';
import { Box, Typography, Grid, TextField, Alert } from '@mui/material';
import { useState } from 'react';

const Login = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  return (
    <Box
      sx={{
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Log in
      </Typography>
      <Box sx={{ m: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
            />
          </Grid>
        </Grid>
        <LoadingButton
          fullWidth
          disabled={!user.username || !user.password}
          variant="contained"
          //   onClick={() =>
          //     mutation.mutate({
          //       user.username,
          //       user.password,
          //     })
          //   }
          sx={{ mt: 3, mb: 2 }}
          //   loading={mutation.isLoading}
        >
          Log In
        </LoadingButton>
        {/* {error ? (
          <Alert severity="error">
            Username or password wrong, try again...
          </Alert>
        ) : null} */}
      </Box>
    </Box>
  );
};

export default Login;
