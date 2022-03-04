import { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { calculateTimeLeft } from './utility/helper';
import { useMoralis } from 'react-moralis';
import preSaleAbi from '@alpsfinance/core/build/contracts/Presale.json';
import { CHAIN_SYMBOL, PRESALE_CONTRACT_ADDRESS } from './constant';
import { useApiContract } from 'react-moralis';

interface Props {
  isLargeScreen: Boolean;
}

const AlpsTokenPresale: FC<Props> = (props) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(Date.now()));
  const [currentRound, setCurrentRound] = useState<number>(1);
  const { isLargeScreen } = props;
  const { isAuthenticated } = useMoralis();
  const getCurrentPresaleRoundFunction = useApiContract({
    address: PRESALE_CONTRACT_ADDRESS,
    functionName: 'getCurrentPresaleRound',
    chain: CHAIN_SYMBOL,
    abi: preSaleAbi.abi,
  });
  const { data, runContractFunction } = useApiContract({
    address: PRESALE_CONTRACT_ADDRESS,
    functionName: 'presaleDetailsMapping',
    chain: CHAIN_SYMBOL,
    abi: preSaleAbi.abi,
    params: { '': (currentRound + 1).toString() },
  });
  useEffect(() => {
    if (isAuthenticated)
      if (currentRound < 2) runContractFunction();
      else setTimeLeft(calculateTimeLeft(Date.now()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, isAuthenticated]);

  async function Fetch() {
    try {
      const res = await getCurrentPresaleRoundFunction.runContractFunction();
      setCurrentRound(Number(res));
      // const nextRound = await getNextRoundFunction.runContractFunction();
      // console.log(res, nextRound)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isAuthenticated) Fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  let timer: any;
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setInterval(() => {
        const leftTime = calculateTimeLeft(
          1000 * Number((data as any).startingTime)
        );
        if (
          leftTime.days === 0 &&
          leftTime.hours === 0 &&
          leftTime.minutes === 0 &&
          leftTime.seconds === 0
        ) {
          Fetch();
        }
        setTimeLeft(leftTime);
      }, 1000);
    } else {
      clearTimeout(timer);
    }
    return () => clearInterval(timer);
  }, [data]);

  return (
    <Grid container justifyContent="center" alignItems="start">
      <Box
        sx={{
          background:
            'linear-gradient(109.06deg, rgba(18, 209, 6, 0.3) 2.72%, rgba(255, 255, 255, 0) 98.2%)',
          boxShadow: '0px 4px 5px 3px rgba(18, 209, 6, 0.1)',
          borderRadius: '10px',
          p: isLargeScreen ? 5 : 3,
        }}
      >
        <Box
          sx={{
            background: 'rgba(0, 36, 0, 0.5)',
          }}
        >
          <Grid container justifyContent="center" alignItems="center" pt={1}>
            TOKEN PRESALE ROUND {currentRound + 1} STARTS IN:
          </Grid>

          <Grid container spacing={isLargeScreen ? 2 : 0}>
            <Grid item>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 'fit-content',
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                <Box
                  textAlign="center"
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.days} </Typography>
                  <Typography fontWeight={600}>days </Typography>
                </Box>

                <Box
                  textAlign="center"
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.hours} </Typography>
                  <Typography fontWeight={600}>hours </Typography>
                </Box>

                <Box
                  textAlign="center"
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.minutes} </Typography>
                  <Typography fontWeight={600}>minutes </Typography>
                </Box>
                <Box
                  textAlign="center"
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.seconds} </Typography>
                  <Typography fontWeight={600}>seconds </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

export default AlpsTokenPresale;
