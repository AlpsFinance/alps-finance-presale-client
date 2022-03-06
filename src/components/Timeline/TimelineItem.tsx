import { FC, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box } from "@mui/material";
import { abi } from "@alpsfinance/core/build/contracts/Presale.json";
import { useApiContract, useMoralis } from "react-moralis";
import presaleContractAddress from "../../constants/presaleContractAddress.json";
import formatNumber from "../../utils/formatNumber";
import usePresaleChain from "../../hooks/usePresaleChain";
import usePresale from "../../hooks/usePresale";

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
};

export const TimelineItem: FC<TimeLineData> = ({ round, title }) => {
  const [progress, setProgress] = useState<number>(-1);
  const { isAuthenticated, Moralis } = useMoralis();
  const { presaleChain } = usePresaleChain();
  const { presaleDataMapping } = usePresale();
  const presaleByRound = presaleDataMapping.find((p) => p.round === round);

  const { data, runContractFunction } = useApiContract({
    address: presaleContractAddress[presaleChain].presale,
    functionName: "getPresaleAmountByRound",
    chain: presaleChain,
    abi,
    params: { _presaleRound: round.toString() },
  });

  useEffect(() => {
    if (isAuthenticated) {
      runContractFunction();
    }
  }, [isAuthenticated, runContractFunction]);

  useEffect(() => {
    if (data) {
      setProgress(Number(Moralis.Units.FromWei(data as string)));
    }
  }, [Moralis.Units, data]);

  return (
    <>
      <Typography fontWeight={600}>{title}</Typography>
      <Typography>
        Amount:{" "}
        {formatNumber((presaleByRound?.maximumPresaleAmount ?? 0) / 1e18)}
      </Typography>
      <Typography>
        Unit: $ {Moralis.Units.FromWei(presaleByRound?.usdPrice ?? 0)}
      </Typography>
      <LinearProgressWithLabel
        value={(progress / (presaleByRound?.maximumPresaleAmount ?? 1)) * 1e18}
      />
    </>
  );
};
