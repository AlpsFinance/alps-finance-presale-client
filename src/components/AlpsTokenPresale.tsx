import { FC, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import usePresale from "../hooks/usePresale";
import { calculateTimeLeft } from "../utils/calculateTimeLeft";

interface TimeType {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const AlpsTokenPresale: FC = (props) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { currentPresaleRound, totalPresaleRound, presaleDataMapping } =
    usePresale();
  const [timeLeft, setTimeLeft] = useState<TimeType>(
    calculateTimeLeft(Date.now())
  );

  let timer: any;
  useEffect(() => {
    if (presaleDataMapping) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setInterval(() => {
        const currentPresale = presaleDataMapping.find((d) => {
          return d.round === currentPresaleRound;
        });
        const nextPresale = presaleDataMapping.find((d) => {
          return (
            d.round === Math.min(currentPresaleRound + 1, totalPresaleRound - 1)
          );
        });
        if (currentPresale && nextPresale) {
          let leftTime;
          if (Date.now() < currentPresale?.startingTime) {
            leftTime = calculateTimeLeft(
              1000 * Number(currentPresale?.startingTime)
            );
          } else {
            leftTime = calculateTimeLeft(
              1000 * Number(nextPresale?.startingTime)
            );
          }

          setTimeLeft(leftTime);
        } else {
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
        }
      }, 1000);
    } else {
      clearTimeout(timer);
    }
    return () => clearInterval(timer);
  }, [presaleDataMapping]);

  return (
    <Grid container justifyContent="center" alignItems="start">
      <Box
        sx={{
          background:
            "linear-gradient(109.06deg, rgba(18, 209, 6, 0.3) 2.72%, rgba(255, 255, 255, 0) 98.2%)",
          boxShadow: "0px 4px 5px 3px rgba(18, 209, 6, 0.1)",
          borderRadius: "10px",
          p: isLargeScreen ? 5 : 3,
        }}
      >
        <Box
          sx={{
            background: "rgba(0, 36, 0, 0.5)",
          }}
        >
          <Grid container justifyContent="center" alignItems="center" pt={1}>
            TOKEN PRESALE ROUND {currentPresaleRound + 2} STARTS IN:
          </Grid>

          <Grid container spacing={isLargeScreen ? 2 : 0}>
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "fit-content",
                  color: "white",
                  textTransform: "uppercase",
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
