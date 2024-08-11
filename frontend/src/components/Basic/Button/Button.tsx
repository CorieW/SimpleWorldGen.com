import React from 'react';
import './Button.scss';

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    color?: "primary" | "green" | "red" | "default";
    size?: "small" | "medium" | "large";
    style?: React.CSSProperties;
};

const Button = (props: Props) => {
    const { onClick, children, color, style } = props;

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
            default:
                return {
                    backgroundColor: "#007bff",
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

    return (
        <button className={'custom-btn'} style={combinedStyle} onClick={onClick}>
            <div className='tint'></div>
            <div className='content'>
                {children}
            </div>
        </button>
    );
};

export default Button;