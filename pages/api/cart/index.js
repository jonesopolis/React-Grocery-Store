import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { cartRepo } from '../../../src/cart-repo';

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = getSession(req, res);

  let totalCount = 0;

  switch (req.method) {
    case "GET":
        res.json(cartRepo.getUserCart(user.email));
      break;
    case "POST":
      totalCount = cartRepo.addToCart(user.email, parseInt(req.body));
      res.status(200).json(totalCount);
      break;
    case "PUT":
      totalCount = cartRepo.deleteFromCart(user.email, parseInt(req.body));
      res.status(200).json(totalCount);
      break;
    case "DELETE":
      cartRepo.clearUserCart(user.email);
      res.status(200);
      break;
  }

  res.end();
});