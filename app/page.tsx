import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box width="100wh" height="100vh">
      <iframe
        src="/iframe"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </Box>
  );
}
