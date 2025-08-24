import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function ProductCard({
  image,
  alt,
  name,
  category,
  seller,
  stock,
  price,
  actualPrice,
  discount,
}: {
  image: string;
  alt: string;
  name: string;
  category: string;
  seller: string;
  stock: number;
  price: number;
  actualPrice: number;
  discount: number;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={alt}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <Badge className="absolute top-2 left-2 bg-primary text-white">
            -{discount}%
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-primary mb-2 line-clamp-2">
            {name}
          </h3>
          <h2 className="text-muted-foreground mb-2 line-clamp-2">
            {category}
          </h2>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-medium text-primary">Seller</span>
            <span className="text-sm text-muted-foreground">({seller})</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">4.5</span>
            <span className="text-sm text-muted-foreground">(433)</span>
          </div>
          <div className="mb-2">
            {stock > 0 ? (
              <span className="text-muted-foreground text-sm">✔ In stock</span>
            ) : (
              <span className="text-muted-foreground text-sm">✘ In stock</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              ${actualPrice}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${price}
            </span>
          </div>
          <Button className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
