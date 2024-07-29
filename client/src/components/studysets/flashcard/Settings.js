import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Alert,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  FormControlLabel,
  Grow,
  IconButton,
  Input,
  Slider,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function Settings({
  open,
  onClose,
  shuffle: initialShuffle,
  setShuffle,
  showAnswerFirst: initialShowAnswerFirst,
  setShowAnswerFirst,
  timerEnabled: initialTimerEnabled,
  setTimerEnabled,
  timerDuration: initialTimerDuration,
  setTimerDuration,
  repeatIncorrect: initialRepeatIncorrect,
  setRepeatIncorrect,
}) {
  const [tempShuffle, setTempShuffle] = useState(initialShuffle);
  const [tempShowAnswerFirst, setTempShowAnswerFirst] = useState(
    initialShowAnswerFirst
  );
  const [tempTimerEnabled, setTempTimerEnabled] = useState(initialTimerEnabled);
  const [tempTimerDuration, setTempTimerDuration] =
    useState(initialTimerDuration);
  const [tempRepeatIncorrect, setTempRepeatIncorrect] = useState(
    initialRepeatIncorrect
  );

  useEffect(() => {
    if (!open) {
      setTempShuffle(initialShuffle);
      setTempShowAnswerFirst(initialShowAnswerFirst);
      setTempTimerEnabled(initialTimerEnabled);
      setTempTimerDuration(initialTimerDuration);
      setTempRepeatIncorrect(initialRepeatIncorrect);
    }
  }, [
    open,
    initialShuffle,
    initialShowAnswerFirst,
    initialTimerEnabled,
    initialTimerDuration,
    initialRepeatIncorrect,
  ]);

  const hasUnsavedChanges = () => {
    return (
      tempShuffle !== initialShuffle ||
      tempShowAnswerFirst !== initialShowAnswerFirst ||
      tempTimerEnabled !== initialTimerEnabled ||
      tempTimerDuration !== initialTimerDuration ||
      tempRepeatIncorrect !== initialRepeatIncorrect
    );
  };

  const handleSave = () => {
    setShuffle(tempShuffle);
    setShowAnswerFirst(tempShowAnswerFirst);
    setTimerEnabled(tempTimerEnabled);
    setTimerDuration(tempTimerDuration);
    setRepeatIncorrect(tempRepeatIncorrect);
    onClose();
  };

  const handleReset = () => {
    setTempShuffle(false);
    setTempShowAnswerFirst(false);
    setTempTimerEnabled(false);
    setTempTimerDuration(0);
    setTempRepeatIncorrect(true);
  };

  const handleBlur = () => {
    if (tempTimerDuration < 0) {
      setTempTimerDuration(0);
    } else if (tempTimerDuration > 100) {
      setTempTimerDuration(100);
    }
  };

  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor="right"
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          position: "absolute",
          height: "100%",
          width: "320px",
          outline: "0px",
          backdropFilter: "blur(20px)",
          backgroundColor: "#28323D",
          backgroundImage:
            "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/cyan-blur.png), url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/red-blur.png)",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "right top, left bottom",
          boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
          backgroundSize: "50%, 50%",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
          Settings
        </Typography>
        <Tooltip title="Reset">
          <Badge
            color="error"
            variant="dot"
            invisible={
              !tempShuffle &&
              !tempShowAnswerFirst &&
              !tempTimerEnabled &&
              tempRepeatIncorrect
            }
            overlap="circular"
          >
            <IconButton sx={{ flex: "0 0 auto" }} onClick={handleReset}>
              <Icon icon="solar:restart-bold" width="20" height="20" />
            </IconButton>
          </Badge>
        </Tooltip>
        <IconButton sx={{ flex: "0 0 auto" }} onClick={onClose}>
          <Icon icon="mingcute:close-line" width="20" height="20" />
        </IconButton>
      </Box>
      <Divider sx={{ borderStyle: "dashed" }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box
          sx={{
            padding: theme => theme.spacing(3, 2.5),
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={tempShuffle}
                onChange={e => setTempShuffle(e.target.checked)}
              />
            }
            label="Shuffle Flashcards"
          />
          <FormControlLabel
            control={
              <Switch
                checked={tempShowAnswerFirst}
                onChange={e => setTempShowAnswerFirst(e.target.checked)}
              />
            }
            label="Show Answer First"
          />
          <FormControlLabel
            control={
              <Switch
                checked={tempRepeatIncorrect}
                onChange={e => setTempRepeatIncorrect(e.target.checked)}
              />
            }
            label="Repeat Incorrect Answers"
          />
          <FormControlLabel
            control={
              <Switch
                checked={tempTimerEnabled}
                onChange={e => {
                  setTempTimerEnabled(e.target.checked);
                }}
              />
            }
            label="Enable Timer"
          />
          <Collapse in={tempTimerEnabled}>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography gutterBottom>Timer duration (seconds)</Typography>
                <Slider
                  value={
                    typeof tempTimerDuration === "number"
                      ? tempTimerDuration
                      : 0
                  }
                  onChange={(e, newValue) => setTempTimerDuration(newValue)}
                  step={10}
                  marks
                  min={10}
                  max={120}
                  valueLabelDisplay="auto"
                />
              </div>{" "}
              <Input
                value={tempTimerDuration}
                size="small"
                onChange={e =>
                  setTempTimerDuration(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                onBlur={handleBlur}
                inputProps={{
                  step: 10,
                  min: 10,
                  max: 120,
                  type: "number",
                }}
                sx={{
                  width: "50px",
                }}
              />
            </Box>
          </Collapse>
        </Box>

        <div>
          <Box sx={{ padding: theme => theme.spacing(0, 3, 2) }}>
            <Grow in={hasUnsavedChanges()}>
              <Alert color="warning">You have unsaved changes!</Alert>
            </Grow>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(28, 37, 46, 0.9)",
              backgroundImage:
                "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/cyan-blur.png), url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/red-blur.png)",
              backgroundRepeat: "no-repeat, no-repeat",
              backgroundPosition: "right top, left bottom",
              boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
              backgroundSize: "50%, 50%",
            }}
          >
            <Button
              color="success"
              onClick={handleSave}
              sx={{
                width: "100%",
                margin: "auto",
                bgcolor: "rgba(34 197 94 / 0.16)",
                padding: "10px",
                color: "success.light",
              }}
              startIcon={<Icon icon="mingcute:check-line" />}
            >
              Save Settings
            </Button>
          </Box>
        </div>
      </Box>
    </Drawer>
  );
}
