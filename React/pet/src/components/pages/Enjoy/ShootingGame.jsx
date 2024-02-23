import React, { useEffect } from 'react';

const ShootingGame = () => {
    useEffect(() => {
        // 캔버스 생성
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 500;

        // 이미지 로드
        const loadImage = (src) => {
            const image = new Image();
            image.src = src;
            return image;
        };

        const backgraoundImage = loadImage("../../gameimg/background.png");
        const dogImage = loadImage("../../gameimg/dog.png");
        const poopImage = loadImage("../../gameimg/poop.png");
        const boneImage = loadImage("../../gameimg/bone.png");
        const gameOverImage = loadImage("../../gameimg/gameover.png");

        let gameOver = false;
        let score = 0;
        
        // 강아지 좌표
        let dogX = canvas.width / 2 - 32;
        let dogY = canvas.height - 64;

        // 뼈들을 저장하는 리스트
        const boneList = [];
        function Bone() {
            this.x=0;
            this.y=0;
            this.init=function(){
                this.x = dogX+8;
                this.y = dogY;
                this.alive=true //true이면 살아있는 뼈 false면 죽은 뼈
                boneList.push(this)
            }
            this.update = function(){
                this.y-=7
            }
            this.checkHit = function() {
                for (let i = 0; i < enemyList.length; i++) {
                    if (this.alive && this.y <= enemyList[i].y + 30 && this.x >= enemyList[i].x-30 && this.x <= enemyList[i].x + 30) {
                        // 뼈이 적에게 맞았을 때
                        score++;
                        this.alive = false; // 뼈 제거
                        enemyList.splice(i, 1); // poop 제거
                    }
                }
            
                if (this.y < 0) {
                    this.alive = false; // 뼈이 화면 밖으로 나갔을 때
                }
            }
        }
        function generateRandomValue(min,max){
            let randomNum = Math.floor(Math.random()*(max-min+1))+min
            return randomNum
        }
        // 적군 리스트
        const enemyList = [];
        function Enemy() {
            this.x=0;
            this.y=0;
            this.init = function(){
                this.y=0;
                this.x=generateRandomValue(0,canvas.width-64)
                enemyList.push(this)
            }
            this.update=function(){
                this.y+=3.5;
        
                if(this.y >= canvas.height-100){
                    gameOver=true;
                    console.log("gameover")
                }
            }
        }

        // 키 입력 이벤트 리스너 설정
        const keysDown = {};
        const setupKeyboardListener = () => {
            document.addEventListener("keydown", (event) => {
                keysDown[event.keyCode] = true;
            });
            document.addEventListener("keyup", (event) => {
                delete keysDown[event.keyCode];
                if (event.keyCode === 32) {
                    createBone();
                }
            });
        };

        // 뼈 생성 함수
        const createBone = () => {
            console.log("뼈 생성") 
            let b = new Bone();
            b.init();
            console.log("새로운 뼈 리스트:",boneList) 
        };

        // 적군 생성 함수
        const createEnemy = () => {
            const interval = setInterval(function(){
                let e = new Enemy()
                e.init()
            },1000)
        };

        // 게임 업데이트 함수
        const update = () => {
            if(39 in keysDown){// right
                dogX +=4.5; //개의 속도
            } 
            if(37 in keysDown){// left
                dogX -=4.5; //개의 속도
            } 
        
            //개의 범위 설정(캔버스 안에서만 움직이기)
            if(dogX<=0){
                dogX=0
            }
            if(dogX>=canvas.width-64){
                dogX=canvas.width-64;
            }
        
            //뼈의 y좌표 업데이트하는 함수 호출
            for(let i=0; i<boneList.length; i++){
                if(boneList[i].alive){
                    boneList[i].update()
                    boneList[i].checkHit()
                }
               
            }
        
            for(let i=0; i<enemyList.length; i++){
                enemyList[i].update();
            }
        };

        // 게임 렌더 함수
        const render = () => {
            ctx.drawImage(backgraoundImage,0,0,canvas.width, canvas.height);
            ctx.drawImage(dogImage,dogX,dogY,32,32);
            ctx.fillText(`Score: ${score}`, 20, 20);
            ctx.fillStyle="white"
            ctx.font="20px Arial"
            for(let i=0; i<boneList.length; i++){
                if(boneList[i].alive){
                    ctx.drawImage(boneImage, boneList[i].x, boneList[i].y,20,20)
                }
            
            }

            for(let i=0; i<enemyList.length; i++){
                ctx.drawImage(poopImage,enemyList[i].x,enemyList[i].y,32,32);
            }
        };

        // 게임 메인 함수
        const main = () => {
            if(!gameOver){
                update(); //좌표값을 없데이트하고
                render(); //그려주고
                requestAnimationFrame(main);
            }
            else{
                ctx.drawImage(gameOverImage,120,100,150,150);
            }
        };

        // 게임 실행
        loadImage();
        setupKeyboardListener();
        createEnemy();
        main();

        // 캔버스를 가운데로 정렬하기 위한 스타일 적용
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.style.width = "100vw";
        container.style.height = "100vh";
        container.appendChild(canvas);
        document.body.appendChild(container);

        return () => {
            // 메모리 누수 방지를 위해 이펙트 클리어
            document.body.removeChild(container);
        };
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

    return null; // ShootingGame 컴포넌트 자체는 아무것도 렌더링하지 않음
};

export default ShootingGame;
