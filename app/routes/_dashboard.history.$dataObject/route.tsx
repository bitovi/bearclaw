import { Box } from "@mui/material";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
  const { dataObject } = params;
  return json({ dataObject });
}

export default function Route() {
  const { dataObject } = useLoaderData<typeof loader>();
  return <Box>Howdy {dataObject} </Box>;
}
