import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/VerifiedUser";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Profile-Pic-Generator
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState();
  const [imageNumber, setImageNumber] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    setImageNumber(data.get("file_number"));
    fetch(
      `http://corsbypass.herokuapp.com/https://pixelbandspfpbucket.s3.us-east-2.amazonaws.com/assets/${data.get(
        "file_number"
      )}.png`
    )
      .then((res) => {
        if (res.status >= 200 && res.status <= 300) return res.blob();
        else throw Error("File Not Found");
      })
      .then((res) => {
        let URLObj = window.URL || window.webkitURL;
        let source = URLObj.createObjectURL(res);
        setLoading(false);
        setImage(source);
        handleOpen();
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };
  const onDownload = () => {
    const link = document.createElement("a");
    link.download = true;
    link.href = image;
    link.click();
  };
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          border: "2px solid #ccc",
          borderRadius: "4px",
          marginTop: "10%",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile Pic Generator
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="file_number"
              label="File Name"
              name="file_number"
              autoComplete="file_number"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "searching..." : "Search"}
            </Button>
          </Box>
        </Box>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mb: 0,
            bottom: 0,
            bottom: "0px",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Copyright />
          </Container>
        </Box>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src={`https://pixelbandspfpbucket.s3.us-east-2.amazonaws.com/assets/${imageNumber}.png`}
          />
          <Button
            type="download"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
            onClick={onDownload}
          >
            Download
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
