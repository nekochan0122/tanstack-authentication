import concurrently from 'concurrently'

concurrently(
  [
    {
      name: 'client',
      prefixColor: '#58c4dc',
      command: 'pnpm client:dev',
    },
    {
      name: 'server',
      prefixColor: '#fe6f32',
      command: 'pnpm server:dev',
    },
  ],
)
