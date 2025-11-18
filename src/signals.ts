import { signal } from "@preact/signals-react";
import type { Product } from "./types";

const products = signal<Product[]>([])

export { products }