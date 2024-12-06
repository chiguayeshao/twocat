import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toFixed(1);
}

export function formatPercent(num: number): string {
  return num.toFixed(2);
}

export function formatUSD(num: number): string {
  return "$" + formatNumber(num);
}

export function formatWalletAddress(
  address: string,
  length: number = 4
): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}
