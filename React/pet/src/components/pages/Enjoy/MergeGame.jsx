import React, { useEffect, useState } from "react";
import { Engine, Render, Runner, World, Bodies, Body, Events } from "matter-js";
import { MERGES } from './merge';
import Swal from "sweetalert2";

const MergeGame = () => {

  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const gameContainer = document.createElement("div");
    document.body.appendChild(gameContainer);
    gameContainer.style.display = "flex";
    gameContainer.style.alignItems = "center";
    gameContainer.style.justifyContent = "center";
    gameContainer.style.height = "80vh";
    gameContainer.style.width = "100vw";
    gameContainer.style.transform = "scale(0.7)";
    gameContainer.style.marginTop = "-5%";

    const engine = Engine.create();
    const render = Render.create({
      engine,
      element: gameContainer,
      options: {
        wireframes: false,
        background: "#ffffff80",
        width: 620,
        height: 850,
      },
    });

    const world = engine.world;

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#1098F7" },
    });

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#1098F7" },
    });

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: { fillStyle: "#1098F7" },
    });

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      name: "topLine",
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#1098F7" },
    });

    World.add(world, [leftWall, rightWall, ground, topLine]);

    Render.run(render);
    Runner.run(engine);

    let currentBody = null;
    let currentImg = null;
    let disableAction = false;
    let interval = null;
    let num_suika = 0;
    let lastImgIndex = null;

    function resetGame() {
      Engine.clear(engine);
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      Render.world(render);
      setTotalScore(0);
      World.add(world, [leftWall, rightWall, ground, topLine]);

      currentBody = null;
      currentImg = null;
      disableAction = false;
      interval = null;
      num_suika = 0;
      lastImgIndex = null;

      Render.run(render);
      Runner.run(engine);
      addImg();
    }

    function addImg() {
      const index = Math.floor(Math.random() * 5);
      const img = MERGES[index];

      const body = Bodies.circle(300, 50, img.radius, {
        index: index,
        isSleeping: true,
        render: {
          sprite: { texture: `/merge/${img.name}.png` },
        },
        restitution: 0.5,
      });

      currentBody = body;
      currentImg = img;

      World.add(world, body);

      if (index === MERGES.length - 1) {
        if (lastImgIndex === index) {
          num_suika++;

          if (num_suika >= 2) {
            showGameWin();
          }
        } else {
          num_suika = 1;
        }
        lastImgIndex = index;
      }
    }

    function showGameWin() {
      Swal.fire({
        title: "Game Win!",
        width: "fit-content",
        text: "Continue or Start a new Game?",
        showCancelButton: true,
        confirmButtonText: "Continue",
        confirmButtonColor: "#1098F7",
        cancelButtonText: "New Game",
        cancelButtonColor: "#B80042",
        html:'<img src="/merge/win.png" style="width:300px; height:300px;" />'
      }).then((result) => {
        if (result.isConfirmed) {
          if(!currentBody){
            addImg();
          }
        } else {
          resetGame();
        }
      });
    }

    window.onkeydown = (event) => {
      if (disableAction) {
        return;
      }

      switch (event.code) {
        case "ArrowLeft":
          if (interval) return;

          interval = setInterval(() => {
            if (currentBody.position.x - currentImg.radius > 30)
              Body.setPosition(currentBody, {
                x: currentBody.position.x - 1,
                y: currentBody.position.y,
              });
          }, 5);
          break;

        case "ArrowRight":
          if (interval) return;

          interval = setInterval(() => {
            if (currentBody.position.x + currentImg.radius < 590)
              Body.setPosition(currentBody, {
                x: currentBody.position.x + 1,
                y: currentBody.position.y,
              });
          }, 5);
          break;

        case "ArrowDown":
          disableAction = true;
          currentBody.isSleeping = false;

          setTimeout(() => {
            addImg();
            disableAction = false;
          }, 500);
      }
    };

    window.onkeyup = (event) => {
      switch (event.code) {
        case "ArrowLeft":
        case "ArrowRight":
          clearInterval(interval);
          interval = null;
      }
    };

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
          const removedImg = [collision.bodyA, collision.bodyB];
          World.remove(world, removedImg);

          const index = collision.bodyA.index;

          if (index === MERGES.length - 1) {
            return;
          }

          const newImg = MERGES[index + 1];
          const newScore = newImg.score;
          setTotalScore((prevScore)=> prevScore+newScore);
          const newBody = Bodies.circle(
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newImg.radius,
            {
              render: {
                sprite: { texture: `/merge/${newImg.name}.png` },
              },
              index: index + 1,
            }
          );

          World.add(world, newBody);
          console.log("Total Score:", totalScore);
        }

        if (
          !disableAction &&
          (collision.bodyA.name === "topLine" ||
            collision.bodyB.name === "topLine")
        ) {
          Swal.fire({
            title: "Game Over!",
            width: "fit-content",
            showCancelButton: true,
            confirmButtonText: "New Game",
            confirmButtonColor: "#1098F7",
            html:'<img src="/merge/over.png" style="width:300px; height:200px;" />'
          }).then((result) => {
            if (result.isConfirmed) {
              resetGame();
            }
          });
        }
      });
    });

    addImg();

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      World.clear(world);
      document.body.removeChild(gameContainer);
    };
  }, []); 

  return (
      <div style={{textAlign:'center', marginBottom:'-5%', paddingTop:'2%'}}>Score: {totalScore}</div>
    ); 
};

export default MergeGame;
