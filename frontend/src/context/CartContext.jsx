import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // ✅ Add kg to cart (NO price stored)
  const add = (product, qty = 1) => {
    const cleanQty = Number(qty);
    if (!Number.isFinite(cleanQty) || cleanQty <= 0) return;

    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: Number(p.qty) + cleanQty } : p
        );
      }

      // ✅ Keep only needed fields (no price)
      return [
        ...prev,
        {
          id: product.id,
          name: product.name || product.localName || "Item",
          scientificName: product.scientificName || "",
          image: product.image || product.image_url || "",
          qty: cleanQty, // kg
        },
      ];
    });
  };

  // ✅ Set kg directly
  const updateQty = (id, qty) => {
    const cleanQty = Number(qty);

    setItems((prev) => {
      // qty <= 0 => remove
      if (!Number.isFinite(cleanQty) || cleanQty <= 0) {
        return prev.filter((p) => p.id !== id);
      }
      return prev.map((p) => (p.id === id ? { ...p, qty: cleanQty } : p));
    });
  };

  // Optional helpers
  const increase = (id, kg = 1) => {
    const n = Number(kg);
    if (!Number.isFinite(n) || n <= 0) return;

    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Number(p.qty) + n } : p))
    );
  };

  const decrease = (id, kg = 1) => {
    const n = Number(kg);
    if (!Number.isFinite(n) || n <= 0) return;

    setItems((prev) => {
      const item = prev.find((p) => p.id === id);
      if (!item) return prev;

      const nextQty = Number(item.qty) - n;
      if (nextQty <= 0) return prev.filter((p) => p.id !== id);

      return prev.map((p) => (p.id === id ? { ...p, qty: nextQty } : p));
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  // ✅ total kg
  const totalKg = useMemo(
    () => items.reduce((sum, p) => sum + Number(p.qty || 0), 0),
    [items]
  );

  const getItemQty = (id) => items.find((p) => p.id === id)?.qty ?? 0;

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        updateQty,
        increase,
        decrease,
        remove,
        clear,
        totalKg,
        getItemQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);