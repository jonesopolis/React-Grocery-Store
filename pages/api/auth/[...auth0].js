import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';


const getLoginState = (req, loginOptions) => {
  return {
      returnTo: req.headers.referer
  };
};

  export default handleAuth({
    async login(req, res) {
      try {
        await handleLogin(req, res, { getLoginState });
      } catch (err) {
        res.status(err.status ?? 500).end(err.message);
      }
    }
  });