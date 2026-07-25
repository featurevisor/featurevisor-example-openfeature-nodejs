import assert from "node:assert/strict";
import test from "node:test";

import { FeaturevisorOpenFeatureProvider } from "@featurevisor/openfeature-provider-node";
import { OpenFeature } from "@openfeature/server-sdk";

const datafile = {
  schemaVersion: "2",
  revision: "test",
  segments: {},
  features: {
    checkout: {
      bucketBy: "userId",
      variations: [
        {
          value: "on",
          variables: {
            title: "Welcome",
            retryLimit: 3,
          },
        },
      ],
      variablesSchema: {
        title: {
          type: "string",
          defaultValue: "Default title",
        },
        retryLimit: {
          type: "integer",
          defaultValue: 0,
        },
      },
      traffic: [
        {
          key: "everyone",
          segments: "*",
          percentage: 100000,
          variation: "on",
        },
      ],
    },
  },
};

test("evaluates Featurevisor flags, variations, and variables through OpenFeature", async () => {
  const domain = "featurevisor-test";
  const provider = new FeaturevisorOpenFeatureProvider({
    datafile,
    logLevel: "fatal",
  });

  try {
    await OpenFeature.setProviderAndWait(domain, provider);

    const client = OpenFeature.getClient(domain);
    const context = { targetingKey: "user-123" };

    assert.equal(await client.getBooleanValue("checkout", false, context), true);
    assert.equal(
      await client.getStringValue("checkout:variation", "fallback", context),
      "on",
    );
    assert.equal(
      await client.getStringValue("checkout:title", "fallback", context),
      "Welcome",
    );
    assert.equal(await client.getNumberValue("checkout:retryLimit", 0, context), 3);

    const missing = await client.getBooleanDetails("missing", true, context);
    assert.equal(missing.value, true);
    assert.equal(missing.errorCode, "FLAG_NOT_FOUND");
  } finally {
    await OpenFeature.close();
  }
});
