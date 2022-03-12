const MenuIcon: React.FC<{ icon: JSX.Element; text?: string }> = ({
  icon,
  text,
}) => (
  <div className="table-icon group">
    {icon}
    {text && (
      <span className="table-tooltip group-hover:scale-100">{text}</span>
    )}
  </div>
);

export default MenuIcon;
