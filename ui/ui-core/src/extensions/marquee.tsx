export const Marquee: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="z-10 mt-10 w-full overflow-hidden sm:mt-24">
      <div className="relative flex max-w-[90vw] overflow-hidden py-5">
        <div className="animate-marquee flex w-max [--duration:30s]">
          {children}
        </div>
      </div>
    </div>
  );
};
