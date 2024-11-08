import TokenList from "./TokenList";

const Discover = () => {
  return (
    <div className="flex flex-col px-[15%] py-[2%] h-full">
      <h1 className="text-5xl pb-[2%]">
        Top Performing Coins
      </h1>
      <TokenList />
    </div>
  );
};

export default Discover;