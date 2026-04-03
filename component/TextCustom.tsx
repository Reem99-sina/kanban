'use client';

import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type CustomTextFieldProps = TextFieldProps & {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CustomTextField({ placeholder = "Search...", value, onChange, ...props }: CustomTextFieldProps) {
  return (
    <TextField
      placeholder={placeholder}
      size="small"
      value={value}
      onChange={onChange}
      {...props}
      sx={{
        ml: 2,
        "& .MuiInputBase-root": {
          bgcolor: "#a0a0a0",
          borderRadius: 2,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#a0a0a0",
        },
        ...props.sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
    />
  );
}