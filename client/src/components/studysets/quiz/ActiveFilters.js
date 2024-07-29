import { Icon } from "@iconify/react/dist/iconify.js";
import { AutoAwesome, KeyboardArrowDown, Search } from "@mui/icons-material";
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import moment from "moment";
import React, { useEffect, useState } from "react";
import noImageCropped from "../../../images/noImageCropped.png";

const Filters = ({ filterValues, setFilterValues }) => {
  const filterCategories = {
    startDate: filterValues.startDate ? `${filterValues.startDate}` : null,
    endDate: filterValues.endDate ? `${filterValues.endDate}` : null,
    gradeLevels: filterValues.gradeLevels,
    difficulty: filterValues.difficulty,
  };

  const handleDelete = (category, value) => {
    setFilterValues({
      ...filterValues,
      [category]: filterValues[category].filter(
        filterValue => filterValue !== value
      ),
    });
  };

  const handleRemoveDate = category => {
    setFilterValues({
      ...filterValues,
      [category]: null,
    });
  };

  const handleClear = () => {
    setFilterValues({
      startDate: null,
      endDate: null,
      gradeLevels: [],
      difficulty: [],
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        alignItems: "center",
        mb: 2,
        overflow: "hidden",
      }}
    >
      {Object.entries(filterCategories).map(([category, values]) => {
        if (values && values.length > 0) {
          return (
            <Box
              key={category}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                border: "1px dashed rgba(145, 158, 171, 0.2)",
                borderRadius: "10px",
                padding: "4px 8px",
                marginBottom: "4px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, mr: 1, textTransform: "capitalize" }}
              >
                {category.replace(/([A-Z])/g, " $1").trim()}:
              </Typography>
              {Array.isArray(values) ? (
                values.map(value => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() => handleDelete(category, value)}
                    sx={{
                      height: "24px",
                      mr: "4px",
                      textTransform: "capitalize",
                    }}
                  />
                ))
              ) : (
                <Chip
                  label={moment(values).format("MMM Do YYYY")}
                  onDelete={() => handleRemoveDate(category)}
                  sx={{
                    height: "24px",
                    mr: "4px",
                    textTransform: "capitalize",
                  }}
                />
              )}
            </Box>
          );
        }
        return null;
      })}
      <Button
        color="error"
        onClick={handleClear}
        startIcon={
          <Icon
            icon="solar:trash-bin-minimalistic-bold"
            width={24}
            height={24}
          />
        }
      >
        Clear
      </Button>
    </Box>
  );
};

export default function ActiveFilters({
  myQuizzes,
  searchTerm,
  setSearchTerm,
  setDrawerOpen,
  filterValues,
  sortOrder,
  handleSortChange,
  filteredQuizzes,
  setFilterValues,
}) {
  const [searchOptions, setSearchOptions] = useState([]);
  const navigate = useNavigate();

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
      <Grid item xs="auto" maxWidth="100%" alignItems="center">
        <Box
          sx={{
            display: "flex",
            flexBasis: "100%",
            alignItems: "center",
          }}
        >
          <Button
            sx={{ mr: 1 }}
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            endIcon={
              <Badge
                color="error"
                overlap="circular"
                variant="dot"
                invisible={
                  !filterValues.startDate &&
                  !filterValues.endDate &&
                  filterValues.gradeLevels.length === 0 &&
                  filterValues.difficulty.length === 0
                }
              >
                <Icon icon="ic:round-filter-list" width="24" height="24" />
              </Badge>
            }
          >
            Filters
          </Button>
          <FormControl size="small">
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              displayEmpty
              sx={{
                "& fieldset": { border: "none" },
                "&:hover": {
                  transition:
                    "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                  backgroundColor: theme => theme.palette.action.hover,
                },
              }}
              renderValue={value => (
                <Box sx={{ mr: "6px", fontWeight: 700 }} fontSize="14px">
                  Sort by: {value}
                </Box>
              )}
              IconComponent={KeyboardArrowDown}
            >
              <MenuItem value="Latest">Latest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => navigate("/generate/studyset")}
            startIcon={<AutoAwesome />}
            sx={{ ml: 1 }}
          >
            Create Studyset
          </Button>
        </Box>
      </Grid>

      {!filterValues.startDate &&
      !filterValues.endDate &&
      filterValues.gradeLevels.length === 0 &&
      filterValues.difficulty.length === 0 ? null : (
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong style={{ color: "white" }}>{filteredQuizzes.length}</strong>{" "}
            results found
          </Typography>
          <Filters
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
        </Grid>
      )}
    </>
  );
}
