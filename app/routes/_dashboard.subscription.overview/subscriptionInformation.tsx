import { Box, Typography } from "@mui/material";
import type { Subscription } from "@prisma/client";
import dayjs from "dayjs";
export function SubscriptionInformation({
  subscription,
}: {
  subscription?: Subscription;
}) {
  return (
    <Box>
      <Box component="h1">Plan Information</Box>
      <br />
      {subscription ? (
        <Box display="flex" flexDirection="column" alignItems={"flex-start"}>
          <Typography>
            Subscription type: {subscription.subscriptionLevel}
          </Typography>
          <Typography>
            Subscription status: {subscription.activeStatus}
          </Typography>
          {subscription.cancellationDate && (
            <Typography>
              Subscription ends on:{" "}
              {dayjs(new Date(subscription.cancellationDate * 1000)).format(
                "MMMM DD, YYYY"
              )}
            </Typography>
          )}
        </Box>
      ) : (
        <Box>No plan information to display</Box>
      )}
    </Box>
  );
}
