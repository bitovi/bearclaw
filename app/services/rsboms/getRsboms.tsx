// Example response from the API
// {
//   "bc_rsbom_cyclonedx_aggregate": [
//     {
//       "@timestamp": "2022-12-12T13:55:33.388000",
//       "dataObject": "b4a671022521a8f60cac4f0538632fca9edf0210a77161605b12cb2c427e1c80",
//       "filename": "over_flow",
//       "id": "85bd279304d1487ebb51eb1ea1f239dc"
//     },
//   ]
// }

type RsbomApi = {
  "@timestamp": string;
  dataObject: string;
  filename: string;
  id: string;
};

type RsbomApiResponse = {
  bc_rsbom_cyclonedx_aggregate: RsbomApi[];
};

type Rsbom = {
  timestamp: string;
  dataObject: string;
  filename: string;
  id: string;
};

const transformRsbom = (rsbom: RsbomApi): Rsbom => ({
  timestamp: rsbom["@timestamp"],
  dataObject: rsbom.dataObject,
  filename: rsbom.filename,
  id: rsbom.id,
});

export const getRsboms = async (): Promise<Rsbom[]> => {
  const url = `${process.env.BEARCLAW_URL}/bear/get_rsboms_cyclonedx`;
  try {
    const response = await fetch(url);
    const json: RsbomApiResponse = await response.json();
    return json.bc_rsbom_cyclonedx_aggregate.map(transformRsbom);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(url, error);
    }
    // TODO: Send error to Sentry?
    throw new Error("Unable to get rSBOMs");
  }
};
