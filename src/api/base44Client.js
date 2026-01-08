import { createClient } from "@base44/sdk";
import { appParams } from "@/lib/app-params.js";

const { appId, token, functionsVersion, appBaseUrl, backendUrl } = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: backendUrl, // e.g. "https://base44.app"
  requiresAuth: false,
  appBaseUrl,
});
