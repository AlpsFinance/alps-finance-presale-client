import { useState, FC, useEffect } from "react";
import { useChain, useMoralis } from "react-moralis";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";

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
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useMoralis();
  const { switchNetwork, chainId } = useChain();

  useEffect(() => {
    if (isAuthenticated) {
      if (chainId !== null && chainId !== process.env.REACT_APP_CHAIN_ID) {
        setOpen(true);
      } else if (chainId === process.env.REACT_APP_CHAIN_ID) {
        setOpen(false);
      }
    }
  }, [isAuthenticated, chainId]);

  return (
    <Modal
      open={open}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Wrong Chain!
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          Alps Finance only support <b>Fantom Opera Mainnet</b>. Please click
          button below to change to Fantom Network
        </Typography>
        <Grid container justifyContent='center' alignItems='center' pt={1}>
          <Button
            color='inherit'
            variant='contained'
            sx={{
              borderRadius: 2,
              background:
                "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
              mt: 1,
              fontWeight: "bold",
              textTransform: "none",
              color: "white",
            }}
            onClick={() => switchNetwork("0xfa")}
          >
            Change to Fantom Network
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default WrongNetworkModal;
