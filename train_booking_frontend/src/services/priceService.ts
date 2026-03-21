import { Price } from "@/types/price";
import {
  getPricesFromStorage,
  savePricesToStorage,
  getPricesForSchedule,
} from "@/data/prices.mock";

export const priceService = {
  getPricesBySchedule(scheduleId: string): Price[] {
    return getPricesForSchedule(scheduleId);
  },

  getAllPrices(): Price[] {
    return getPricesFromStorage();
  },

  setPrice(price: Omit<Price, "id" | "updatedAt">): Price {
    const prices = getPricesFromStorage();

    const existingIndex = prices.findIndex(
      (p) =>
        p.scheduleId === price.scheduleId && p.classType === price.classType,
    );

    if (existingIndex !== -1) {
      prices[existingIndex] = {
        ...prices[existingIndex],
        basePrice: price.basePrice,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      savePricesToStorage(prices);
      return prices[existingIndex];
    }

    const newPrice: Price = {
      ...price,
      id: `p${Date.now()}`,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    prices.push(newPrice);
    savePricesToStorage(prices);

    return newPrice;
  },

  deletePrice(id: string): void {
    const prices = getPricesFromStorage();
    const filtered = prices.filter((p) => p.id !== id);

    if (filtered.length === prices.length) {
      throw new Error("Price not found");
    }

    savePricesToStorage(filtered);
  },
};