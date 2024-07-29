import React from "react";

export default function FlashcardResults({ score, flashcards }) {
  return (
    <div>
      Your score is {score}/{flashcards.length}
    </div>
  );
}
