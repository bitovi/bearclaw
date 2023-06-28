import {
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonGroup,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import OutboundIcon from "@mui/icons-material/Outbound";
import ShareIcon from "@mui/icons-material/Share";
import { SeverityTab } from "./severityTab";
import { rateSeverity } from "../utils/rateSeverity";
import { WarningText } from "../types";
import { Button } from "~/components/button";

interface CVEDrawerProps {
  selectedCVE: any;
  onClose: () => void;
}

export function CVEDrawer({ selectedCVE, onClose }: CVEDrawerProps) {
  return (
    <Drawer
      onClose={onClose}
      anchor="right"
      open={!!selectedCVE}
      PaperProps={{
        sx: {
          borderRadius: "48px 0px 0px 0px",
          padding: "0px 48px 48px 0px",
          width: "502px",
          backgroundColor: "#212121",
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#FFF",
          },
        },
      }}
      sx={{
        gap: "48px",
        flexShrink: 0,
        display: "flex",
        alignItems: "flex-start",
      }}
      className="detailDrawer"
    >
      <Stack
        color="white"
        sx={{ overflow: "hidden", overflowWrap: "break-word" }}
      >
        <Stack
          direction="row"
          alignItems="flex-end"
          gap="16px"
          alignSelf="stretch"
        >
          <SeverityTab
            rating="8.8"
            height={"112px"}
            width="84px"
            padding="0px 24px 16px 24px"
            borderRadius="32px 0px 56px 0px"
            position="flex-end"
            textVariant="h4"
          />
          <Stack
            direction="row"
            paddingBottom={1}
            width="100%"
            justifyContent={"space-between"}
          >
            <Typography color="#FFF" variant="h3">
              CVE-2023-1389
            </Typography>
            <IconButton
              sx={{ height: "35px", width: "35px" }}
              onClick={onClose}
            >
              <CloseIcon
                sx={{ color: "#FFF", height: "35px", width: "35px" }}
              />
            </IconButton>
          </Stack>
        </Stack>
        <Stack
          padding="0px 0px 0px 48px"
          paddingTop={5}
          sx={{ overflowY: "scroll" }}
        >
          <Typography variant="h6" color="#FFF">
            Details
          </Typography>
          <Box
            display="grid"
            sx={{
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
            gap={2}
            paddingTop={2}
          >
            <Box>
              <AlertTitle>Source</AlertTitle>
              <Typography variant="body2">
                Tenable Network Security, Inc.
              </Typography>
            </Box>
            <Box>
              <AlertTitle>Base Score</AlertTitle>
              <Typography>{WarningText[rateSeverity("8.8")]}</Typography>
              <Typography variant="body2">8.8</Typography>
              <Typography></Typography>
            </Box>
            <Box>
              <AlertTitle>Published Date</AlertTitle>
              <Typography variant="body2">
                Tenable Network Security, Inc.
              </Typography>
            </Box>
            <Box>
              <AlertTitle>Last Modified</AlertTitle>
              <Typography variant="body2">
                Tenable Network Security, Inc.
              </Typography>
            </Box>
            <Box gridColumn={"span 2"}>
              <AlertTitle>Description</AlertTitle>
              <Typography variant="body2">
                TP-Link Archer AX21 (AX1800) firmware versions before 1.1.4
                Build 20230219 contained a command injection vulnerability in
                the country form of the /cgi-bin/luci;stok=/locale endpoint on
                the web management interface. Specifically, the country
                parameter of the write operation was not sanitized before being
                used in a call to popen(), allowing an unauthenticated attacker
                to inject commands, which would be run as root, with a simple
                POST request.
              </Typography>
              <Typography variant="h6" color="#FFF" paddingY={3}>
                Resources
              </Typography>
              <ButtonGroup fullWidth>
                <Button
                  variant="buttonLargeOutlined"
                  sx={{ color: "#FFF", borderColor: "#FFF" }}
                >
                  <Typography paddingRight={2}>More Details</Typography>
                  <OutboundIcon />
                </Button>
                <Button
                  variant="buttonLargeOutlined"
                  sx={{ color: "#FFF", borderColor: "#FFF" }}
                >
                  <Typography paddingRight={1}>Share</Typography>
                  <ShareIcon />
                </Button>
              </ButtonGroup>
              <Typography variant="h6" color="#FFF" paddingY={3}>
                Additional Information
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Option 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Option 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Option 3</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}
