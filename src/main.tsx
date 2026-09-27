import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  X,
  Flame,
  Utensils,
  Truck,
  Menu,
} from "lucide-react";
import "./styles.css";

type Category = "All" | "Burgers" | "Fries";
type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category: Exclude<Category, "All">;
  rating: number;
  reviews: number;
  description: string;
  badge?: string;
};
type CartItem = Product & { quantity: number };

const peso = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STORE_NAME = "Tasty Burgers";

const products: Product[] = [
  // Tasty Burgers menu catalog
  {
    id: "classic",
    name: "Classic Double Burger",
    price: 199,
    image: "/images/burger2.jpg",
    category: "Burgers",
    rating: 4.9,
    reviews: 128,
    description: "Two juicy beef patties, melted cheese, fresh lettuce and house sauce.",
    badge: "BEST SELLER",
  },
  {
    id: "cheese",
    name: "Classic Cheese Burger",
    price: 159,
    image: "/images/burger1.jpg",
    category: "Burgers",
    rating: 4.8,
    reviews: 96,
    description: "A simple classic with a toasted bun, beef patty, cheese and fresh greens.",
  },
  {
    id: "garden",
    name: "Fresh Garden Burger",
    price: 149,
    image: "/images/burger3.jpg",
    category: "Burgers",
    rating: 4.7,
    reviews: 74,
    description: "Fresh vegetables, crispy greens and our creamy signature dressing.",
    badge: "FRESH",
  },
  {
    id: "smoky",
    name: "Smoky BBQ Burger",
    price: 189,
    image: "/images/burger4.jpg",
    category: "Burgers",
    rating: 4.8,
    reviews: 87,
    description: "Smoky beef, melted cheese, crunchy greens and sweet BBQ sauce.",
  },
  {
    id: "regular-fries",
    name: "Classic Golden Fries",
    price: 89,
    image: "/images/fries-regular-1.png",
    images: ["/images/fries-regular-1.png", "/images/fries-regular-2.png"],
    category: "Fries",
    rating: 4.8,
    reviews: 65,
    description: "Crispy golden potato fries seasoned just right.",
    badge: "CRISPY",
  },
  {
    id: "cheese-fries",
    name: "Loaded Cheese Fries",
    price: 119,
    image: "/images/fries-special-1.png",
    images: ["/images/fries-special-1.png", "/images/fries-special-2.png"],
    category: "Fries",
    rating: 4.9,
    reviews: 53,
    description: "Golden fries finished with warm creamy cheese sauce.",
  },
];

function FriesImage({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const images = product.images?.length ? product.images : [product.image];
  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % images.length), 2600);
    return () => window.clearInterval(timer);
  }, [images.length]);
  return <img src={images[index % images.length]} alt={product.name} />;
}

