import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import CartButton from "./CartButton";
import { getUserLocalStorage } from "../utils";
import type { User } from "../types";
import { cart } from "../signals/cartSignal";
import { Link } from "react-router-dom";
import { logoVertical } from "../assets/images";

interface NavigationBarButtonProps {
    label: string;
    href: string;
    onClick?: () => void;
}

function NavigationBarButton({ label, href, onClick }: NavigationBarButtonProps) {
    return (
        <div className={styles.navigationBarButton}>
            <Link to={href} onClick={onClick}>{label}</Link >
        </div>
    );
}

function NavigationBar() {
    const user: User | null = getUserLocalStorage();
    const isAuthenticated = user !== null;
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScrollPos, visible, handleScroll]);

    const isNavBarVisible = visible || isMenuOpen;

    return (
        <div className={`${styles.navigationBar} ${!isNavBarVisible ? styles.hidden : ""}`}>
            <div className={styles.logo}>
                <Link to="/" onClick={closeMenu}><img src={logoVertical} alt="Logo" /></Link >
            </div>

            <button
                className={`${styles.hamburger} ${isMenuOpen ? styles.active : ""}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`${styles.buttons} ${isMenuOpen ? styles.navActive : ""}`}>
                <NavigationBarButton label="Products" href="/products" onClick={closeMenu} />
                <NavigationBarButton label="Home" href="/" onClick={closeMenu} />
                <NavigationBarButton label="About" href="/about" onClick={closeMenu} />
                <NavigationBarButton label="Contact" href="/contact" onClick={closeMenu} />

                {isAuthenticated ? (
                    <NavigationBarButton label="Dashboard" href="/dashboard" onClick={closeMenu} />
                ) : (
                    <NavigationBarButton label="Login" href="/login" onClick={closeMenu} />
                )}

                {/* Replaced inline style with CSS class to fix desktop alignment */}
                <div className={styles.cartWrapper} onClick={closeMenu}>
                    <CartButton itemsCount={cart.value.length} />
                </div>
            </div>
        </div>
    );
}

export default NavigationBar;