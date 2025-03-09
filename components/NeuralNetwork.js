"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const NeuralNetwork = () => {
  const [nodes, setNodes] = useState([]);
  const numNodes = 20;
  const maxDistance = 150;
  const draggingNode = useRef(null); // To track dragged node

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);

    let newNodes = [];
    for (let i = 0; i < numNodes; i++) {
      newNodes.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-1, 1),
        vy: p5.random(-1, 1),
        active: false,
      });
    }
    setNodes(newNodes);
  };

  const draw = (p5) => {
    p5.background(20, 20, 40);

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (!draggingNode.current || draggingNode.current !== node) {
          node.x += node.vx;
          node.y += node.vy;
        }

        if (node.x < 0 || node.x > p5.width) node.vx *= -1;
        if (node.y < 0 || node.y > p5.height) node.vy *= -1;

        let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
        node.active = d < 50;

        return node;
      })
    );

    for (let node of nodes) {
      p5.fill(node.active ? [0, 255, 255] : [255]);
      p5.noStroke();
      p5.ellipse(node.x, node.y, node.active ? 12 : 10);
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let d = p5.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < maxDistance) {
          p5.stroke(255, nodes[i].active || nodes[j].active ? 200 : 100);
          p5.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
      }
    }
  };

  const mousePressed = (p5) => {
    for (let node of nodes) {
      let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
      if (d < 10) {
        draggingNode.current = node;
        return;
      }
    }

    setNodes((prevNodes) => [
      ...prevNodes,
      {
        x: p5.mouseX,
        y: p5.mouseY,
        vx: p5.random(-1, 1),
        vy: p5.random(-1, 1),
        active: false,
      },
    ]);
  };

  const mouseDragged = (p5) => {
    if (draggingNode.current) {
      draggingNode.current.x = p5.mouseX;
      draggingNode.current.y = p5.mouseY;
    }
  };

  const mouseReleased = () => {
    draggingNode.current = null;
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mousePressed={mousePressed}
      mouseDragged={mouseDragged}
      mouseReleased={mouseReleased}
    />
  );
};

export default NeuralNetwork;
