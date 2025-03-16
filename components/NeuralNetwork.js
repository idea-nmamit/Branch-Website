"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const NeuralNetwork = () => {
  const [nodes, setNodes] = useState([]);
  const numNodes = 25;
  const maxDistance = 180;
  const draggingNode = useRef(null);

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
        glow: false,
        color: [p5.random(150, 255), p5.random(100, 255), p5.random(150, 255)],
      });
    }
    setNodes(newNodes);
  };

  const draw = (p5) => {
    // Dark, smooth, slightly animated background for a cyberpunk feel
    p5.background(23, 0, 58, 150);
    p5.noFill();

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
        node.glow = d < 70; // Glow effect at a larger radius

        return node;
      })
    );

    // Draw glowing connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let d = p5.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < maxDistance) {
          let alpha = p5.map(d, 0, maxDistance, 255, 50);
          let colorShift = Math.sin(p5.frameCount * 0.05) * 50; // Dynamic glow
          p5.stroke(180 + colorShift, 60, 255, alpha);
          p5.strokeWeight(1.5);
          p5.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
      }
    }

    // Draw glowing pulsating nodes with blur effect
    for (let node of nodes) {
      let glowSize = node.active ? 16 : 8; // 🔹 Reduced from (20 : 10)
      let pulseSize = node.active ? 4 * Math.sin(p5.frameCount * 0.1) : 0; // 🔹 Reduced from 5

      // Outer glow (Smaller now)
      p5.fill(...node.color, 40);
      p5.ellipse(node.x, node.y, glowSize * 1.5); // 🔹 Reduced from `glowSize * 2`

      // Inner glow with blur effect (Smaller now)
      p5.fill(...node.color, 180);
      p5.ellipse(node.x, node.y, glowSize + pulseSize);

      // Core node (Smaller now)
      p5.fill(255);
      p5.ellipse(node.x, node.y, 3); // 🔹 Reduced from 5
    }

    // Particle trail effect
    for (let i = 0; i < nodes.length; i++) {
      let trailOpacity = Math.sin(p5.frameCount * 0.02) * 100;
      p5.fill(255, 255, 255, trailOpacity);
      p5.ellipse(nodes[i].x - nodes[i].vx * 5, nodes[i].y - nodes[i].vy * 5, 2); // 🔹 Reduced from 4
    }
  };

  const mousePressed = (p5) => {
    for (let node of nodes) {
      let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
      if (d < 12) {
        draggingNode.current = node;
        return;
      }
    }

    // Add new node with glowing effect
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        x: p5.mouseX,
        y: p5.mouseY,
        vx: p5.random(-1, 1),
        vy: p5.random(-1, 1),
        active: false,
        glow: true,
        color: [p5.random(150, 255), p5.random(100, 255), p5.random(150, 255)],
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
