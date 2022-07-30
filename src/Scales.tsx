/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from "react";
import { createDocumentRegistry } from "typescript";
import "./Scales.css"
export function Scales() {
    useEffect(() => { init(); }, [])
    return <div className="scales-container">
        <canvas id="can1" className="myCan"></canvas>
        {/* <img className="skeleton hide" id="skeleton" src="Scales/skeleton.png" />
        <img className="scale hide" id="scale" src="Scales/scale.png" />
        <img className="scale left hide" src="Scales/scale.png" />
        <img className="poll hide" id="poll" src="Scales/poll.png" /> */}
    </div>;
}
async function init() {
    const canvas = document.getElementById("can1")! as HTMLCanvasElement;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')!;
    const scaleImg = img();
    scaleImg.src = "Scales/scale.png"
    const skeletonImg = img();
    skeletonImg.src = "Scales/skeleton.png"
    const pollImg = img();
    pollImg.src = "Scales/poll.png"


    await Promise.all([skeletonImg.decode(), scaleImg.decode(), pollImg.decode()]);
    const skeleton = new Rectangle(skeletonImg, new Point({ x: 100, y: 10 }), "No Attachment");
    const leftScale = new Rectangle(scaleImg, new Point({ x: -82, y: 24 }), "Attached Left");
    const rightScale = new Rectangle(scaleImg, new Point({ x: -176, y: 24 }), "Attached Right");
    skeleton.rotate(10)
    skeleton.clr = "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)";
    skeleton.addChild(leftScale);
    skeleton.addChild(rightScale);
    skeleton.draw(ctx);
}







// function rotateCoordinates(obj: { x: number, y: number }, angle: number) {
//     const rad = angle * Math.PI / 180;
//     const cos = Math.cos(rad);
//     const sin = Math.sin(rad);
//     // return {
//     obj.x = obj.x * cos - obj.y * sin;
//     obj.y = obj.x * sin + obj.y * cos
//     // }
// }


function img() {
    const i = new Image();
    return i;
}
interface PointParams {
    x: number;
    y: number;
}
class Point {
    x: number;
    y: number;
    constructor({ x, y }: PointParams) {
        this.x = x;
        this.y = y;
    }
    rotated(deg: number) {
        const rad = degrees_to_radians(deg);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        let x = this.x * cos - this.y * sin;
        let y = this.x * sin + this.y * cos
        return new Point({ x, y })
    }
    cp() {
        return new Point(this)
    }
}
function degrees_to_radians(degrees: number) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}


type ParentAttachment = "No Attachment" | "Attached Left" | "Attached Right"

interface BasicRectangle {
    left: Point;
    right: Point;
    width: number;
    height: number;
}
class Rectangle implements BasicRectangle {
    left: Point;
    right: Point;
    width: number;
    height: number;
    //in 360 format
    rotated: number;
    actualRect: BasicRectangle;
    img: HTMLImageElement;
    children: Rectangle[];
    parent?: Rectangle;
    clr?: string
    attachment: ParentAttachment;


    constructor(img: HTMLImageElement, pos: Point, attachment: ParentAttachment = "Attached Left") {
        this.left = new Point(pos);
        this.img = img;
        this.rotated = 0;
        this.right = new Point({ x: this.left.x + img.width, y: this.left.y });
        this.actualRect = this.currentRect();
        this.width = img.width;
        this.height = img.height;
        this.children = [];
        this.attachment = attachment;
    }
    rotate(deg: number) {
        this.rotated = deg;
        this.actualRect.left = this.left.rotated(deg)
        this.actualRect.right = this.right.rotated(deg)
    }
    currentRect(): BasicRectangle {
        return { height: this.height, width: this.width, left: this.left.cp(), right: this.right.cp() }
    }
    addChild(child: Rectangle,) {
        this.children.push(child)
        child.parent = this;
    }
    draw(ctx: CanvasRenderingContext2D) {
        let { x, y } = this.left;
        switch (this.attachment) {
            case "Attached Left": {
                x += this.parent!.actualRect.left.x;
                y += this.parent!.actualRect.left.y;
                break;
            }
            case "Attached Right": {
                x += this.parent!.actualRect.right.x;
                y += this.parent!.actualRect.right.y;
            }
        }
        ctx.save();
        ctx.rotate(degrees_to_radians(this.rotated));
        if (this.clr)
            ctx.filter = this.clr;
        ctx.drawImage(this.img, x, y);
        ctx.restore();
        this.children.forEach(child => {
            child.draw(ctx);
        })
    }

}
const offsets = {
    leftHook: { x: -82, y: 80 },
    rightHook: { x: -174, y: 80 },
}

