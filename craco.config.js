module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'h',
                  pragmaFrag: 'Fragment',
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
  webpack: {
    configure: {
      resolve: {
        alias: {
          inferno:
            process.env.NODE_ENV !== 'production'
              ? 'inferno/dist/index.dev.esm.js'
              : 'inferno/dist/index.esm.js',
          react: 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat', // Must be below test-utils
          'react/jsx-runtime': 'preact/jsx-runtime',
        },
      },
    },
  },
  babel: {
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    // plugins: [],
    loaderOptions: (babelLoaderOptions) => {
      return babelLoaderOptions;
    },
  },
};
