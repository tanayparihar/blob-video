// import React, { useLayoutEffect, useRef } from "react";
// import { gsap } from "gsap";
// import "./styles.css";

// export default function App() {
//   const root = useRef();

//   useLayoutEffect(() => {
//     let ctx = gsap.context(() => {
//       // all your animations go in here...

//       const circlePath = document.getElementById("mask-path");

//       function createLiquidPath(path, options) {
//         const svgPoints = pointsInPath(path, options.detail);
//         const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
//         const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

//         const mousePos = { x: 0, y: 0 };
//         const transformCoords = createCoordsTransformer(path.closest("svg"));

//         const pointDistance = Math.hypot(
//           originPoints[0].x - originPoints[1].x,
//           originPoints[0].y - originPoints[1].y
//         );
//         const maxDist = {
//           x: options.axis.includes("x") ? pointDistance / 2 : 0,
//           y: options.axis.includes("y") ? pointDistance / 2 : 0
//         };

//         gsap.ticker.add(() => {
//           gsap.set(path, {
//             attr: {
//               d: spline(liquidPoints, options.tension, options.close)
//             }
//           });
//         });

//         window.addEventListener("mousemove", (e) => {
//           const { x, y } = transformCoords(e);

//           mousePos.x = x;
//           mousePos.y = y;

//           liquidPoints.forEach((point, index) => {
//             const pointOrigin = originPoints[index];
//             const distX = Math.abs(pointOrigin.x - mousePos.x);
//             const distY = Math.abs(pointOrigin.y - mousePos.y);

//             if (distX <= options.range.x && distY <= options.range.y) {
//               const difference = {
//                 x: pointOrigin.x - mousePos.x,
//                 y: pointOrigin.y - mousePos.y
//               };

//               const target = {
//                 x: pointOrigin.x + difference.x,
//                 y: pointOrigin.y + difference.y
//               };

//               const x = gsap.utils.clamp(
//                 pointOrigin.x - maxDist.x,
//                 pointOrigin.x + maxDist.x,
//                 target.x
//               );

//               const y = gsap.utils.clamp(
//                 pointOrigin.y - maxDist.y,
//                 pointOrigin.y + maxDist.y,
//                 target.y
//               );

//               gsap.to(point, {
//                 x: x,
//                 y: y,
//                 ease: "sine",
//                 overwrite: true,
//                 duration: 0.175,
//                 onComplete() {
//                   gsap.to(point, {
//                     x: pointOrigin.x,
//                     y: pointOrigin.y,
//                     ease: "elastic.out(1, 0.3)",
//                     duration: 1.25
//                   });
//                 }
//               });
//             }
//           });
//         });
//       }

//       const prefersReducedMotionQuery = window.matchMedia(
//         "(prefers-reduced-motion: reduce)"
//       );

//       if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
//         createLiquidPath(circlePath, {
//           detail: 16,
//           tension: 1,
//           close: true,
//           range: {
//             x: 20,
//             y: 20
//           },
//           axis: ["x", "y"]
//         });
//       }
//     }, root); // <- scopes all selector text to the root element

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={root} className="app">
//       <svg viewBox="0 0 300 200">
//         <defs>
//           <mask id="blob-mask">
//             <path
//               id="mask-path"
//               d="M 252 100 C 254 164 277 151 147 151 C 40 149 42 161 42 102 C 41 40 33 53 146 51 C 260 49 251 40 252 100 Z"
//               fill="#fff"
//               stroke="none"
//             />
//           </mask>
//         </defs>
//         <image
//           width="100%"
//           height="100%"
//           href="https://res.cloudinary.com/alistairheusbucket/image/upload/v1691751585/ezgif-1-8d701db180_af1htk.gif"
//           mask="url(#blob-mask)"
//         />
//       </svg>

//       {/* <div className="box">Hello</div> */}
//     </div>
//   );
// }

// function formatPoints(points, close) {
//   points = [...points];

//   if (!Array.isArray(points[0])) {
//     points = points.map(({ x, y }) => [x, y]);
//   }

//   if (close) {
//     const lastPoint = points[points.length - 1];
//     const secondToLastPoint = points[points.length - 2];

