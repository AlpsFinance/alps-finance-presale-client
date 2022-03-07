import { useState, FC, useEffect, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Fade from "@mui/material/Fade";
import usePresaleChain from "../hooks/usePresaleChain";

const WrongNetworkModal: FC = () => {
  const { isAuthenticated } = useMoralis();
  const { switchNetwork, chainId } = useChain();
  const { presaleChain } = usePresaleChain();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState<boolean>(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState<boolean>(false);
  const chainName = useMemo(
    () =>
      process.env.NODE_ENV === "development"
        ? "Polygon Mumbai"
        : "Fantom Opera Mainnet",
    []
  );

  useEffect(() => {
    if (isAuthenticated && chainId) {
      setOpen(chainId !== presaleChain);
    }
  }, [isAuthenticated, chainId, presaleChain]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
      fullScreen={!isLargeScreen}
      fullWidth
    >
      <DialogTitle>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          <b>Wrong Chain!</b>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Alps Finance only supports <b>{chainName}</b>. Please click the button
          below to change to {chainName}.
        </Typography>
        <Grid container justifyContent="center" alignItems="center" pt={1}>
          <LoadingButton
            color="inherit"
            variant="contained"
            loading={isSwitchingNetwork}
            sx={{
              borderRadius: 2,
              background:
                "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
              mt: 1,
              fontWeight: "bold",
              textTransform: "none",
              color: "white",
            }}
            onClick={async () => {
              try {
                setIsSwitchingNetwork(true);
                await switchNetwork(presaleChain);
                setIsSwitchingNetwork(false);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Change to {chainName} Network
          </LoadingButton>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WrongNetworkModal;
