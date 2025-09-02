import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { isAxiosError } from "axios";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    productName: string;
    price: number;
    discount: number;
    actualPrice: number;
    image: { imageURL: string };
  };
  quantity: number;
}

interface Cart {
  _id: string;
  cartItem: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCart: (productId: string, quantity: number) => Promise<void>;
}

// create cart context
const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/cart/all");
      console.log(response.data.cart);
      setCart(response.data.cart);
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized");
        } else {
          toast.error("Oops!!! Something went wrong. Try again");
        }
      }
    }
  };

  useEffect(() => {
    if (auth?.accessToken) {
      fetchCart();
    }
  }, [auth?.accessToken]);

  const totalItems =
    cart?.cartItem.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = cart?.cartItem.reduce(
    (acc, item) => acc + item.productId.actualPrice * item.quantity,
    0
  ) || 0;

  const addToCart = async (productId: string) => {
    try {
      await axiosPrivate.post("/cart/add", JSON.stringify({ productId }));
      await fetchCart();
      toast.success("Product added to cart");
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized");
        } else {
          toast.error("Oops!!! Something went wrong. Try again");
        }
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await axiosPrivate.put("/cart/delete", JSON.stringify({ productId }));
      await fetchCart();
      toast.success("Product removed from cart");
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized");
        } else {
          toast.error("Oops!!! Something went wrong. Try again");
        }
      }
    }
  };

  const updateCart = async (productId: string, quantity: number) => {
    try {
      await axiosPrivate.put(
        "/cart/update",
        JSON.stringify({ productId, quantity })
      );
      await fetchCart();
      toast.success("Product updated to cart");
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized");
        } else {
          toast.error("Oops!!! Something went wrong. Try again");
        }
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems,
        totalPrice,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
