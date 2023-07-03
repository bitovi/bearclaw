import Box from "@mui/material/Box";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ButtonGroup from "@mui/material/ButtonGroup";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Button } from "~/components/button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AlertTitle from "@mui/material/AlertTitle";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import OutboundIcon from "@mui/icons-material/Outbound";
import ShareIcon from "@mui/icons-material/Share";
import { SeverityTab } from "./severityTab";
import { rateSeverity } from "../utils/rateSeverity";
import type { CveData } from "~/models/rsbomTypes";
import { usePageCopy } from "~/routes/_dashboard/copy";

interface CVEDrawerProps {
  open: boolean;
  selectedCVE: CveData | undefined;
  onClose: () => void;
}

export function CVEDrawer({ selectedCVE, onClose, open }: CVEDrawerProps) {
  const copy = usePageCopy("detail");
  return (
    <Drawer
      onClose={onClose}
      anchor="right"
      open={open}
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
          padding={!selectedCVE?.rating ? "40px 0px 0px 48px" : "unset"}
        >
          {selectedCVE?.rating && (
            <SeverityTab
              rating={selectedCVE.rating}
              height={"112px"}
              width="84px"
              padding="0px 24px 16px 24px"
              borderRadius="32px 0px 56px 0px"
              position="flex-end"
              textVariant="h4"
            />
          )}
          <Stack
            direction="row"
            paddingBottom={1}
            width="100%"
            justifyContent={"space-between"}
          >
            <Typography color="#FFF" variant="h3">
              {selectedCVE?.name || "CVE Name Not Found"}
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
            {copy?.content?.sidebar_details}
          </Typography>
          <Box
            display="grid"
            sx={{
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
            gap={2}
            paddingTop={2}
          >
            {selectedCVE?.source?.name && (
              <Box>
                <AlertTitle> {copy?.content?.sidebar_source}</AlertTitle>
                <Typography variant="body2">
                  {selectedCVE.source.name}
                </Typography>
              </Box>
            )}
            {selectedCVE?.rating && (
              <Box>
                <AlertTitle> {copy?.content?.sidebar_baseScore}</AlertTitle>
                <Typography>
                  {copy?.content?.[rateSeverity(selectedCVE.rating)]}
                </Typography>
                <Typography variant="body2">{selectedCVE.rating}</Typography>
                <Typography></Typography>
              </Box>
            )}
            {selectedCVE?.date && (
              <Box>
                <AlertTitle> {copy?.content?.sidebar_publishedDate}</AlertTitle>
                <Typography variant="body2">{selectedCVE.date}</Typography>
              </Box>
            )}
            {selectedCVE?.lastModified && (
              <Box>
                <AlertTitle> {copy?.content?.sidebar_lastModified}</AlertTitle>
                <Typography variant="body2">
                  {selectedCVE.lastModified}
                </Typography>
              </Box>
            )}
            <Box gridColumn={"span 2"}>
              {selectedCVE?.description && (
                <>
                  <AlertTitle> {copy?.content?.sidebar_description}</AlertTitle>
                  <Typography variant="body2">
                    {selectedCVE.description}
                  </Typography>
                </>
              )}
              <Typography variant="h6" color="#FFF" paddingY={3}>
                {copy?.content?.sidebar_resources}
              </Typography>
              <ButtonGroup fullWidth>
                <Button
                  variant="buttonLargeOutlined"
                  sx={{ color: "#FFF", borderColor: "#FFF" }}
                >
                  <Typography paddingRight={2}>
                    {copy?.content?.sidebar_moreDetailsButton}
                  </Typography>
                  <OutboundIcon />
                </Button>
                <Button
                  variant="buttonLargeOutlined"
                  sx={{ color: "#FFF", borderColor: "#FFF" }}
                >
                  <Typography paddingRight={1}>
                    {copy?.content?.sidebar_shareButton}
                  </Typography>
                  <ShareIcon />
                </Button>
              </ButtonGroup>
              <Typography variant="h6" color="#FFF" paddingY={3}>
                {copy?.content?.sidebar_additionalInformation}
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
