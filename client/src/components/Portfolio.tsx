import { useState } from 'react';

const Portfolio = () => {
  const [selectedToken, setSelectedToken] = useState('none');

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  return (
    <div className="flex flex-col gap-12 px-[15%] py-[2%] h-full">
      <h1 className="text-6xl font-semibold">Portfolio</h1>

      <div className='flex flex-col gap-8'>
        <h2 className='text-4xl'>Add tokens to Portfolio</h2>
        <div className='flex gap-4 items-center'>
          <select className="text-black rounded-md p-2" value={selectedToken} onChange={handleTokenChange}>
            <option value="none">None</option>
            <option value="solana">Solana</option>
            <option value="ethereum">Ethereum</option>
          </select>
          <input
            type="number"
            className="mt-2 text-black rounded-md p-2"
            placeholder="Enter quantity"
            min="1"
          />
          <button className="mt-2 bg-lilac dark:bg-elixir text-white p-2 rounded-md">
            Add Tokens
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        <h2 className='text-4xl'>Current Holdings</h2>
        <p>No current token holdings.</p>
        <ul></ul>
      </div>
    </div>
  );
};

export default Portfolio;
