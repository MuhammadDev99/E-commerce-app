import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import CartButton from "./CartButton";
import { getUserLocalStorage } from "../utils";
import type { User } from "../types";
interface NavigationBarButtonProps {
    label: string;
    href: string;
}

function NavigationBarButton({ label, href }: NavigationBarButtonProps) {
    return (
        <div className={styles.navigationBarButton}>
            <a href={href}>{label}</a>
        </div>
    );
}

function NavigationBar() {
    const user: User | null = getUserLocalStorage();
    const isAuthenticated = user !== null;
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScrollPos, visible, handleScroll]);

    return (
        <div className={`${styles.navigationBar} ${!visible ? styles.hidden : ""}`}>
            <div className={styles.logo}>
                <a><img src="/images/logo-vertical.png"></img></a>
            </div>
            <div className={styles.buttons}>
                <NavigationBarButton label="Products" href="/products" />
                <NavigationBarButton label="Home" href="/" />
                <NavigationBarButton label="About" href="/about" />
                <NavigationBarButton label="Contact" href="/contact" />
                {isAuthenticated ? <NavigationBarButton label="Dashboard" href="/dashboard" /> : <NavigationBarButton label="Login" href="/login" />}
                <CartButton itemsCount={0} />
            </div>
        </div>
    );
}

export default NavigationBar;