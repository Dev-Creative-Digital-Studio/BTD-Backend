import Stripe from "stripe";
import { stripe } from "../../utils/stripeInstance";
import { Request, Response } from "express";
import { env } from "node:process";
const subscriptionPlans = async (req: Request, res: Response) => {
  try {
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      type: "recurring",
    });

    console.log("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
    console.log("STRIPE_PUBLISHABLE_KEY", process.env.STRIPE_PUBLISHABLE_KEY);
    console.log("prices", JSON.stringify(prices.data));

    const plans = prices.data
      .filter((price: any) => price.product && price.product.active)
      .map((price: any) => ({
        id: price.id,
        name: price.product.name,
        description: price.product.description,
        price: price.unit_amount,
        interval: price.recurring.interval,
        price_id: price.id,
      }));
    return res.status(200).json({
      plans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export default subscriptionPlans;