//     const firstPoint = points[0];
//     const secondPoint = points[1];

//     points.unshift(lastPoint);
//     points.unshift(secondToLastPoint);

//     points.push(firstPoint);
//     points.push(secondPoint);
//   }

//   return points.flat();
// }

// function spline(points = [], tension = 1, close = false, cb) {
//   points = formatPoints(points, close);

//   const size = points.length;
//   const last = size - 4;

//   const startPointX = close ? points[2] : points[0];
//   const startPointY = close ? points[3] : points[1];

//   let path = "M" + [startPointX, startPointY];

//   cb && cb("MOVE", [startPointX, startPointY]);

//   const startIteration = close ? 2 : 0;
//   const maxIteration = close ? size - 4 : size - 2;
//   const inc = 2;

//   for (let i = startIteration; i < maxIteration; i += inc) {
//     const x0 = i ? points[i - 2] : points[0];
//     const y0 = i ? points[i - 1] : points[1];

//     const x1 = points[i + 0];
//     const y1 = points[i + 1];

//     const x2 = points[i + 2];
//     const y2 = points[i + 3];

//     const x3 = i !== last ? points[i + 4] : x2;
//     const y3 = i !== last ? points[i + 5] : y2;

//     const cp1x = x1 + ((x2 - x0) / 6) * tension;
//     const cp1y = y1 + ((y2 - y0) / 6) * tension;

//     const cp2x = x2 - ((x3 - x1) / 6) * tension;
//     const cp2y = y2 - ((y3 - y1) / 6) * tension;

//     path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];

//     cb && cb("CURVE", [cp1x, cp1y, cp2x, cp2y, x2, y2]);
//   }

//   return path;
// }

// function createCoordsTransformer(svg) {
//   const pt = svg.createSVGPoint();

//   return function (e) {
//     pt.x = e.clientX;
//     pt.y = e.clientY;

//     return pt.matrixTransform(svg.getScreenCTM().inverse());
//   };
// }

// function pointsInPath(path, numPoints = 10) {
//   const pathLength = path.getTotalLength();
//   const step = pathLength / numPoints;
//   const points = [];

//   for (let i = 0; i < pathLength; i += step) {
//     points.push(path.getPointAtLength(i));
//   }

//   return points;
// }

// function createLiquidPath(path, options) {
//   const svgPoints = pointsInPath(path, options.detail);
//   const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
//   const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

//   const mousePos = { x: 0, y: 0 };
//   const transformCoords = createCoordsTransformer(path.closest("svg"));

//   const pointDistance = Math.hypot(
//     originPoints[0].x - originPoints[1].x,
//     originPoints[0].y - originPoints[1].y
//   );
//   const maxDist = {
//     x: options.axis.includes("x") ? pointDistance / 2 : 0,
//     y: options.axis.includes("y") ? pointDistance / 2 : 0
//   };

//   gsap.ticker.add(() => {
//     gsap.set(path, {
//       attr: {
//         d: spline(liquidPoints, options.tension, options.close)
//       }
//     });
//   });

//   window.addEventListener("mousemove", (e) => {
//     const { x, y } = transformCoords(e);

//     mousePos.x = x;
//     mousePos.y = y;

//     liquidPoints.forEach((point, index) => {
//       const pointOrigin = originPoints[index];
//       const distX = Math.abs(pointOrigin.x - mousePos.x);
//       const distY = Math.abs(pointOrigin.y - mousePos.y);

//       if (distX <= options.range.x && distY <= options.range.y) {
//         const difference = {
//           x: pointOrigin.x - mousePos.x,
//           y: pointOrigin.y - mousePos.y
//         };

//         const target = {
//           x: pointOrigin.x + difference.x,
//           y: pointOrigin.y + difference.y
//         };

//         const x = gsap.utils.clamp(
//           pointOrigin.x - maxDist.x,
//           pointOrigin.x + maxDist.x,
//           target.x
//         );

//         const y = gsap.utils.clamp(
//           pointOrigin.y - maxDist.y,
//           pointOrigin.y + maxDist.y,
//           target.y
//         );

