import { createClient } from "@sanity/client";
import { config } from "./config.server";

const mainClient = createClient(config);

export const getClient = () =>  mainClient;
