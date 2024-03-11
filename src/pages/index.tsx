import { cn } from "@/utils";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const isWindow = typeof window !== "undefined";

function getWindowDimensions(): { width: number; height: number } {
  if (isWindow) {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }
  return { width: 0, height: 0 };
}

export default function Home() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (isWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const sideCardWidth = 64;
  const centerCardWidth = 72;
  const stackThreshold = 1024;
  const peekWidth = 10;

  const { width: screenWidth } = windowDimensions;
  const isMobile = screenWidth <= stackThreshold;

  return (
    <>
      <Head>
        <title>Highfeast Explorer</title>
        <meta name="description" content="Ultimate Food Companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <div className="flex flex-col items-center gap-16 p-8">
            <img
              width={200}
              height={200}
              src="/logo.svg"
              alt="highfeast logo"
            />
            <div className="flex justify-center items-center w-full max-w-5xl mx-auto relative">
              <SideCard
                sideCardWidth={sideCardWidth}
                centerCardWidth={centerCardWidth}
                peekWidth={peekWidth}
                isMobile={isMobile}
                position="left"
              />

              <Link href={"/explorer"}>
                <div className="z-10">
                  <div
                    className={cn(
                      `min-w-${centerCardWidth}`,
                      "min-h-96 bg-green-500"
                    )}
                  >
                    {/* TODO: image goes here */}
                  </div>
                </div>
              </Link>

              <SideCard
                sideCardWidth={sideCardWidth}
                centerCardWidth={centerCardWidth}
                peekWidth={peekWidth}
                isMobile={isMobile}
                position="right"
              />
            </div>
            <p className="max-w-[38ch] text-center font-bellota text-2xl font-bold text-[#194237]">
              Click any of the cards above to let the feast explorer, plan your
              menus, list condiments, create meal plans, and manage your budget
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

const SideCard = ({
  sideCardWidth,
  centerCardWidth,
  peekWidth,
  isMobile,
  position,
}: {
  sideCardWidth: number;
  centerCardWidth: number;
  peekWidth: number;
  isMobile: boolean;
  position: "left" | "right";
}) => {
  const leftTranslation = isMobile
    ? `translate-x-${centerCardWidth / 2 - peekWidth}`
    : `-translate-x-${centerCardWidth / 2 + sideCardWidth / 2}`;

  const rightTranslation = isMobile
    ? `-translate-x-${centerCardWidth / 2 - peekWidth}`
    : `translate-x-${centerCardWidth / 2 + sideCardWidth / 2}`;

  const translation = position === "left" ? leftTranslation : rightTranslation;

  return (
    <Link href={"/explorer"}>
      <div
        className={cn(
          "flex items-center absolute top-0 bottom-0 transform transition duration-500 ease-in-out",
          position === "left" ? "left-0" : "right-0",
          translation
        )}
        style={{
          minWidth: sideCardWidth / 4 + "rem",
        }}
      >
        <div className="h-[90%] bg-black w-full">
          {/* TODO: image goes here */}
        </div>
      </div>
    </Link>
  );
};