//         gsap.to(point, {
//           x: x,
//           y: y,
//           ease: "sine",
//           overwrite: true,
//           duration: 0.175,
//           onComplete() {
//             gsap.to(point, {
//               x: pointOrigin.x,
//               y: pointOrigin.y,
//               ease: "elastic.out(1, 0.3)",
//               duration: 1.25
//             });
//           }
//         });
//       }
//     });
//   });
// }

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./styles.css";

export default function App() {
  const root = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // all your animations go in here...

      const circlePath = document.getElementById("mask-path");

      function createLiquidPath(path, options) {
        const svgPoints = pointsInPath(path, options.detail);
        const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
        const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

        const mousePos = { x: 0, y: 0 };
        const transformCoords = createCoordsTransformer(path.closest("svg"));

        const pointDistance = Math.hypot(
          originPoints[0].x - originPoints[1].x,
          originPoints[0].y - originPoints[1].y
        );
        const maxDist = {
          x: options.axis.includes("x") ? pointDistance / 2 : 0,
          y: options.axis.includes("y") ? pointDistance / 2 : 0
        };

        gsap.ticker.add(() => {
          gsap.set(path, {
            attr: {
              d: spline(liquidPoints, options.tension, options.close)
            }
          });
        });

        window.addEventListener("mousemove", (e) => {
          const { x, y } = transformCoords(e);

          mousePos.x = x;
          mousePos.y = y;

          liquidPoints.forEach((point, index) => {
            const pointOrigin = originPoints[index];
            const distX = Math.abs(pointOrigin.x - mousePos.x);
            const distY = Math.abs(pointOrigin.y - mousePos.y);

            if (distX <= options.range.x && distY <= options.range.y) {
              const difference = {
                x: pointOrigin.x - mousePos.x,
                y: pointOrigin.y - mousePos.y
              };

              const target = {
                x: pointOrigin.x + difference.x,
                y: pointOrigin.y + difference.y
              };

              const x = gsap.utils.clamp(
                pointOrigin.x - maxDist.x,
                pointOrigin.x + maxDist.x,
                target.x
              );

              const y = gsap.utils.clamp(
                pointOrigin.y - maxDist.y,
                pointOrigin.y + maxDist.y,
                target.y
              );

              gsap.to(point, {
                x: x,
                y: y,
                ease: "sine",
                overwrite: true,
                duration: 0.175,
                onComplete() {
                  gsap.to(point, {
                    x: pointOrigin.x,
                    y: pointOrigin.y,
                    ease: "elastic.out(1, 0.3)",
                    duration: 1.25
                  });
                }
              });
            }
          });
        });
      }

      const prefersReducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

      if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
        createLiquidPath(circlePath, {
          detail: 16,
          tension: 1,
          close: true,
          range: {
            x: 20,
            y: 20
          },
          axis: ["x", "y"]
        });
      }
    }, root); // <- scopes all selector text to the root element

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="app">
      <div className="wrapper">
        <video
          autoPlay
          playsInline
          muted
          loop
          poster="http://i.imgur.com/xHO6DbC.png"
        >
          <source src="https://storage.coverr.co/videos/7RzPQrmB00s01rknm8VJnXahEyCy4024IMG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijg3NjdFMzIzRjlGQzEzN0E4QTAyIiwiaWF0IjoxNjI5MTg2NjA0fQ.M8oElp5VNO8bWEWmdF2nGiu3qDOOYRFfP8wkKvl8I20" />
        </video>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 285 80"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="mask" x={0} y={0} width="100%" height="100%">
              <path
                id="mask-path"
                d="M 252 100 C 254 164 277 151 147 151 C 40 149 42 161 42 102 C 41 40 33 53 146 51 C 260 49 251 40 252 100 Z"
                fill="#fff"
                stroke="#ff0000"
              />
            </mask>
          </defs>
          {/* <rect x={0} y={0} width="100%" height="50%" fill="red" /> */}
          {/* <rect x={0} y={0} width="15%" height="100%" fill="#333" /> */}
        </svg>
      </div>

      {/* <div className="box">Hello</div> */}
    </div>
  );
}