function FriesArt() {
  return (
    <div className="fries-art" aria-hidden="true">
      <div className="fries-stick s1" />
      <div className="fries-stick s2" />
      <div className="fries-stick s3" />
      <div className="fries-stick s4" />
      <div className="fries-stick s5" />
      <div className="fries-stick s6" />
      <div className="fries-box"><span>FRIES</span></div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("tasty-burgers-favorites") || "[]"); } catch { return []; }
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => localStorage.setItem("tasty-burgers-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => setIsReady(true), []);
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(t);
  }, [notice]);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleProducts = useMemo(() => products.filter((product) => {
    const categoryMatch = category === "All" || product.category === category;
    const searchMatch = `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery);
    return categoryMatch && searchMatch;
  }), [category, normalizedQuery]);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueCartItems = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setNotice(favorites.includes(id) ? "Removed from favorites" : "Added to favorites");
  };

  const addToCart = (product: Product) => {
    setCart((current) => current.some((item) => item.id === product.id)
      ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]
    );
    setNotice(`${product.name} added to cart`);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const checkout = () => {
    if (!cart.length) return;
    setNotice("Order confirmed — thank you!");
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className={`app-shell ${isReady ? "is-ready" : ""}`}>
      <div className="grain" />
      <header className="topbar">
        <a className="logo" href="#home" aria-label={`${STORE_NAME} home`}>
          <span className="logo-mark"><Flame size={21} strokeWidth={3} /></span>
          <span><strong>TASTY</strong><small>BURGERS</small></span>
        </a>
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#menu" onClick={() => setMobileOpen(false)}>Menu</a>
          <a href="#favorites" onClick={() => setMobileOpen(false)}>Favorites</a>
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        </nav>
        <div className="top-actions">
          <div className="search-box">
            <Search size={17} />
            <input aria-label="Search menu" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search burger..." />
          </div>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && <span>{itemCount}</span>}
          </button>
          <button className="menu-button" onClick={() => setMobileOpen((v) => !v)} aria-label="Open navigation"><Menu /></button>
        </div>
      </header>

      <main>
        <section className="poster-hero" id="home">
          <div className="burst burst-a" /><div className="burst burst-b" />
          <div className="hero-copy reveal-left">
            <p className="mini-label">SUPER DELICIOUS</p>
            <h1>TASTY<br /><span>BURGERS</span></h1>
            <p className="hero-subtitle">Big flavor. Fresh ingredients. Made for that first perfect bite.</p>
            <div className="hero-price"><span>COMBO BURGER<br />HEALTHY</span><strong>{peso(299)}</strong></div>
            <div className="hero-buttons">
              <a href="#menu" className="poster-button">ORDER NOW <ArrowRight size={17} /></a>
              <div className="social-proof"><span><Star size={15} fill="currentColor" /> 4.9</span><small>customer favorites</small></div>
            </div>
          </div>
          <div className="hero-visual reveal-right">
            <div className="floating-chip chip-one" />
            <div className="floating-chip chip-two" />
            <img className="hero-burger" src="/images/hero-burger.png" alt={`${STORE_NAME} signature burger`} />
            <div className="delivery-badge"><Truck size={19} /><span>DELIVERY<br /><b>FAST & FRESH</b></span></div>
          </div>
          <div className="hero-strip"><span>FRESHLY GRILLED</span><i /> <span>100% FLAVOR</span><i /> <span>BURGERS & FRIES</span></div>
        </section>

        <section className="service-row" aria-label="Store benefits">
          <div><span className="service-icon"><Truck /></span><div><strong>Fast Delivery</strong><small>Hot food to your door</small></div></div>
          <div><span className="service-icon"><Utensils /></span><div><strong>Freshly Made</strong><small>Cooked when you order</small></div></div>
          <div><span className="service-icon"><Check /></span><div><strong>Quality Ingredients</strong><small>Simple, fresh and delicious</small></div></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div><p className="section-kicker">OUR MENU</p><h2>Pick your <span>favorite.</span></h2><p>Tasty burgers, crispy fries and the flavors people come back for.</p></div>
            <div className="filter-tabs">
              {(["All", "Burgers", "Fries"] as Category[]).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
          </div>
          <div className="menu-grid">
            {visibleProducts.map((product, index) => (
              <article className="food-card" key={product.id} style={{ animationDelay: `${index * 80}ms` }}>
                <div className="food-image">
                  {product.images?.length ? <FriesImage product={product} /> : product.image ? <img src={product.image} alt={product.name} /> : <FriesArt />}
                  <div className="image-overlay" />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button className={`favorite-button ${favorites.includes(product.id) ? "active" : ""}`} type="button" onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? "Remove favorite" : "Add favorite"}>
                    <Heart size={19} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="food-info">
                  <div className="food-meta"><span>{product.category}</span><div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <small>({product.reviews})</small></div></div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="food-bottom"><strong>{peso(product.price)}</strong><button type="button" onClick={() => addToCart(product)}>ADD TO CART <Plus size={15} /></button></div>
                </div>
              </article>
            ))}
          </div>
          {!visibleProducts.length && <div className="no-results"><Search size={28} /><h3>No menu item found</h3><p>Try another burger or fries.</p></div>}
        </section>

        <section className="favorites-section" id="favorites">
          <div className="favorites-copy"><p className="section-kicker">YOUR PICKS</p><h2>Favorites made <span>easy.</span></h2><p>Tap the heart on any item and it stays here for your next order.</p></div>
          <div className="favorite-preview">
            {favoriteProducts.length ? favoriteProducts.slice(0, 3).map((item) => <div className="mini-favorite" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><small>{peso(item.price)}</small></div><Heart size={17} fill="currentColor" /></div>) : <div className="empty-favorites"><Heart size={25} /><span>No favorites yet.</span><small>Save your go-to order here.</small></div>}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-poster"><p>SUPER<br />DELICIOUS</p><strong>TASTY</strong><span>BURGERS</span><div className="about-burger"><img src="/images/burger4.jpg" alt="" /></div></div>
          <div className="about-copy"><p className="section-kicker">WHY TASTY?</p><h2>Simple food. <span>Serious flavor.</span></h2><p>We keep the menu focused on burgers and fries so every order gets the attention it deserves. No complicated choices — just fresh, satisfying food.</p><div className="about-stats"><div><strong>4.9</strong><small>Average rating</small></div><div><strong>100%</strong><small>Made to order</small></div><div><strong>FAST</strong><small>Local delivery</small></div></div></div>
        </section>
      </main>

      <footer><div className="footer-logo">TASTY <span>BURGERS</span></div><p>Freshly grilled. Always delicious.</p><small>© 2026 {STORE_NAME}. All rights reserved.</small></footer>

      {notice && <div className="toast"><Check size={17} /> {notice}</div>}

      {cartOpen && <div className="drawer-overlay" onClick={() => setCartOpen(false)}>
        <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header"><div><p className="section-kicker">YOUR ORDER</p><h2>Cart <span>{uniqueCartItems} items</span></h2></div><button onClick={() => setCartOpen(false)} className="close-button" aria-label="Close cart"><X /></button></div>
          <div className="cart-items">
            {cart.length ? cart.map((item) => <div className="cart-line" key={item.id}><div className="cart-thumb">{item.image ? <img src={item.image} alt="" /> : <FriesArt />}</div><div className="cart-line-info"><strong>{item.name}</strong><span>{peso(item.price)}</span><div className="quantity"><button type="button" aria-label={`Decrease ${item.name}`} onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button><b>{item.quantity}</b><button type="button" aria-label={`Increase ${item.name}`} onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button><button type="button" className="trash" aria-label={`Remove ${item.name}`} onClick={() => setCart((c) => c.filter((x) => x.id !== item.id))}><Trash2 size={15} /></button></div></div></div>) : <div className="empty-cart"><ShoppingBag size={38} /><h3>Your cart is empty</h3><p>Add your favorite burger or fries.</p><button onClick={() => setCartOpen(false)}>BROWSE MENU</button></div>}
          </div>
          <div className="cart-summary"><div><span>Subtotal</span><strong>{peso(total)}</strong></div><div><span>Delivery</span><span className="free">FREE</span></div><div className="total-row"><span>Total</span><strong>{peso(total)}</strong></div><button className="checkout-button" disabled={!cart.length} onClick={checkout}>CHECKOUT <ArrowRight size={17} /></button></div>
        </aside>
      </div>}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
