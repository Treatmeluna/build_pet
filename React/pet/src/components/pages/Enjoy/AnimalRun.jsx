import React, { useState, useEffect } from "react";

const AnimalRun = () => {
    const [canvas, setCanvas] = useState(null);
    const [ctx, setCtx] = useState(null);
    const [img0, setImg0] = useState(new Image());
    const [img1, setImg1] = useState(new Image());
    const [dino, setDino] = useState({
        x:10,
        y: 200,
        width: 50,
        height:50,
    });
    const [cactusList, setCactusList] = useState([]);
    const [timer, setTimer] = useState(0);
    const [jumping, setJumping] = useState(false);
    const [jumpTimer, setJumpTimer] = useState(0);
    const [animation, setAnimation] = useState(null);
    const [gameState, setGameState] = useState(0);
    const [life, setLife] = useState(5);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvasElement = document.getElementById('canvas');
        setCanvas(canvasElement);
        setCtx(canvasElement.getContext('2d'));
        setImg0(new Image());
        setImg1(new Image());
    }, []);

    const Cactus = () => {
        return {
            x: 500,
            y: 200,
            width: 50,
            height: 50,
            draw() {
                ctx.fillStyle = 'red';
                ctx.drawImage(img1, this.x, this.y);
            },
        };
    };

    const handleJump = () => {
        if (gameState === 0) {
            setGameState(1);
            document.querySelector('h2').style.display = 'none';
            프레임마다실행할거();
        } else if (gameState === 1) {
            setJumping(true);
        }
    };

    const restartGame = () => {
        window.location.reload();
    };

    const 충돌하냐 = (dino, cactus) => {
        const x축차이 = cactus.x - (dino.x + dino.width);
        const y축차이 = cactus.y - (dino.y + dino.height);

        if (x축차이 < 0 && y축차이 < 0) {
            setLife((prevLife) => prevLife -1);
            document.querySelector('#life').innerHTML = life -1;

            if (life === 1) {
                alert('Game Over');
                setGameState(0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animation);
                restartGame();
            }

            return true;
        } else {
            return false;
        }
    };

    const 프레임마다실행할거 = () => {
        setAnimation(requestAnimationFrame(프레임마다실행할거));
        setTimer((prevTimer) => prevTimer + 1);

        if (gameState === 1) {
            if (timer % 200 === 0) {
                const cactus = new Cactus();
                setCactusList((prevList) => [...prevList, cactus]);
            }

            setCactusList((prevList) => {
                return prevList.map((a, i, o) => {
                    if (a.x < 0) {
                        setScore((prevScore) => prevScore + 10);
                        document.querySelector('#score').innerHTML = score + 10;
                        return null;
                    } else if (충돌하냐(dino, a)){
                        return null;
                    }

                    a.x--;
                    충돌하냐(dino, a);
                    a.draw();
                    return a;
                }).filter((item) => item !== null);
            });
        }

        if (jumping) {
            setDino((prevDino) => ({ ... prevDino, y: prevDino.y -5}));
            setJumpTimer((prevJumpTimer) => prevJumpTimer + 1);
        }
        
        if (jumpTimer > 20) {
            setJumping(false);
            setJumpTimer(0);
        }
        
        if (!jumping) {
            if (dino.y < 200) {
                setDino((prevDino) => ({ ...prevDino, y: prevDino.y + 1}));
            }
        }

        dino.draw();
    };

    return (
        <>
            <canvas id="canvas" width={canvas.width} height={canvas.height}></canvas>
            <h2>Press Space to Jump</h2>
            <div>Life : <span id="life">{life}</span></div>
            <div>Score : <span id="score">{score}</span></div>
            <button id="restartButton" onClick={restartGame}>
                Restart
            </button>
            
        </>
    )
}
export default AnimalRun;