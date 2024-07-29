import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React, { useEffect, useState } from "react";
import noImageCropped from "../../../images/noImageCropped.png";

export default function SearchAnalytics({
  myQuizzes,
  searchTerm,
  setSearchTerm,
}) {
  const [searchOptions, setSearchOptions] = useState([]);

  useEffect(() => {
    setSearchOptions(
      myQuizzes.map(quiz => ({
        title: quiz.title,
        image: quiz.imageUrl,
      }))
    );
  }, [myQuizzes]);

  return (
    <>
      <Grid item lg={5} md={6} xs={12} ml={-1}>
        <Autocomplete
          freeSolo
          options={
            !searchTerm ? [{ title: "Please enter keywords" }] : searchOptions
          }
          getOptionLabel={option => option.title || ""}
          inputValue={searchTerm}
          onInputChange={(event, newInputValue) => {
            setSearchTerm(newInputValue);
          }}
          renderInput={params => (
            <TextField
              {...params}
              fullWidth
              label="Search"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}
          getOptionDisabled={option => option.title === "Please enter keywords"}
          renderOption={(props, option, { inputValue }) => {
            const { key, ...optionProps } = props;

            const matches = match(option.title, inputValue, {
              insideWords: true,
            });
            const parts = parse(option.title, matches);
            return (
              <Box key={key} {...optionProps}>
                {searchTerm && (
                  <img
                    src={option.image || noImageCropped}
                    alt="search option for the quiz results"
                    width="40"
                    height="40"
                    style={{
                      marginRight: 10,
                      borderRadius: "8px",
                      filter: "brightness(50%)",
                    }}
                  />
                )}
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      color: part.highlight ? "#00a76f" : "inherit",
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </Box>
            );
          }}
        />
      </Grid>
    </>
  );
}
