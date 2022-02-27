import { FC, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { calculateTimeLeft } from "./utility/helper";

interface Props {
  isLargeScreen: Boolean;
}

const AlpsTokenPresale: FC<Props> = (props) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const { isLargeScreen } = props;
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='start'
      // sx={{ ml: isLargeScreen ? 1 : 0 }}
    >
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
          <Grid container justifyContent='center' alignItems='center' pt={1}>
            TOKEN PRESALE STARTS IN:
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
                  textAlign='center'
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.days} </Typography>
                  <Typography fontWeight={600}>days </Typography>
                </Box>

                <Box
                  textAlign='center'
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.hours} </Typography>
                  <Typography fontWeight={600}>hours </Typography>
                </Box>

                <Box
                  textAlign='center'
                  sx={{
                    p: 1,
                    m: isLargeScreen ? 1 : 0,
                  }}
                >
                  <Typography fontWeight={600}>{timeLeft.minutes} </Typography>
                  <Typography fontWeight={600}>minutes </Typography>
                </Box>
                <Box
                  textAlign='center'
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
