import { useState, useRef, useEffect } from 'react';

interface NameInputProps {
  onSubmit: (name: string) => void;
  position: number;
}

export function NameInput({ onSubmit, position }: NameInputProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name || 'AAA');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters, max 3 characters
    const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
    setName(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.length > 0) {
      onSubmit(name);
    }
  };

  return (
    <div className="text-center animate-fade-in">
      <div className="text-primary text-lg mb-2">
        NEW HIGH SCORE!
      </div>
      <div className="text-foreground/60 text-xs mb-4">
        #{position} ON THE LEADERBOARD
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="text-[10px] text-foreground/50 mb-1">
          ENTER YOUR INITIALS
        </div>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={3}
          placeholder="AAA"
          className="w-24 text-center text-2xl font-mono bg-transparent border-b-2 border-foreground/30 
                     focus:border-primary outline-none py-2 text-foreground tracking-[0.3em]
                     placeholder:text-foreground/20"
        />
        <button
          type="submit"
          disabled={name.length === 0}
          className="game-button mt-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
