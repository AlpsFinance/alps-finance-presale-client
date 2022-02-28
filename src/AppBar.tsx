import React, { FC, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import AlpsLogo from "./AlpsLogo";
import { Drawer, Grid, Link } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Menu } from "@mui/icons-material";
import { useMoralis } from "react-moralis";

const CustomAppBar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, authenticate, user, logout } = useMoralis();
  const [walletAddress, setWalletAddress] = useState("");
  useEffect(() => {
    if (isAuthenticated) {
      const ethAddress = user?.get("ethAddress");
      setWalletAddress(ethAddress.replace(ethAddress.substring(6, 38), "****"));
    }
    //eslint - disable - next - line;
  }, [isAuthenticated]);

  const loginControl = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      authenticate();
    } else {
      logout();
    }
  };
  const toggleDrawer =
    (anchor: String, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };
  const menus = [
    {
      name: "Home",
      url: "",
    },
    {
      name: "Litepaper",
      url: "",
    },
    {
      name: "Documentation",
      url: "https://docs.alps.finance/",
    },
    {
      name: "Blog",
      url: "",
    },
    {
      name: "FAQs",
      url: "",
    },
  ];
  const list = (anchor: String) => (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {menus.map((menu, index) => (
          <ListItem button key={index}>
            <ListItemText
              primary={menu.name}
              onClick={() => {
                const AlpsFinanceAppURL = menu.url;
                window.open(AlpsFinanceAppURL, "_blank") ||
                  window.location.replace(AlpsFinanceAppURL);
              }}
            />
          </ListItem>
        ))}
      </List>
      <List>
        <Button
          color='inherit'
          variant='contained'
          sx={{
            borderRadius: 30,
            color: "#0D7E06",
            background: "white",
            ml: 1,
            fontWeight: "bold",
          }}
          onClick={loginControl}
        >
          {isAuthenticated ? walletAddress : "Connect Wallet"}
        </Button>
      </List>
    </Box>
  );

  return (
    <AppBar
      position='sticky'
      color='transparent'
      elevation={0}
      sx={{
        pt: 1.5,
        pb: 1.5,
        pl: 3.5,
        "@media (min-width: 780px)": {
          pr: 3.5,
        },
        color: "white",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <AlpsLogo />
        </Box>
        {menus
          .filter((menu) => menu.name !== "Home")
          .map((menu, index) => (
            <Link
              key={index}
              underline={"none"}
              color={"white"}
              href={menu.url}
              sx={{
                pr: 3,
                fontWeight: "bold",
                "@media (max-width: 780px)": {
                  display: "none",
                },
              }}
            >
              {menu.name}
            </Link>
          ))}
        <Button
          color='inherit'
          variant='contained'
          sx={{
            borderRadius: 30,
            color: "#0D7E06",
            background: "white",
            ml: 1,
            fontWeight: "bold",
            "@media (max-width: 780px)": {
              display: "none",
            },
            textTransform: "none",
          }}
          onClick={loginControl}
        >
          {isAuthenticated ? walletAddress : "Connect Wallet"}
        </Button>
        <Grid
          container
          justifyContent='right'
          alignItems='right'
          sx={{
            "@media (min-width: 780px)": {
              display: "none",
            },
          }}
        >
          <Grid item>
            <Button
              onClick={toggleDrawer("right", true)}
              sx={{ color: "white" }}
            >
              <Menu />
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
      <Drawer
        anchor={"right"}
        open={isOpen}
        onClose={toggleDrawer("right", false)}
        PaperProps={{
          sx: {
            backgroundColor: "#C8CACB",
          },
        }}
      >
        {list("right")}
      </Drawer>
    </AppBar>
  );
};

export default CustomAppBar;
