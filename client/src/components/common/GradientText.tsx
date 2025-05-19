const GradientText = ({ children }: { children: string }) => {
  return (
    <span className="text-transparent bg-gradient bg-clip-text">
      {children}
    </span>
  );
};

export default GradientText;
