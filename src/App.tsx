import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./App.css";
import AppBar from "./AppBar";
import AlpsTokenPresale from "./AlpsTokenPresale";
import Footer from "./Footer";
import Timeline from "./timeline";
import BuyContainer from "./BuyContainer";
import WrongNetworkModal from "./WrongNetworkModal";

export default function App() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [copied, setCopied] = useState(false);

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
          alignItems="center"
          justifyContent="center"
          pt={2}
          sx={{
            color: "white",
            pb: 5,
            mb: 5,
          }}
          flexDirection="column"
        >
          <Grid item xs={12}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              textAlign="center"
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
                direction="column"
                justifyContent="center"
                textAlign="center"
              >
                <Box>
                  <img
                    src="placeholder.png"
                    alt="Placeholder"
                    loading="lazy"
                    style={{
                      width: "100%",
                      maxWidth: "750px",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <BuyContainer isLargeScreen={isLargeScreen} />
          <Grid item lg={4} textAlign="left" px={isLargeScreen ? 5 : 0}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Token Info
            </Typography>
            <Grid container direction="row" alignItems="center" spacing={1}>
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
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item lg={12}>
                <Typography sx={{ display: "inline" }}>Contract: </Typography>
                <Typography fontWeight={600} sx={{ display: "inline", mr: 1 }}>
                  0x064c***CbCce31
                </Typography>

                <CopyToClipboard
                  text={"0x064c13231656A8c10CE6df9e8CC91E9D8CbCce31"}
                  onCopy={() => setCopied(true)}
                >
                  <Tooltip
                    title={copied ? "Copied!" : "Copy To Clipboard"}
                    placement="top"
                    onClose={() => setTimeout(() => setCopied(false), 200)}
                  >
                    <img src="./copy-icon.svg" alt="Copy to Clipboard" />
                  </Tooltip>
                </CopyToClipboard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Timeline />
      <Footer />
      <WrongNetworkModal />
    </Box>
  );
}
