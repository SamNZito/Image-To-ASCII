const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

 let image1 = new Image();

 const imageInput = document.getElementById('imageInput');
imageInput.addEventListener('change', handleImage);

const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
inputSlider.addEventListener('change', handleSlider);

const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', ()=>{
    downloadAsciiImage();
});

class Cell {
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx){
        // ctx.fillStyle = 'grey';
        // ctx.fillText(this.symbol, this.x + 1, this.y + 1)
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y)
    }
}

class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
        console.log(this.#pixels);
    }
    #convertToSymbol(g){ // "Ñ@#W$9876543210?!abc;:+=-,._ 
        if(g > 250) return 'Ñ';
        //else if(g < 240) return '.';
        // else if(g > 200) return ';';
        // else if(g > 160) return ':';
        // else if(g > 120) return '+';
        // else if(g > 180) return '=';
        // else if(g > 140) return '-';
        // else if(g > 100) return ',';
        // else if(g > 60) return '.';
        // else if(g > 20) return '_';
        /*else if(g > 240) return '*';
        else if(g > 220) return '+';
        else if(g > 200) return '#';
        else if(g > 180) return '&';
        else if(g > 160) return '%';
        else if(g > 140) return '_';
        else if(g > 120) return ':';
        else if(g > 100) return '$';
        else if(g > 80) return '/';
        else if(g > 60) return '-';
        else if(g > 40) return 'X';
        else if(g > 20) return 'W';*/
        else if(g > 240) return '#';
        else if(g > 230) return 'W';
        else if(g > 220) return '$';
        else if(g > 210) return '9';
        else if(g > 200) return '8';
        else if(g > 190) return '7';
        else if(g > 180) return '6';
        else if(g > 170) return '5';
        else if(g > 160) return '4';
        else if(g > 150) return '3';
        else if(g > 140) return '2';
        else if(g > 130) return '1';
        else if(g > 120) return '0';
        else if(g > 110) return '?';
        else if(g > 100) return '!';
        else if(g > 90) return 'a';
        else if(g > 80) return 'b';
        else if(g > 70) return 'c';
        else if(g > 60) return ';';
        else if(g > 50) return ':';
        else if(g > 40) return '+';
        else if(g > 30) return '=';
        else if(g > 20) return '-';
        else if(g > 15) return ',';
        else if(g > 10) return '.';

        else return '';
        
    }
    #scanImage(cellSize){
        this.#imageCellArray = [];
        for(let y = 0; y < this.#pixels.height; y += cellSize)
        {
            for(let x = 0; x < this.#pixels.width; x += cellSize)
            {
                const posX = x * 4; // might need to change
                const posY = y * 4; // ""
                const pos = (posY * this.#pixels.width) + posX;

                if(this.#pixels.data[pos + 3] > 128){
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    const total = red + green + blue;
                    const averageColorValue = total/3;
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if( total > 200) this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
        //console.log(this.#imageCellArray);
    }
    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for( let i = 0; i < this.#imageCellArray.length; i++)
        {
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }
    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
    }

}

let effect;

function handleSlider(){
    if(inputSlider.value == 1){
        inputLabel.innerHTML = 'Original Image';
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    } else {
        inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px';
        ctx.font = parseInt(inputSlider.value) * 1.2 + ' px Verdana';     
        effect.draw(parseInt(inputSlider.value));
    }
}

function downloadAsciiImage() {
    const canvas = document.getElementById('canvas1');
    const dataURL = canvas.toDataURL('image/jpeg');
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = dataURL;
}

function handleImage() {
    const selectedFile = imageInput.files[0];
    if (selectedFile) {
        const imageUrl = URL.createObjectURL(selectedFile);

        // Load the selected image into image1
        image1 = new Image();
        image1.src = imageUrl;

        image1.onload = function () {
            canvas.width = image1.width;
            canvas.height = image1.height;
            effect = new AsciiEffect(ctx, image1.width, image1.height);
            handleSlider();
        };
    }
}

image1.onload = function inialize(){
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height);
    handleSlider();
}

