import TokenList from './TokenList';

const Discover = () => {
  return (
    <div className="flex flex-col px-[15%] py-[2%] h-full">
      <h1 className="font-semibold text-5xl pb-[2%]">Top Trending</h1>
      <TokenList />
    </div>
  );
};

export default Discover;