function formatPoints(points, close) {
  points = [...points];

  if (!Array.isArray(points[0])) {
    points = points.map(({ x, y }) => [x, y]);
  }

  if (close) {
    const lastPoint = points[points.length - 1];
    const secondToLastPoint = points[points.length - 2];

    const firstPoint = points[0];
    const secondPoint = points[1];

    points.unshift(lastPoint);
    points.unshift(secondToLastPoint);

    points.push(firstPoint);
    points.push(secondPoint);
  }

  return points.flat();
}

function spline(points = [], tension = 1, close = false, cb) {
  points = formatPoints(points, close);

  const size = points.length;
  const last = size - 4;

  const startPointX = close ? points[2] : points[0];
  const startPointY = close ? points[3] : points[1];

  let path = "M" + [startPointX, startPointY];

  cb && cb("MOVE", [startPointX, startPointY]);

  const startIteration = close ? 2 : 0;
  const maxIteration = close ? size - 4 : size - 2;
  const inc = 2;

  for (let i = startIteration; i < maxIteration; i += inc) {
    const x0 = i ? points[i - 2] : points[0];
    const y0 = i ? points[i - 1] : points[1];

    const x1 = points[i + 0];
    const y1 = points[i + 1];

    const x2 = points[i + 2];
    const y2 = points[i + 3];

    const x3 = i !== last ? points[i + 4] : x2;
    const y3 = i !== last ? points[i + 5] : y2;

    const cp1x = x1 + ((x2 - x0) / 6) * tension;
    const cp1y = y1 + ((y2 - y0) / 6) * tension;

    const cp2x = x2 - ((x3 - x1) / 6) * tension;
    const cp2y = y2 - ((y3 - y1) / 6) * tension;

    path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];

    cb && cb("CURVE", [cp1x, cp1y, cp2x, cp2y, x2, y2]);
  }

  return path;
}

function createCoordsTransformer(svg) {
  const pt = svg.createSVGPoint();

  return function (e) {
    pt.x = e.clientX;
    pt.y = e.clientY;

    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
}

function pointsInPath(path, numPoints = 10) {
  const pathLength = path.getTotalLength();
  const step = pathLength / numPoints;
  const points = [];

  for (let i = 0; i < pathLength; i += step) {
    points.push(path.getPointAtLength(i));
  }

  return points;
}

function createLiquidPath(path, options) {
  const svgPoints = pointsInPath(path, options.detail);
  const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
  const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

  const mousePos = { x: 0, y: 0 };
  const transformCoords = createCoordsTransformer(path.closest("svg"));

  const pointDistance = Math.hypot(
    originPoints[0].x - originPoints[1].x,
    originPoints[0].y - originPoints[1].y
  );
  const maxDist = {
    x: options.axis.includes("x") ? pointDistance / 2 : 0,
    y: options.axis.includes("y") ? pointDistance / 2 : 0
  };

  gsap.ticker.add(() => {
    gsap.set(path, {
      attr: {
        d: spline(liquidPoints, options.tension, options.close)
      }
    });
  });

  window.addEventListener("mousemove", (e) => {
    const { x, y } = transformCoords(e);

    mousePos.x = x;
    mousePos.y = y;

    liquidPoints.forEach((point, index) => {
      const pointOrigin = originPoints[index];
      const distX = Math.abs(pointOrigin.x - mousePos.x);
      const distY = Math.abs(pointOrigin.y - mousePos.y);

      if (distX <= options.range.x && distY <= options.range.y) {
        const difference = {
          x: pointOrigin.x - mousePos.x,
          y: pointOrigin.y - mousePos.y
        };

        const target = {
          x: pointOrigin.x + difference.x,
          y: pointOrigin.y + difference.y
        };

        const x = gsap.utils.clamp(
          pointOrigin.x - maxDist.x,
          pointOrigin.x + maxDist.x,
          target.x
        );

        const y = gsap.utils.clamp(
          pointOrigin.y - maxDist.y,
          pointOrigin.y + maxDist.y,
          target.y
        );

        gsap.to(point, {
          x: x,
          y: y,
          ease: "sine",
          overwrite: true,
          duration: 0.175,
          onComplete() {
            gsap.to(point, {
              x: pointOrigin.x,
              y: pointOrigin.y,
              ease: "elastic.out(1, 0.3)",
              duration: 1.25
            });
          }
        });
      }
    });
  });
}
