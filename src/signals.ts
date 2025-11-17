import { signal } from "@preact/signals-react";
import type { product } from "./types";

const products = signal<product[]>([])

export { products }