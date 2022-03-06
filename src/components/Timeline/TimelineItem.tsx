import { FC, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box } from "@mui/material";
import { abi } from "@alpsfinance/core/build/contracts/Presale.json";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import presaleContractAddress from "../../constants/presaleContractAddress.json";
import formatNumber from "../../utils/formatNumber";
import usePresaleChain from "../../hooks/usePresaleChain";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }} mb={2}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          {...props}
          variant="determinate"
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
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export type TimeLineData = {
  round: number;
  title: string;
  amount: number;
  unit: string;
};

export const TimelineItem: FC<TimeLineData> = ({
  round,
  title,
  amount,
  unit,
}) => {
  const [progress, setProgress] = useState<number>(-1);
  const { isAuthenticated, Moralis } = useMoralis();
  const { presaleChain } = usePresaleChain();

  const { data, fetch } = useWeb3ExecuteFunction({
    contractAddress: presaleContractAddress[presaleChain].presale,
    functionName: "getPresaleAmountByRound",
    abi,
    params: { _presaleRound: round.toString() },
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetch();
    }
  }, [fetch, isAuthenticated]);

  useEffect(() => {
    if (data) {
      setProgress(Number(Moralis.Units.FromWei(data as string)));
    }
  }, [Moralis.Units, data]);

  return (
    <>
      <Typography fontWeight={600}>{title}</Typography>
      <Typography>Amount: {formatNumber(amount)}</Typography>
      <Typography>Unit: {unit}</Typography>
      <LinearProgressWithLabel value={progress / amount} />
    </>
  );
};
