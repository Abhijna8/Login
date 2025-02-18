import { useState, useEffect } from "react";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid, TextField, Card, Tooltip, Container, Menu, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Employee</MenuItem>
            <MenuItem onClick={handleMenuClose}>Customer</MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    fetch("https://reqres.in/api/users?page=2")
      .then((res) => res.json())
      .then((data) => setLoginHistory(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleLogin = async () => {
    if (!firstName || !lastName) {
      toast.error("Enter both First and Last Name!");
      return;
    }

    const newUser = { first_name: firstName, last_name: lastName };
    try {
      const response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      setLoginHistory([...loginHistory, { ...data, id: loginHistory.length + 1 }]);
      setFirstName("");
      setLastName("");
      toast.success("User added successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to add user!");
    }
  };

  return (
    <Box>
      <ButtonAppBar />

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f4f4",
          p: 3,
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} />

        <Card sx={{ p: 3, textAlign: "center", width: "50%", minHeight: "400px" }}>
          <Typography variant="h5" gutterBottom>Login</Typography>
          <TextField fullWidth margin="normal" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Login</Button>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Login History</Typography>
          <Box sx={{ maxHeight: 230, overflowY: "auto", p: 1 }}>
            {loginHistory.map((user) => (
              <Grid container key={user.id} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>{user.first_name} {user.last_name} - ID: {user.id}</Typography>
                <Box>
                  <Tooltip title="Edit User">
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            ))}
          </Box>
        </Card>
      </Container>

      <Box sx={{ mt: 4, p: 2, backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
        <Typography variant="body1">&copy; 2025 User Management System</Typography>
      </Box>
    </Box>
  );
}

export default App;