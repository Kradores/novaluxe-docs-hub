"use client";

import { createContext, useContext } from "react";

import { RoleName } from "@/types/user";

type RoleContextValue = {
  role?: RoleName;
  isUser: boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export const RoleProvider = ({
  role,
  children,
}: {
  role?: RoleName;
  children: React.ReactNode;
}) => {
  return (
    <RoleContext.Provider
      value={{
        role,
        isUser: role === "user",
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
};
