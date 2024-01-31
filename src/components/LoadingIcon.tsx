import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface CircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = (
  props
) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;

// Usage
// <CircularProgressWithLabel value={percentage} /> // Use percentage variable
