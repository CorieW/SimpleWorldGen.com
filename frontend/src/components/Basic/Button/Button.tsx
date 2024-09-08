import React from 'react';
import './Button.scss';

type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    color?: "primary" | "green" | "red" | "black" | "default";
    size?: "small" | "medium" | "large";
    style?: React.CSSProperties;
    linkButton?: boolean;
    href?: string;
    target?: string;
    rel?: string;
};

const Button = (props: Props) => {
    const { onClick, children, className, color, style, linkButton, href, target, rel } = props;

    const getColor = () => {
        switch (color) {
            case "primary":
                return {
                    backgroundColor: "#007bff",
                    color: "white",
                };
            case "green":
                return {
                    backgroundColor: "#28a745",
                    color: "white",
                };
            case "red":
                return {
                    backgroundColor: "#dc3545",
                    color: "white",
                };
            case "black":
                return {
                    backgroundColor: "black",
                    color: "white",
                };
            default:
                return {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    color: "white",
                };
        }
    };

    const getSize = () => {
        switch (props.size) {
            case "small":
                return {
                    padding: "5px 10px",
                    fontSize: "16px",
                };
            case "medium":
                return {
                    padding: "7.5px 15px",
                    fontSize: "20px",
                };
            case "large":
                return {
                    padding: "10px 20x",
                    fontSize: "22px",
                };
            default:
                return {
                    padding: "7.5px 20px",
                    fontSize: "20px",
                };
        }
    }

    const defaultStyle = {
        ...getColor(),
        ...getSize(),
    };

    const combinedStyle = { ...defaultStyle, ...style };

    const btnJsx = (
        <button className={`custom-btn ${className}`} style={combinedStyle} onClick={onClick}>
            <div className='tint'></div>
            <div className='content'>
                {children}
            </div>
        </button>
    );

    const linkBtnJsx = (
        <a className={`custom-btn ${className}`} style={combinedStyle} onClick={onClick} target={target} href={href} rel={rel}>
            <div className='tint'></div>
            <div className='content'>
                {children}
            </div>
        </a>
    );

    return linkButton ? linkBtnJsx : btnJsx;
};

export default Button;