import { useState, FC, useEffect, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const WrongNetworkModal: FC = () => {
  const { isAuthenticated } = useMoralis();
  const { switchNetwork, chainId } = useChain();
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
      setOpen(
        chainId !==
          (process.env.NODE_ENV === "development" ? "0x13881" : "0xfa")
      );
    }
  }, [isAuthenticated, chainId]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Wrong Chain!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Alps Finance only supports <b>{chainName}</b>. Please click the
            button below to change to {chainName}.
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
                  await switchNetwork(
                    process.env.NODE_ENV === "development" ? "0x13881" : "0xfa"
                  );
                  setIsSwitchingNetwork(false);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Change to {chainName} Network
            </LoadingButton>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default WrongNetworkModal;
