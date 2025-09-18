import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Star, Heart, Truck } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const LocalMarketplace = () => {
  const { products, loading, error } = useProducts();

  if (error) {
    return (
      <section id="marketplace" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Error loading products: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="marketplace" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cultural text-cultural-foreground" variant="secondary">
            Local Marketplace
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Support Local
            <span className="block text-transparent bg-gradient-to-r from-cultural to-accent bg-clip-text">
              Artisans & Crafts
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover authentic handcrafted products directly from skilled artisans across 
            Jharkhand's tribal communities. Every purchase supports local livelihoods.
          </p>
        </div>

        {/* Featured Banner */}
        <div className="bg-gradient-to-r from-cultural to-accent rounded-2xl p-8 mb-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Tribal Heritage Festival Sale</h3>
              <p className="text-white/90">Get 20% off on all traditional handicrafts this month</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="secondary" size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Festival Collection
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="cultural" size="sm">All Products</Button>
          <Button variant="outline" size="sm">Art & Crafts</Button>
          <Button variant="outline" size="sm">Jewelry</Button>
          <Button variant="outline" size="sm">Home Decor</Button>
          <Button variant="outline" size="sm">Textiles</Button>
          <Button variant="outline" size="sm">Pottery</Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-56" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/4 mb-4" />
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 flex-1 mr-2" />
                  <Skeleton className="h-10 w-10" />
                </CardFooter>
              </Card>
            ))
          ) : (
            products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image_url || "/src/assets/handicrafts.jpg"} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-cultural text-cultural-foreground">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="icon" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  {product.stock_quantity < 5 && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="destructive">
                        Low Stock
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {product.artisan_name || "Local Artisan"}, {product.village || "Jharkhand"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      (Stock: {product.stock_quantity})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free delivery in 3-5 days</span>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button 
                    variant="cultural" 
                    className="flex-1"
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Browse All Products
            <ShoppingBag className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LocalMarketplace;