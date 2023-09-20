export const isMainnet = () => (process.env.IS_MAINNET as string) === 'true';

export const EXPLORER_API_URL = () =>
  (isMainnet
    ? (process.env.EXPLORER_MAINNET_API_URL as string)
    : (process.env.EXPLORER_TESTNET_API_URL as string)
  )?.replace(/[\\/]+$/, '');

export const NODE_API_URL = (isMainnet: boolean) =>
  (isMainnet
    ? (process.env.NODE_MAINNET_API_URL as string)
    : (process.env.NODE_TESTNET_API_URL as string)
  )?.replace(/[\\/]+$/, '');
export const NODE_LISTENER_URL = (isMainnet: boolean) =>
  (isMainnet
    ? (process.env.NODE_MAINNET_LISTENER_URL as string)
    : (process.env.NODE_TESTNET_LISTENER_URL as string)
  )?.replace(/[\\/]+$/, '');
export const LINK_SHORTNER_BACKEND_URL = () =>
  (process.env.LINK_SHORTNER_BACKEND_URL as string)?.replace(/[\\/]+$/, '');
export const SUPABASE_ERGOPAY_LINK = () =>
  (process.env.SUPABASE_ERGOPAY_LINK as string)?.replace(/[\\/]+$/, '');
export const SUPABASE_ERGOPAY_API_KEY = () =>
  (process.env.SUPABASE_ERGOPAY_API_KEY as string)?.replace(/[\\/]+$/, '');
export const LINK_SHORTNER_API_KEY = () => process.env.LINK_SHORTNER_API_KEY;
