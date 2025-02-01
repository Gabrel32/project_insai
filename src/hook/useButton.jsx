// src/hooks/useButton.js
const useButton = ({ text, onClick, style }) => {
    const button = (
        <button className={style} onClick={onClick}>
            {text}
        </button>
    );

    return button;
};

export default useButton;
