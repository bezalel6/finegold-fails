/* eslint-disable jsx-a11y/alt-text */
import { Button, Typography } from "@mui/material";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createDocumentRegistry } from "typescript";
import "./Scales.css";

export default forwardRef((_, ref) => {
  useEffect(() => {
    init();
    return () => destroyer.forEach((a) => a());
  }, []);

  const add = 1;
  const rightRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    rightRef.current!.onclick = async (e) => {
      scalesState.addToRight(add);
    };
    rightRef.current!.oncontextmenu = (e) => {
      scalesState.addToLeft(add);
      return false;
    };
  });
  [nums, setNums] = useState({ right: 0, left: 0 });
  return (
    <div className="wrapper">
      <div id="container" ref={rightRef} className="scales-container">
        <div className="skeleton-container" id="skeleton">
          <img src="Scales/skeleton.png" className="skeleton" alt="" />
          <div id="right-container" className="scale-container">
            <img
              src="Scales/scale.png"
              id="right"
              className="scale right"
              alt=""
            />
            <div id="right-contained" className="scales-items"></div>
            <Typography className="scale-num" variant="h3">
              {nums.right}
            </Typography>
          </div>
          <div id="left-container" className="scale-container">
            <img
              src="Scales/scale.png"
              id="left"
              className="scale left"
              alt=""
            />
            <div id="left-contained" className="scales-items"></div>
            <Typography className="scale-num" variant="h3">
              {nums.left}
            </Typography>
          </div>
        </div>
        <img src="Scales/poll.png" className="poll" id="poll" alt="" />
      </div>
    </div>
  );
});
let nums, setNums: any;
let scalesState: ScalesState;
function init() {
  scalesState = new ScalesState();
  // setTimeout(() => {
  //     state.addToLeft(60)
  // }, 5000)
  // state.idle()
}
export function getState() {
  return scalesState;
}
const destroyer: (() => void)[] = [];
function animate(func: () => void, ms: number = 500) {
  const interval = setInterval(func, ms);
  destroyer.push(() => {
    clearInterval(interval);
  });
}

class ScalesState {
  right: MyElement;
  left: MyElement;
  skeleton: MyElement;
  poll: MyElement;
  container: MyElement<HTMLDivElement>;
  rightItems: number = 0;
  leftItems: number = 0;
  constructor() {
    this.right = new MyElement("right", true);
    this.left = new MyElement("left", true);
    this.skeleton = new MyElement("skeleton");
    this.poll = new MyElement("poll");
    this.container = new MyElement<HTMLDivElement>("container");
    this.init();
    this.updateWeights();
  }
  create(side: "right" | "left") {
    const child = document.createElement("img");
    child.src = `./${side === "right" ? "win" : "fail"}.svg`;
    child.className = "child";
    return child;
  }
  init() {
    this.skeleton.translate("90px, 90px");
    this.right.translate("175%, 6%");
    this.left.translate("-35%, 5%");
    // this.container.translate("100px")
    // left.rotate("5deg")
    // right.rotate("5deg")
    this.skeleton.addListener("rotate", (op) => {
      this.right.rotate({ ...op, amount: "-" + op.amount });
      this.left.rotate({ ...op, amount: "-" + op.amount });
    });
    // skeleton.rotate("-40deg")
    this.container.addToTransform({ amount: "0.5, 0.5", type: "scale" });
  }
  idle() {
    const max = 100;
    const step = 1;
    let current = 0;
    let up = true;

    animate(() => {
      const a = up ? 1 : -1;
      current += a * max;
      if (Math.abs(current) === max) up = !up;
      this.skeleton.rotate({ amount: step * a + "deg" });
    });
  }
  addToLeft(add: number = 1) {
    this.leftItems += add;
    this.updateWeights();
  }
  addToRight(add: number = 1) {
    this.rightItems += add;
    this.updateWeights();
  }
  lastRight = 0;
  lastLeft = 0;
  updateWeights() {
    const r = this.rightItems,
      l = this.leftItems;
    for (let i = 0; i < r - this.lastRight; i++) {
      let child = this.create("right");
      this.right.addChild(child);
    }
    for (let i = 0; i < l - this.lastLeft; i++) {
      let child = this.create("left");
      this.left.addChild(child);
    }
    this.lastLeft = l;
    this.lastRight = r;
    setNums({ right: r, left: l });
    // this.right.rotate(`${this.rightItems}deg`)
    // this.left.rotate(`${this.leftItems}deg`)
    const numDeg = ScalesState.convertToDeg(r) - ScalesState.convertToDeg(l);
    this.skeleton.rotate({ amount: `${numDeg}deg`, replaceOldOps: true });
  }
  static convertToDeg(items: number) {
    return items * 0.1;
  }
}

type Listener = (operation: FullOperation) => void;

class MyElement<T extends HTMLElement = HTMLImageElement> {
  element: T;
  container?: MyElement<HTMLDivElement>;
  containedElements?: MyElement<HTMLDivElement>;
  transform: string;

  constructor(id: string, isContained: boolean = false) {
    this.element = document.querySelector("#" + id) as T;
    if (isContained) {
      this.container = new MyElement(id + "-container");
      this.container!.element.className = "element-container";
      this.containedElements = new MyElement(id + "-contained");
    }
    this.transform = "";
  }
  addChild(child: Node) {
    if (this.containedElements) this.containedElements.addChild(child);
    else {
      this.element.appendChild(child);
    }
  }
  addToTransform(operation: FullOperation) {
    if (operation.replaceOldOps) {
      const property = operation.type;
      const b = this.transform;
      const reg = new RegExp(`${property}(.+)`, "g");
      this.transform = this.transform.replaceAll(reg, "");
      // console.log("b4", b, 'after', this.transform, 'property:', property);
    }
    this.transform += " " + operation.type + `(${operation.amount})`;
    if (this.container) {
      this.container.element.style.transform = this.transform;
    } else {
      this.element.style.transform = this.transform;
    }
    this.listeners.get(operation.type)?.forEach((l) => l(operation));
  }

  translate(operation: Operation | string) {
    const op: Operation =
      typeof operation === "string"
        ? ({
            type: "translate",
            amount: operation,
            replaceOldOps: false,
          } as Operation)
        : operation;
    this.addToTransform({ ...op, type: "translate" });
  }
  rotate(operation: Operation) {
    if (operation.amount.startsWith("--")) {
      operation.amount = operation.amount.substring(2);
    }
    this.addToTransform({ ...operation, type: "rotate" });
  }
  listeners: Map<OperationType, Listener[]> = new Map();
  addListener(opType: OperationType, listener: Listener) {
    if (this.listeners.has(opType)) {
      this.listeners.get(opType)?.push(listener);
    } else {
      this.listeners.set(opType, [listener]);
    }
  }
}

type OperationType = "rotate" | "translate" | "scale";

interface Operation {
  amount: string;
  replaceOldOps?: boolean;
}
interface FullOperation extends Operation {
  type: OperationType;
  scale?: string;
}
