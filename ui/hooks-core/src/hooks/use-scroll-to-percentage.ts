type ScrollToPercentageHook = () => (percentage: number) => void;

const useScrollToPercentage: ScrollToPercentageHook = () => {
  const scrollToPercentage = (percentage: number) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTo = (scrollHeight * percentage) / 100;
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  };

  return scrollToPercentage;
};

export default useScrollToPercentage;
