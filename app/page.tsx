"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    id: "box1",
    value: "58%",
    text: "Increase in pick-up point usage",
    className: "stat-one",
  },
  {
    id: "box2",
    value: "23%",
    text: "Decrease in customer phone calls",
    className: "stat-two",
  },
  {
    id: "box3",
    value: "27%",
    text: "Increase in delivery efficiency",
    className: "stat-three",
  },
  {
    id: "box4",
    value: "40%",
    text: "Reduction in customer support calls",
    className: "stat-four",
  },
];

const cardRanges = [
  { selector: ".stat-one", start: 0.24, end: 0.34 },
  { selector: ".stat-two", start: 0.4, end: 0.5 },
  { selector: ".stat-three", start: 0.57, end: 0.67 },
  { selector: ".stat-four", start: 0.74, end: 0.84 },
];

const welcomeText = "WELCOME ITZFIZZ";

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const welcome = welcomeRef.current;

    if (!section || !track || !road || !car || !trail || !welcome) {
      return;
    }

    const ctx = gsap.context(() => {
      const letters =
        gsap.utils.toArray<HTMLElement>(".welcome-letter");

      // Initial animation state
      gsap.set(car, {
        x: 0,
        force3D: true,
      });

      gsap.set(trail, {
        width: 0,
      });

      gsap.set(letters, {
        opacity: 0,
        y: 18,
      });

      gsap.set(".stat-card", {
        opacity: 0,
        y: 35,
        scale: 0.94,
      });

      const getDimensions = () => {
        const roadWidth = road.clientWidth;
        const carWidth = car.offsetWidth;

        return {
          roadWidth,
          carWidth,
          maxX: Math.max(0, roadWidth - carWidth / 2),
        };
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: track,
        scrub: 1.2,
        anticipatePin: 1,

        onUpdate: (self) => {
          const { roadWidth, carWidth, maxX } = getDimensions();

          // Move car from left to right
          const carX = maxX * self.progress;

          gsap.set(car, {
            x: carX,
            force3D: true,
          });

          // Extend trail with car movement
          const carCenter = carX + carWidth / 2;

          gsap.set(trail, {
            width: carCenter,
            force3D: true,
          });

          // Reveal welcome text based on car position
          letters.forEach((letter) => {
            const letterCenter =
              letter.offsetLeft + letter.offsetWidth / 2;

            const visible = carCenter >= letterCenter;

            gsap.set(letter, {
              opacity: visible ? 1 : 0,
              y: visible ? 0 : 18,
            });
          });

          // Animate statistic cards sequentially
          cardRanges.forEach(({ selector, start, end }) => {
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (self.progress - start) / (end - start)
            );

            const card = document.querySelector(selector);

            if (!card) return;

            gsap.set(card, {
              opacity: cardProgress,
              y: 35 * (1 - cardProgress),
              scale: 0.94 + cardProgress * 0.06,
              force3D: true,
            });
          });

          // Keep dimensions referenced for GSAP calculations
          void roadWidth;
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className="page">
      <section ref={sectionRef} className="hero-section">
        <div ref={trackRef} className="hero-track">
          <div ref={roadRef} className="road">
            <div ref={trailRef} className="road-trail" />

            <div ref={welcomeRef} className="welcome-text">
              {welcomeText.split("").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="welcome-letter"
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </div>

            <img
              ref={carRef}
              src="/car.png"
              alt="Sports car"
              className="car"
            />
          </div>

          {stats.map((stat) => (
            <div
              key={stat.id}
              id={stat.id}
              className={`stat-card ${stat.className}`}
            >
              <span className="stat-number">{stat.value}</span>
              <span className="stat-description">
                {stat.text}
              </span>
            </div>
          ))}

          <div className="scroll-hint">
            <span className="scroll-line" />
            SCROLL TO DRIVE
          </div>
        </div>
      </section>
    </main>
  );
}