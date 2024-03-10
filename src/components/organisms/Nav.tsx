"use client";
import { useMemo } from "react";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="flex sticky top-0 w-full justify-between items-center px-6 py-3 border-b backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link href={"/"}>
          <img width={90} height={90} src="/logo.svg" alt="highfeast logo" />
        </Link>
      </div>
    </div>
  );
};

export default Nav;
