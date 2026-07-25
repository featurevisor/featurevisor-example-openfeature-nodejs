import { FeaturevisorOpenFeatureProvider } from "@featurevisor/openfeature-provider-node";
import { OpenFeature } from "@openfeature/server-sdk";

const DATAFILE_URL =
  "https://featurevisor-example-cloudflare.pages.dev/production/featurevisor-tag-all.json";

async function fetchDatafile() {
  const response = await fetch(DATAFILE_URL);

  if (!response.ok) {
    throw new Error(`Could not fetch datafile: HTTP ${response.status}`);
  }

  return response.json();
}

async function main() {
  const datafile = await fetchDatafile();
  const provider = new FeaturevisorOpenFeatureProvider({ datafile });

  try {
    await OpenFeature.setProviderAndWait(provider);

    const client = OpenFeature.getClient("featurevisor-example-openfeature-nodejs");
    const featureKey = "my_feature";
    const context = {
      targetingKey: "user-123",
      deviceId: "device-123",
    };

    const enabled = await client.getBooleanValue(featureKey, false, context);

    console.log(`Feature "${featureKey}" is ${enabled ? "enabled" : "disabled"}`);
  } finally {
    await OpenFeature.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
