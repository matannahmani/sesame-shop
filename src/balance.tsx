import { Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { balanceAtom } from '../atoms/balance';
import ChainConnector from '../hooks/ChainConnector';

const BalanceHeader = () => {
  const [balance, setBalance] = useAtom(balanceAtom);
  const info = ChainConnector();
  return (
    <Box
      sx={{
        display: balance.length > 0 ? 'block' : 'none',
        position: 'fixed',
        top: 8,
        right: 8,
      }}
    >
      <Typography
        sx={{
          textOverflow: 'ellipsis',
          width: '120px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        SES: {balance}
      </Typography>
    </Box>
  );
};

export default BalanceHeader;
