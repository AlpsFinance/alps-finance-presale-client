import { FC, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { Box } from '@mui/material';
import preSaleAbi from '@alpsfinance/core/build/contracts/Presale.json';
import { useApiContract, useMoralis } from 'react-moralis';
import { CHAIN_SYMBOL, PRESALE_CONTRACT_ADDRESS } from '../constant';
import { regularNumber } from '../utility/helper';

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} mb={2}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          {...props}
          variant="determinate"
          sx={{
            height: 10,
            borderRadius: 5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: '#C7BFED',
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: '#0D7E06',
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

const TimelineItem: FC<TimeLineData> = ({ round, title, amount, unit }) => {
  const [progress, setProgress] = useState<number>(-1);
  const { isAuthenticated, Moralis } = useMoralis();

  const { data, runContractFunction } = useApiContract({
    address: PRESALE_CONTRACT_ADDRESS,
    functionName: 'getPresaleAmountByRound',
    chain: CHAIN_SYMBOL,
    abi: preSaleAbi.abi,
    params: { _presaleRound: round.toString() },
  });

  useEffect(() => {
    if (isAuthenticated) {
      runContractFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (data) {
      setProgress(Number(Moralis.Units.FromWei(data)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // const { isWeb3Enabled, enableWeb3 } = useMoralis();
  // const { fetch } = useWeb3ExecuteFunction();
  // const [progress, setProgress] = useState(-1);

  // useEffect(() => {
  //   console.log(isWeb3Enabled, progress)
  //   if (!isWeb3Enabled) {
  //     enableWeb3();
  //   }
  //   if (isWeb3Enabled && progress === -1) {
  //     fetch({
  //       params: {
  //         abi: preSaleAbi.abi,
  //         functionName: "getPresaleAmountByRound",
  //         contractAddress: PRESALE_CONTRACT_ADDRESS,
  //         params: {"_presaleRound":0}
  //       },
  //       onError: (e: any) => {
  //         console.log(e);
  //       },
  //       onSuccess: (result: any) => {
  //         console.log('#######', result)
  //         setProgress(result);
  //       },
  //     });
  //   }
  // }, [isWeb3Enabled]);

  return (
    <>
      <Typography fontWeight={600}>{title}</Typography>
      <Typography>Amount: {regularNumber(amount)}</Typography>
      <Typography>Unit: {unit}</Typography>
      <LinearProgressWithLabel value={progress / amount} />
    </>
  );
};

export default TimelineItem;
