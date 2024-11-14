import clsx from "clsx";

interface MenuButtonProps {
  isChecked: boolean;
  onClick: () => void;
}
const MenuButton = ({
  isChecked,
  onClick,
  children,
}: React.PropsWithChildren<MenuButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className={clsx([
        "menu-button",
        isChecked ? "menu-button-checked" : "menu-button-inactive",
      ])}
    >
      {children}
    </button>
  );
};

export default MenuButton;
