import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeToFloat(time: string): number {
  const [hours, minutues] = time.split(":").map(Number);
  return hours + minutues / 60;
}
