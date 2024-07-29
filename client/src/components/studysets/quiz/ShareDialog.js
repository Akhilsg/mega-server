import { Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { Share } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../../common/components/SnackbarContext";
import { fetchProfileImage } from "../../../common/ProfileImage";
import noResults from "../../../images/noResults.png";
import searchImage from "../../../images/search.png";
import { shareQuiz } from "../../../services/quiz.service";

export default function ShareDialog({ open, setOpen, selectedQuizId }) {
  const { user } = useSelector(state => state.auth);
  const { users } = useSelector(state => state.user);
  const [profileImages, setProfileImages] = useState({});
  const [shareSearchTerm, setShareSearchTerm] = useState("");
  const [shareLoading, setShareLoading] = useState(null);
  const snackbar = useSnackbar();

  useEffect(() => {
    const fetchProfileImages = async () => {
      const profiles = await Promise.all(
        users.map(async user => {
          const imageUrl = await fetchProfileImage(user._id);
          return { userId: user._id, imageUrl };
        })
      );

      const images = {};
      profiles.forEach(profile => {
        images[profile.userId] = profile.imageUrl;
      });

      setProfileImages(images);
    };

    fetchProfileImages();
  }, [users]);

  const handleShareUserClick = async senderId => {
    setShareLoading(senderId);

    try {
      await shareQuiz(user.id, senderId, selectedQuizId);
      setShareLoading(null);
      setOpen(false);
      setShareSearchTerm("");

      snackbar.success(
        `A share request has been sent to user with id: ${senderId}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isQueryInUser = (user, query) => {
    const lowerCaseQuery = query.toLowerCase();

    for (let i = 0; i < lowerCaseQuery.length; i++) {
      if (!user.toLowerCase().includes(lowerCaseQuery[i])) {
        return false;
      }
    }
    return true;
  };

  const highlightMatch = (text, query) => {
    const lowerCaseQuery = query.toLowerCase();
    const parts = [];
    let currentIndex = 0;

    for (let i = 0; i < lowerCaseQuery.length; i++) {
      const index = text.toLowerCase().indexOf(lowerCaseQuery[i], currentIndex);

      if (index !== -1) {
        parts.push(text.substring(currentIndex, index));
        parts.push(
          <span style={{ background: "#abe098" }}>{text.substr(index, 1)}</span>
        );
        currentIndex = index + 1;
      }
    }

    parts.push(text.substring(currentIndex));

    return parts;
  };

  const filterUsers = () => {
    return users.filter(user => isQueryInUser(user.username, shareSearchTerm));
  };

  const handleSearch = event => {
    setShareSearchTerm(event.target.value);
  };

  const filteredUsers = filterUsers();

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>Share Quiz</DialogTitle>
      <DialogContent>
        <List>
          <TextField
            label="Search"
            variant="outlined"
            autoFocus
            fullWidth
            value={shareSearchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: shareSearchTerm ? 2 : 0 }}
          />
          {!shareSearchTerm ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                my: "2rem",
                gap: 1,
              }}
            >
              <img
                src={searchImage}
                alt="Search for a user"
                width="600"
                height="337"
                style={{
                  width: "500px",
                  height: "350px",
                  objectFit: "cover",
                }}
              />
            </Box>
          ) : shareSearchTerm && !filteredUsers?.length ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                my: 2,
              }}
            >
              <img
                src={noResults}
                alt="Search for a user"
                width="600"
                height="337"
                style={{
                  width: "500px",
                  height: "350px",
                  objectFit: "cover",
                }}
              />
            </Box>
          ) : (
            <>
              {filteredUsers?.map(user => (
                <ListItemButton
                  divider
                  key={user.id}
                  disabled={shareLoading === user._id}
                >
                  <ListItem
                    secondaryAction={
                      <Button
                        onClick={() => handleShareUserClick(user._id)}
                        startIcon={<Share />}
                        sx={{ color: "primary.dark" }}
                      >
                        Share
                      </Button>
                    }
                    disablePadding
                  >
                    {shareLoading === user._id ? (
                      <CircularProgress
                        size={25}
                        sx={{ color: "grey.600", mr: 1.2 }}
                      />
                    ) : (
                      <ListItemAvatar>
                        <Avatar src={profileImages[user._id]} />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={highlightMatch(user.username, shareSearchTerm)}
                      secondary={user.email}
                    />
                  </ListItem>
                </ListItemButton>
              ))}
            </>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
