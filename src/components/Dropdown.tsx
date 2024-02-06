import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

interface DropdownProps {
  value: string;
  label: string;
  options: string[];
  handleChange: (event: SelectChangeEvent) => void;
  error?: boolean;
}

export default function Dropdown({
  value,
  label,
  options,
  handleChange,
  error,
}: DropdownProps) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth error={error}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{label} is required</FormHelperText>}
      </FormControl>
    </Box>
  );
}
