import { Response, Request } from "express";
import cartModel from "../models/cart.model";
import cartItemModel from "../models/cartItem.model";
import productModel from "../models/product.model";
import validateFields from "../helpers/validateMissingFields.helper";

// extract email from request
function extractEmail(req: Request) {
  if (!req.email) {
    throw new Error("Email not found in request");
  }
  return req.email;
}

// get cart
async function getCart(req: Request, res: Response) {
  // get email from request
  const email = extractEmail(req);

  try {
    // get all cart items
    const cart = await cartModel.findOne({ email: email }).populate({
      path: "CartItem",
      populate: {
        path: "productId",
        select: "image productName productCategory seller",
      },
    });

    // if cart is empty
    if (!cart || cart.cartItem.length === 0) {
      return res.status(200).json({
        cart: {
          cartItem: [],
        },
      });
    }

    res.status(200).json({ cart });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Oops!! something went wrong. Try Again.",
    });
  }
}

// add products to cart
async function addToCart(req: Request, res: Response) {
  // get email from request
  const email = extractEmail(req);

  // get product id from body
  const { productId } = req.body;

  // validate missing fields
  const hasError = validateFields({ email, productId }, res);
  if (hasError) return;

  // add items to cart/ if already exist increate quantity
  try {
    let cart = await cartModel.findOne({ email });
    if (!cart) {
      cart = new cartModel({ email, cartItem: [] });
      await cart.save();
    }

    const existingCartItem = await cartItemModel.findOne({
      cartId: cart._id,
      productId,
    });

    if (!existingCartItem) {
      const cartItem = new cartItemModel({
        cartId: cart._id,
        productId,
        quantity: 1,
      });

      await cartItem.save();
      cart.cartItem.push(cartItem._id);
      await cart.save();
    } else {
      existingCartItem.quantity = existingCartItem.quantity + 1;
      await existingCartItem.save();
    }

    res.status(201).json({ message: "Product added to cart" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Oops!!! Something went wrong. Try again",
    });
  }
}

// update cart item quantity
async function updateCart(req: Request, res: Response) {
  // get email from request
  const email = extractEmail(req);

  // get product id and update quantity from body
  const { productId, quantity } = req.body;

  // validate missing fields
  const hasError = validateFields({ productId, quantity }, res);
  if (hasError) return;

  // invalid quantity
  if (quantity <= 0) {
    return res.status(400).json({
      message: "Insert valid value, quantity cannot be less than or equal to 0",
    });
  }

  try {
    const cart = await cartItemModel.findOne({ email });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await cartItemModel.findOne({
      cartId: cart._id,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Oops!!! Something went wrong. Try again",
    });
  }
}

// remove product from cart
async function removeFromCart(req: Request, res: Response) {
  // get email from req
  const email = extractEmail(req);

  // get product id from body
  const { productId } = req.body;

  // remove item from cart
  try {
    const cart = await cartModel.findOne({ email });
    if (!cart) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const cartItem = await cartItemModel.findOneAndDelete({
      cartId: cart._id,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.cartItem = cart.cartItem.filter(
      (itemId: any) => itemId.toString() !== cartItem._id.toString()
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Oops!!! Something went wrong. Try again" });
  }
}

export { getCart, addToCart, removeFromCart };
