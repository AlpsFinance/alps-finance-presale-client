import { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, Button } from "@mui/material";
import { preSaleAbi } from "./utility/presaleabi";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }} mb={2}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          {...props}
          variant='determinate'
          sx={{
            height: 10,
            borderRadius: 5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: "#C7BFED",
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: "#0D7E06",
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Timeline: FC = () => {
  const { isWeb3Enabled } = useMoralis();
  const { fetch } = useWeb3ExecuteFunction();
  const [progress, setProgress] = useState(-1);

  useEffect(() => {
    if (isWeb3Enabled && progress === -1) {
      fetch({
        params: {
          abi: preSaleAbi,
          functionName: "totalSupply",
          contractAddress: "0x064c13231656A8c10CE6df9e8CC91E9D8CbCce31",
        },
        onError: (e: any) => {
          console.log(e);
        },
        onSuccess: (result: any) => {
          setProgress(result);
        },
      });
    }
  }, [isWeb3Enabled]);

  return (
    <Grid
      container
      sx={{
        my: 5,
      }}
      justifyContent='center'
    >
      <Grid
        item
        lg={5}
        sx={{
          boxShadow: "0px 3px 11px 4px rgba(18, 209, 6, 0.25)",
          borderRadius: 3,
          pt: 2,
          px: 2,
        }}
      >
        <Typography variant='h5' sx={{ mb: 2 }}>
          TIMELINE ALPS
        </Typography>
        <Typography fontWeight={600}>
          PRESALE A (18 Feb 2022 - 17 Mar 2022)
        </Typography>
        <Typography>Amount: 50,000,000</Typography>
        <Typography>Unit: $0.000125</Typography>
        <LinearProgressWithLabel value={progress} />
        <Typography fontWeight={600}>
          PRESALE B (18 Mar 2022 - 17 Apr 2022)
        </Typography>
        <Typography>Amount: 100,000,000</Typography>
        <Typography>Unit: $0.000250</Typography>
        <LinearProgressWithLabel value={progress} />
        <Typography fontWeight={600}>
          PRESALE C (18 Apr 2022 - 17 May 2022)
        </Typography>
        <Typography>Amount: 100,000,000</Typography>
        <Typography>Unit: $0.00050</Typography>
        <LinearProgressWithLabel value={progress} />
        <Box textAlign='center'>
          <Button
            color='inherit'
            variant='contained'
            sx={{
              borderRadius: 5,
              color: "white",
              background:
                "linear-gradient(274.61deg, #0D7E06 18.06%, #00BB89 125.98%)",
              py: 1,
              fontWeight: "bold",
              mb: 4,
            }}
            onClick={() => {}}
          >
            Read Litepaper
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Timeline;
