// context/sidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(prev => !prev);

  return (
    <SidebarContext.Provider value={{ open, toggleOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
