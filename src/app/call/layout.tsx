import React from "react";
interface Props {
  children: React.ReactNode;
}

function CallLayout({ children }: Props) {
  return <div className="h-screen bg-black">{children}</div>;
}

export default CallLayout;
