const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-5">
      <div className="text-xl font-semibold">{title}</div>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default Header;
