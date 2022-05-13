import { CircularProgress, Skeleton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

const OrderPendingSkeleton = () => {
  return (
    <Box
      sx={{
        margin: 4,
        paddingTop: "64px",
        paddingBottom: "64px",
        maxWidth: "1236px",
      }}
    >
      <Stack spacing={2} alignItems={"center"}>
        <Skeleton variant="text" width={200} height={50} />
        <Skeleton variant="rectangular" width={300} height={300} />
        <Typography variant="h6" marginRight={"10px"}>
          Status : Order pending
        </Typography>
        <CircularProgress color="warning" />
      </Stack>
    </Box>
  );
};

export default OrderPendingSkeleton;
