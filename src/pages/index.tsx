import { LogoCrown } from "@/utils/logoCrown";
import Head from "next/head";
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

  const cardWidth = 36,
    centerCardWidth = 44,
    stackThreshold = 1024,
    peekWidth = 10;

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
          <div>
            <LogoCrown />
            <div className="flex justify-center items-center w-full max-w-4xl mx-auto relative">
              <SideCard
                cardWidth={cardWidth}
                centerCardWidth={centerCardWidth}
                peekWidth={peekWidth}
                isMobile={isMobile}
                position="left"
                bgColor="bg-yellow-400"
              />

              <div className="z-10">
                <div className={`w-${centerCardWidth} h-44 bg-green-500`}></div>
              </div>

              <SideCard
                cardWidth={cardWidth}
                centerCardWidth={centerCardWidth}
                peekWidth={peekWidth}
                isMobile={isMobile}
                position="right"
                bgColor="bg-red-500"
              />
            </div>
            <p>Your food companion for every occasion...</p>
          </div>
        </div>
      </main>
    </>
  );
}

const SideCard = ({
  cardWidth,
  centerCardWidth,
  peekWidth,
  isMobile,
  position,
  bgColor,
}: {
  cardWidth: number;
  centerCardWidth: number;
  peekWidth: number;
  isMobile: boolean;
  position: "left" | "right";
  bgColor: string;
}) => {
  const leftTranslation = isMobile
    ? `translate-x-${centerCardWidth / 2 - peekWidth}`
    : `-translate-x-${centerCardWidth / 2 + cardWidth / 2}`;

  const rightTranslation = isMobile
    ? `-translate-x-${centerCardWidth / 2 - peekWidth}`
    : `translate-x-${centerCardWidth / 2 + cardWidth / 2}`;

  const translation = position === "left" ? leftTranslation : rightTranslation;

  return (
    <div
      className={`absolute ${
        position === "left" ? "left-0" : "right-0"
      } top-0 bottom-0 w-${cardWidth} ${bgColor} transform transition duration-500 ease-in-out ${translation}`}
    ></div>
  );
};
