const common_options = {
  mode: "development",
  target: "node",
  stats: {
    orphanModules: true,
  },
  devtool: "source-map",
  optimization: {mangleExports: false}
};

const entries = [
  {
    name: "client",
    entry: "./src/entrypoints/client.mjs",
  },
  {
    name: "server",
    entry: "./src/entrypoints/server.mjs",
  },
  {
    name: "full",
    entry: "./src/index.mjs",
  }
];

const node_externals = [
  "ws",
  "crypto",
  "node:http",
  "node:net",
  "node:dgram",
  "node:dns/promises",
  "ipaddr.js"
];

module.exports = entries.flatMap((entry) => [
  {
    ...entry,
    ...common_options,
    experiments: {outputModule: true},
    externalsType: "module",
    externals: node_externals,
    output: {
      filename: `wisp-${entry.name}.mjs`,
      library: {type: "module"}
    }
  },
  {
    ...entry,
    ...common_options,
    output: {
      filename: `wisp-${entry.name}.cjs`,
      library: {type: "commonjs"}
    },
    externals: {
      ...Object.fromEntries(node_externals.map((name) => [name, `commonjs ${name}`]))
    },
    optimization: {minimize: false}
  }
]);