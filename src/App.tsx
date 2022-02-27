import { ChangeEvent, FormEvent, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./App.css";
import AppBar from "./AppBar";
import AlpsTokenPresale from "./AlpsTokenPresale";
import Footer from "./Footer";
import Timeline from "./Timeline";

export default function App() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [copied, setCopied] = useState(false);
  const currencies = [
    {
      value: "FTM",
      label: "FTM",
    },
    {
      value: "USDT",
      label: "USDT",
    },
    {
      value: "DAI",
      label: "DAI",
    },
  ];
  const [token, setToken] = useState("FTM");
  const changeToken = (event: SelectChangeEvent<string>): void => {
    setToken(event.target.value);
  };
  const [amount, setAmount] = useState("0.1");
  const changeAmount = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setAmount(event.target.value);
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(token);
    console.log(amount);
  };
  return (
    <Box>
      <Box
        style={{
          backgroundPositionY: isLargeScreen ? -40 : 0,
          backgroundImage: "url(background-pc.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AppBar />
        <Grid
          container
          spacing={0}
          alignItems='center'
          justifyContent='center'
          pt={2}
          sx={{
            color: "white",
            pb: 5,
            mb: 5,
          }}
          flexDirection='column'
        >
          <Grid item xs={12}>
            <Grid
              container
              direction='column'
              justifyContent='center'
              textAlign='center'
              spacing={2}
              mb={2}
            >
              <Grid item>
                <Typography variant={isLargeScreen ? "h4" : "h6"}>
                  <b>Alps Token Presale Live</b>
                </Typography>
              </Grid>
            </Grid>
            <AlpsTokenPresale isLargeScreen={isLargeScreen} />
            <Grid item sm={12} md={12}>
              <Grid
                container
                px={3}
                mt={2}
                direction='column'
                justifyContent='center'
                textAlign='center'
              >
                <Box>
                  <img
                    src='placeholder.png'
                    alt='Placeholder'
                    loading='lazy'
                    style={{
                      width: "100%",
                      maxWidth: "750px",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={5} px={isLargeScreen ? 5 : 0} mt={2} mb={2}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Presale Round 1
            </Typography>
            <Box
              sx={{
                background:
                  "linear-gradient(109.06deg, rgba(18, 209, 6, 0.3) 2.72%, rgba(255, 255, 255, 0) 98.2%)",
                boxShadow: "0px 4px 5px 3px rgba(18, 209, 6, 0.1)",
                borderRadius: "10px",
                px: isLargeScreen ? 5 : 1,
                pt: 3,
                pb: 2,
              }}
            >
              <Typography fontWeight={600} sx={{ ml: 0.5, mb: 1 }}>
                Price: 1 Alps = $0.075
              </Typography>
              <Box component='form' autoComplete='off' onSubmit={submitHandler}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "50px",
                    backgroundColor: "#6E856E",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    required
                    variant='standard'
                    value={amount}
                    onChange={changeAmount}
                    InputProps={{
                      disableUnderline: true,
                      inputMode: "decimal",
                    }}
                    sx={{
                      pl: 1,
                      minWidth: "120px",
                      Input: {
                        height: "40px",
                        color: "white",
                      },
                    }}
                  />
                  <Divider orientation='vertical' flexItem color='white' />
                  <FormControl variant='standard' sx={{ minWidth: 100 }}>
                    <Select
                      labelId='demo-simple-select-standard-label'
                      id='demo-simple-select-standard'
                      value={token}
                      onChange={changeToken}
                      label='Age'
                      disableUnderline
                      sx={{
                        pl: 2,
                        color: "white",
                        height: "50px",
                        svg: {
                          color: "white",
                        },
                      }}
                    >
                      {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  color='inherit'
                  variant='contained'
                  sx={{
                    borderRadius: 2,
                    background:
                      "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
                    mt: 1,
                    fontWeight: "bold",
                    width: "100%",
                    textTransform: "none",
                    color: "black",
                  }}
                  type='submit'
                >
                  Buy
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={4} textAlign='left' px={isLargeScreen ? 5 : 0}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Token Info
            </Typography>
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item lg={6} sm={7}>
                <Typography sx={{ display: "inline" }}>Symbol: </Typography>
                <Typography fontWeight={600} sx={{ display: "inline" }}>
                  ALPS
                </Typography>
              </Grid>
              <Grid item lg={4} sm={5}>
                <Typography sx={{ display: "inline" }}>Decimal:</Typography>
                <Typography fontWeight={600} sx={{ display: "inline" }}>
                  18
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction='row' alignItems='center' spacing={1}>
              <Grid item lg={12}>
                <Typography sx={{ display: "inline" }}>Contract: </Typography>
                <Typography fontWeight={600} sx={{ display: "inline", mr: 1 }}>
                  0x02c8***099dg28
                </Typography>

                <CopyToClipboard
                  text={"0xEF19F4E48830093Ce5bC8b3Ff7f903A0AE3E9Fa1"}
                  onCopy={() => setCopied(true)}
                >
                  <Tooltip
                    title={copied ? "Copied!" : "Copy To Clipboard"}
                    placement='top'
                    onClose={() => setTimeout(() => setCopied(false), 200)}
                  >
                    <img src='./copy-icon.svg' alt='Copy to Clipboard' />
                  </Tooltip>
                </CopyToClipboard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Timeline />
      <Footer />
    </Box>
  );
}
