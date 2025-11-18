interface Comment {
    stars: number,
    title: string,
    comment: string
}
interface Product {
    id: number,
    title: string,
    description: string,
    price: number,
    stars: number,
    discountPercentage: number,
    comments: Comment[],
    image: string
}

type messageType = 'success' | 'error' | 'warning'
interface message {
    id: number;
    title: string;
    content: string;
    type: messageType;
    duration: number; // in milliseconds
}
type AuthMode = 'login' | 'register';

interface Comment { stars: number; title: string; comment: string; }
interface Product { id: number; title: string; description: string; price: number; stars: number; discountPercentage: number; comments: Comment[]; image: string; }
interface User { id: number; email: string; fullName: string; cartProducts: Product[]; }

interface PromiseResult { response: any; error: any; }
export type { Comment, Product, messageType, message, AuthMode, User, PromiseResult }