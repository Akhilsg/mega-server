import { Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Flip from "react-card-flip";

export default function Flashcard({
  flashcard,
  flipped,
  setFlipped,
  showAnswerFirst,
  timerEnabled,
  timerDuration,
}) {
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  useEffect(() => {
    if (showAnswerFirst) {
      setFlipped(true);
    } else {
      setFlipped(false);
    }
  }, [showAnswerFirst, setFlipped]);

  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerDuration);
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerEnabled, timerDuration]);

  useEffect(() => {
    if (timerEnabled && timeLeft === 0) {
      setFlipped(true);
    }
  }, [timeLeft, timerEnabled, setFlipped]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Flip isFlipped={flipped} flipDirection="vertical">
      <Card
        sx={{
          mb: 2,
          width: "50vw",
          minHeight: 325,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": { cursor: "pointer", bgcolor: "rgba(145 158 171 / 0.08)" },
        }}
        onClick={handleFlip}
      >
        <CardContent>
          <Typography align="center" variant="h5">
            {flashcard.question}
          </Typography>
          {timerEnabled && (
            <Typography
              align="center"
              variant="subtitle2"
              color="text.secondary"
            >
              Time left: {timeLeft}s
            </Typography>
          )}
        </CardContent>
      </Card>
      <Card
        sx={{
          mb: 2,
          width: "50vw",
          minHeight: 325,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": { cursor: "pointer", bgcolor: "rgba(145 158 171 / 0.08)" },
        }}
        onClick={handleFlip}
      >
        <CardContent>
          <Typography align="center" variant="h5">
            {flashcard.answer}
          </Typography>
        </CardContent>
      </Card>
    </Flip>
  );
}
