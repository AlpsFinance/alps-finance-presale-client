import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import AppBar from "./components/AppBar";
import AlpsTokenPresale from "./AlpsTokenPresale";
import Footer from "./components/Footer";
import Timeline from "./components/Timeline";
import BuyContainer from "./BuyContainer";
import WrongNetworkModal from "./components/WrongNetworkModal";
import usePresaleChain from "./hooks/usePresaleChain";
import presaleContractAddress from "./constants/presaleContractAddress.json";
import getEllipsisText from "./utils/getEllipsisText";

export default function App() {
  const theme = useTheme();
  const { enableWeb3, isAuthenticated, isInitialized, isWeb3Enabled } =
    useMoralis();
  const { presaleChain } = usePresaleChain();
  const Web3Api = useMoralisWeb3Api();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [copied, setCopied] = useState<boolean>(false);

  const {
    fetch: fetchTokenMetadata,
    data: tokenMetadata,
    isLoading: isTokenMetadataLoading,
  } = useMoralisWeb3ApiCall(Web3Api.token.getTokenMetadata, {
    chain: presaleChain,
    addresses: [presaleContractAddress[presaleChain]?.token],
  });

  useEffect(() => {
    if (isInitialized && isAuthenticated && !isWeb3Enabled) {
      enableWeb3();
    }
  }, [isInitialized, isAuthenticated, isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    if (isInitialized) {
      fetchTokenMetadata();
    }
  }, [isInitialized, fetchTokenMetadata]);

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
            <AlpsTokenPresale />
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
          <Grid
            item
            lg={7}
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            px={isLargeScreen ? 5 : 0}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Token Info
            </Typography>
            {tokenMetadata && !isTokenMetadataLoading && (
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                spacing={1}
              >
                <Grid item>
                  <Typography sx={{ display: "inline" }}>Name: </Typography>
                  <Typography fontWeight={600} sx={{ display: "inline" }}>
                    {tokenMetadata[0]?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography sx={{ display: "inline" }}>Symbol: </Typography>
                  <Typography fontWeight={600} sx={{ display: "inline" }}>
                    {tokenMetadata[0]?.symbol}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography sx={{ display: "inline" }}>Decimal:</Typography>
                  <Typography fontWeight={600} sx={{ display: "inline" }}>
                    {tokenMetadata[0]?.decimals}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item lg={12}>
                <Typography sx={{ display: "inline" }}>Contract: </Typography>
                <Typography fontWeight={600} sx={{ display: "inline", mr: 1 }}>
                  {getEllipsisText(presaleContractAddress[presaleChain].token)}
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
        <Timeline />
      </Box>
      <Footer />
      <WrongNetworkModal />
    </Box>
  );
}
