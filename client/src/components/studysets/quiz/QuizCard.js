import { Icon } from "@iconify/react/dist/iconify.js";
import { MoreVert } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { CopyCheck, PencilLine } from "lucide-react";
import moment from "moment/moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import noImage from "../../../images/noImage.png";

export default function QuizCard({
  filteredQuiz,
  handleDeleteQuiz,
  handleShareClick,
}) {
  const [delLoading, setDelLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(false);
  const navigate = useNavigate();

  const handleDelete = quizId => {
    if (confirmDelete === quizId) {
      setDelLoading(true);

      try {
        handleDeleteQuiz(quizId);
        setDelLoading(false);
        setConfirmDelete(null);
      } catch (error) {
        console.error(error);
        setDelLoading(false);
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(quizId);
    }
  };

  return (
    <>
      <Grow in>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "15px",
            position: "relative",
            mb: 3,
          }}
        >
          <CardMedia
            component="img"
            image={
              filteredQuiz.image ? filteredQuiz.image.url || noImage : noImage
            }
            alt={filteredQuiz.description}
            sx={{
              width: "auto",
              margin: 1,
              borderRadius: 2,
              height: 151,
              filter: "brightness(60%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              padding: "4px 6px 4px 6px",
              borderRadius: 2,
              top: "20px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              left: "20px",
              color: "primary.contrastText",
              backgroundColor: "background.paper",
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
            }}
          >
            {filteredQuiz.gametype.name === "mcq" ? (
              <Tooltip title="Multiple Choice Quiz">
                <>
                  <CopyCheck size={20} /> {filteredQuiz.questions.length} q
                  {filteredQuiz.questions.length > 1 ? "'s" : ""}
                </>
              </Tooltip>
            ) : (
              <Tooltip title="Written Quiz">
                <>
                  <PencilLine size={20} /> {filteredQuiz.questions.length} q's
                </>
              </Tooltip>
            )}
          </Box>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  width: "200px",
                  position: "relative",
                }}
              >
                <Typography variant="body2" color="#637381" gutterBottom>
                  Created {moment(filteredQuiz.createdAt).fromNow()}
                </Typography>
                <Typography
                  onClick={() => navigate(`/studyset/${filteredQuiz._id}`)}
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    textOverflow: "ellipsis",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {filteredQuiz.title}
                </Typography>
              </Box>
            </Box>

            <Typography color="text.secondary" component="div">
              {filteredQuiz.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: 1,
              }}
            >
              <Tooltip title="More" arrow>
                <IconButton
                  onClick={e => setAnchorEl(e.currentTarget)}
                  size="small"
                  edge="end"
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Grow>
      <Menu
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setConfirmDelete(false);
        }}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => navigate(`/flashcard/${filteredQuiz._id}`)}>
          <Icon icon="solar:file-text-bold" width="24" height="24" />
          Flashcards
        </MenuItem>
        <MenuItem onClick={() => handleShareClick(filteredQuiz._id)}>
          <Icon icon="solar:share-bold" width="24" height="24" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => handleDelete(filteredQuiz._id)}
          disabled={delLoading}
        >
          {confirmDelete === filteredQuiz._id ? (
            <Zoom in timeout={300}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: delLoading ? "disabled.main" : "success.main",
                  gap: 1,
                }}
              >
                <Icon icon="solar:check-circle-bold" width={24} height={24} />
                Confirm
              </Box>
            </Zoom>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: delLoading ? "disabled.main" : "error.main",
                gap: 1,
              }}
            >
              <Icon
                icon="solar:trash-bin-minimalistic-bold"
                width={24}
                height={24}
              />
              Delete
            </Box>
          )}
          {delLoading && confirmDelete === filteredQuiz._id && (
            <CircularProgress
              size={30}
              sx={{
                position: "absolute",
                top: 3,
                left: 5,
                zIndex: 1,
              }}
            />
          )}
        </MenuItem>
      </Menu>
    </>
  );
}
