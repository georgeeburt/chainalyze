import { useState } from "react";
import type Token from "../../types/api/Token";

interface AddTokenFormProps {
  tokenList: Token[];
  onSubmit: (token: string, quantity: number) => void;
}

const AddTokenForm = ({ tokenList, onSubmit }: AddTokenFormProps) => {
  const [selectedToken, setSelectedToken] = useState<string>('none');
  const [quantity, setQuantity] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedToken === 'none' || !quantity) return;
    onSubmit(selectedToken, Number(quantity));
    setSelectedToken('none');
    setQuantity('');
  };

  return (
    <div className="bg-slate dark:bg-darklabel border-2 border-gray-300 dark:border-darkborder rounded-lg p-8">
      <div className="flex flex-col justify-between h-full">
        <h2 className="text-2xl font-semibold">Add Token to Portfolio</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 content-center">
          <select
            className="bg-lightlisthov dark:bg-zinc-500 text-black focus:border-elixir focus:border-2 hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-3"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
          >
            <option value="none">Select token</option>
            {tokenList
              .filter(token => token !== null)
              .sort((a, b) => (a?.name < b?.name ? -1 : 1))
              .map(token => (
                <option key={token?.symbol} value={token?.symbol}>
                  {token?.name} ({token?.symbol})
                </option>
              ))}
          </select>
          <input
            type="number"
            className="bg-lightlisthov dark:bg-zinc-500 dark:placeholder-gray-800 text-black focus:border-2 focus:border-elixir hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-3"
            placeholder="Enter quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button className="dark:bg-elixir bg-elixir hover:bg-grape border-2 border-purple-900 hover:dark:bg-purple-700 text-white p-3 rounded-md">
            Add Tokens
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTokenForm;
