console.log('xxx')
const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
console.log(isProduction)
export const BASE_URL = isProduction
  ? 'http://localhost:5001'
  : 'https://socket-io-app-mern-deployed-production.up.railway.app'
