import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function Logo() {
  return (
    <Box display="flex" alignItems="center" width="100%" gap="1rem">
      <img
        src="/images/bearclaw.png"
        alt=""
        width="30px"
        style={{ transform: "rotate(-22deg)", filter: "brightness(0)" }}
      />
      <div>
        <Typography
          fontWeight="900"
          fontSize="2rem"
          display="inline"
          color="rgba(0, 0, 0, 0.87)"
        >
          BEAR
        </Typography>
        <Typography
          fontWeight="900"
          fontSize="2rem"
          color="#F5F5F5"
          display="inline"
          borderColor={"blue"}
          sx={{
            textShadow: `
                -1px -1px 0 #0037FF,  
                1px -1px 0 #0037FF,
                -1px 1px 0 #0037FF,
                1px 1px 0 #0037FF`,
          }}
        >
          CLAW
        </Typography>
      </div>
    </Box>
  );
}
