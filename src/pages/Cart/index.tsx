import { signal } from "@preact/signals-react"
/* import styles from "./style.module.css" */

const count = signal<number>(0)
function Cart() {
    return (
        <>
            <img className="cat" src="/images/cat.png" />
            <div className="container">
                <p>Hello, Cart!</p>
                <button onClick={() => count.value++}>Count: {count}</button>
            </div>
        </>
    )
}

export default Cart
