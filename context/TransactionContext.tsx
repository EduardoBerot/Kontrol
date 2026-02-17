import { createContext, useContext, useState, ReactNode } from "react";

type TransactionsContextType = {
  version: number;
  refresh: () => void;
};

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [version, setVersion] = useState(0);

  const refresh = () => {
    setVersion(prev => prev + 1);
  };

  return (
    <TransactionsContext.Provider value={{ version, refresh }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactionsContext must be used within TransactionsProvider");
  }
  return context;
};
