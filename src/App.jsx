import { useState, useEffect } from "react";
import * as React from 'react';
import {
  AppBar, Box, Toolbar, Typography, Button, IconButton, Menu as MuiMenu, MenuItem,
  Grid, TextField, Card, Tooltip, Container, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Employee</MenuItem>
            <MenuItem onClick={handleMenuClose}>Customer</MenuItem>
          </MuiMenu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hey
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
  const [editUser, setEditUser] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Fetch users from API
  useEffect(() => {
    fetch("https://reqres.in/api/users?page=2")
      .then((res) => res.json())
      .then((data) => setLoginHistory(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Add User
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

  // Open Edit Dialog
  const openEdit = (user) => {
    setEditUser(user);
    setEditedFirstName(user.first_name);
    setEditedLastName(user.last_name);
    setOpenEditDialog(true);
  };

  // Update User (API Call)
  const handleEdit = async () => {
    if (!editedFirstName || !editedLastName) {
      toast.error("Both fields are required!");
      return;
    }

    try {
      const response = await fetch(`https://reqres.in/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: editedFirstName, last_name: editedLastName }),
      });

      if (response.ok) {
        setLoginHistory(loginHistory.map(user => user.id === editUser.id ? { ...user, first_name: editedFirstName, last_name: editedLastName } : user));
        setOpenEditDialog(false);
        toast.success("User updated successfully!");
      } else {
        toast.error("Failed to update user!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user!");
    }
  };

  // Delete User (API Call)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLoginHistory(loginHistory.filter(user => user.id !== id));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user!");
    }
  };

  return (
    <Box>
      <ButtonAppBar />
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f6f4f4", p: 3 }}>
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
                    <IconButton color="primary" size="small" onClick={() => openEdit(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton color="error" size="small" onClick={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            ))}
          </Box>
        </Card>
      </Container>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="First Name" value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} />
          <TextField fullWidth margin="normal" label="Last Name" value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={handleEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
