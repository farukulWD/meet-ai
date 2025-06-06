"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelBottomCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import DashboardCommand from "./dashboard-command";
import { useEffect, useState } from "react";

function DashboardNavbar() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2  py-3 items-center border-b bg-background">
        <Button
          onClick={toggleSidebar}
          className="size-9 cursor-pointer"
          variant={"outline"}
        >
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelBottomCloseIcon className="size-4" />
          )}
        </Button>
        <Button
          className="h-9 font-normal cursor-pointer w-[240px] justify-start text-muted-foreground hover:text-muted-foreground"
          variant={"outline"}
          size={"sm"}
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon />
          Search
          <kbd className="ml-auto pointer-events-none select-none items-center inline-flex h-5 gap-1 rounded border bg-muted text-mono text-sm font-medium text-muted-foreground">
            <span className="text-[14px]"> &#8984;</span>
            <span className="text-sm font-medium">K</span>
          </kbd>
        </Button>
      </nav>
    </>
  );
}

export default DashboardNavbar;
