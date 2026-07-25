# Featurevisor OpenFeature example for Node.js

An example Node.js application using Featurevisor through the [OpenFeature server SDK](https://openfeature.dev/docs/reference/technologies/server/javascript/).

The application loads a published Featurevisor datafile, registers the Featurevisor OpenFeature provider, and evaluates a boolean flag through an OpenFeature client.

## Requirements

See the required Node.js version in [`.nvmrc`](./.nvmrc).

## Installation

```sh
npm ci
```

## Running the application

```sh
npm start
```

The provider maps the OpenFeature `targetingKey` field to Featurevisor's `userId` context attribute by default. Other context fields are passed to Featurevisor unchanged.

## Key mapping

Featurevisor flags, variations, and variables use these OpenFeature keys:

| OpenFeature key       | Featurevisor evaluation |
| --------------------- | ------------------------ |
| `checkout`            | Flag                     |
| `checkout:variation`  | Variation                |
| `checkout:title`      | Variable named `title`   |

Use the OpenFeature resolver matching the expected value type. For example:

```js
const enabled = await client.getBooleanValue("checkout", false, context);
const variation = await client.getStringValue(
  "checkout:variation",
  "fallback",
  context,
);
const title = await client.getStringValue(
  "checkout:title",
  "Default title",
  context,
);
```

## Testing

The test uses an in memory datafile, so it does not depend on a remote service:

```sh
npm test
```

It covers a flag, a variation, string and number variables, context mapping, and the OpenFeature default for a missing flag.

## Lifecycle

This example lets the provider create and own its Featurevisor instance. Calling `OpenFeature.close()` closes the provider and releases the Featurevisor instance resources.

The provider can also receive an existing instance through its `featurevisor` option. In that case, the application retains ownership and must close the instance when it is no longer needed.

See the [Featurevisor OpenFeature documentation](https://featurevisor.com/docs/sdks/openfeature/) for provider options, resolution details, tracking, diagnostics, and lifecycle behaviour.

## License

MIT © [Fahad Heylaal](https://fahad19.com)
