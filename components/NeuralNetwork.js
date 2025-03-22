"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const NeuralNetwork = () => {
  const [nodes, setNodes] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const numNodes = 30; // Increased node count for richer visualization
  const maxDistance = 200; // Slightly increased connection distance
  const draggingNode = useRef(null);
  const canvasRef = useRef(null);
  const clickedNodes = useRef([]); // To track clicked nodes for fade effect
  
  // Color themes
  const colorThemes = {
    cyber: {
      bg: [15, 10, 45],
      node: [180, 60, 255],
      connection: [140, 80, 220],
      highlight: [255, 100, 200],
    },
  };
  
  const theme = colorThemes.cyber;

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setup = (p5, canvasParentRef) => {
    canvasRef.current = canvasParentRef;
    const canvas = p5.createCanvas(dimensions.width, dimensions.height).parent(canvasParentRef);
    
    // Initialize nodes with improved variety
    let newNodes = [];
    for (let i = 0; i < numNodes; i++) {
      newNodes.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-0.8, 0.8), // Slightly slower movement for elegance
        vy: p5.random(-0.8, 0.8),
        size: p5.random(3, 8), // Varied node sizes
        active: false,
        glow: false,
        pulsePhase: p5.random(0, p5.TWO_PI), // Individual pulse timing
        color: [
          p5.random(150, 220), 
          p5.random(100, 180), 
          p5.random(200, 255)
        ],
      });
    }
    setNodes(newNodes);
  };

  const draw = (p5) => {
    // Create a smooth gradient background
    const bgGradient = p5.drawingContext;
    const gradient = bgGradient.createLinearGradient(0, 0, p5.width, p5.height);
    gradient.addColorStop(0, `rgba(${theme.bg[0]}, ${theme.bg[1]}, ${theme.bg[2]}, 0.95)`);
    gradient.addColorStop(1, `rgba(${theme.bg[0] + 10}, ${theme.bg[1] + 5}, ${theme.bg[2] + 15}, 0.95)`);
    bgGradient.fillStyle = gradient;
    bgGradient.fillRect(0, 0, p5.width, p5.height);
    
    p5.noFill();

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (!draggingNode.current || draggingNode.current !== node) {
          // Apply slight acceleration for more organic movement
          node.vx += p5.random(-0.03, 0.03);
          node.vy += p5.random(-0.03, 0.03);
          
          // Limit velocity for smoother movement
          node.vx = p5.constrain(node.vx, -1.2, 1.2);
          node.vy = p5.constrain(node.vy, -1.2, 1.2);
          
          node.x += node.vx;
          node.y += node.vy;
        }

        // Bounce off edges with damping
        if (node.x < 0 || node.x > p5.width) {
          node.vx *= -0.9;
          node.x = p5.constrain(node.x, 0, p5.width);
        }
        if (node.y < 0 || node.y > p5.height) {
          node.vy *= -0.9;
          node.y = p5.constrain(node.y, 0, p5.height);
        }

        // Enhanced interactivity - smoother activation
        let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
        const activationRadius = 70;
        const glowRadius = 120;
        
        // Smoother transition for active state
        node.active = p5.lerp(node.active ? 1 : 0, d < activationRadius ? 1 : 0, 0.1) > 0.5;
        node.glow = p5.lerp(node.glow ? 1 : 0, d < glowRadius ? 1 : 0, 0.05) > 0.5;

        return node;
      })
    );

    // Process clicked nodes and update their fade effect
    clickedNodes.current = clickedNodes.current.filter(clickedNode => {
      clickedNode.lifespan -= 2; // Decrease lifespan (controls fade duration)
      return clickedNode.lifespan > 0; // Remove when completely faded
    });
    
    // Draw connections with dynamic opacity and thickness
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let d = p5.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < maxDistance) {
          // Calculate connection strength based on distance
          let strength = p5.map(d, 0, maxDistance, 1, 0);
          strength = p5.pow(strength, 2); // Apply easing for more natural falloff
          
          let alpha = p5.map(d, 0, maxDistance, 220, 30);
          let colorShift = Math.sin(p5.frameCount * 0.02) * 30; // More subtle color shift
          
          // Enhanced connection styling
          p5.strokeWeight(strength * 2);
          
          // Draw glow effect for connections
          p5.stroke(theme.connection[0] + colorShift, theme.connection[1], theme.connection[2], alpha * 0.5);
          p5.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          
          // Draw core connection
          p5.strokeWeight(strength);
          p5.stroke(theme.connection[0] + colorShift, theme.connection[1], theme.connection[2], alpha);
          p5.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          
          // Draw data transfer effect along connections
          if (strength > 0.6 && p5.random() > 0.98) {
            let progress = (p5.frameCount % 60) / 60;
            let particleX = p5.lerp(nodes[i].x, nodes[j].x, progress);
            let particleY = p5.lerp(nodes[i].y, nodes[j].y, progress);
            p5.fill(255, 255, 255, 200);
            p5.noStroke();
            p5.ellipse(particleX, particleY, 3);
          }
        }
      }
    }

    // Draw clicked node ripple effects
    clickedNodes.current.forEach(clickedNode => {
      const alpha = p5.map(clickedNode.lifespan, 0, 100, 0, 150);
      const size = p5.map(clickedNode.lifespan, 0, 100, 80, 10);
      
      p5.noFill();
      p5.stroke(...clickedNode.color, alpha);
      p5.strokeWeight(2);
      p5.ellipse(clickedNode.x, clickedNode.y, size);
      
      // Secondary pulse ripple
      if (clickedNode.lifespan > 50) {
        const innerAlpha = p5.map(clickedNode.lifespan, 50, 100, 0, 120);
        const innerSize = p5.map(clickedNode.lifespan, 50, 100, 40, 5);
        p5.stroke(...clickedNode.color, innerAlpha);
        p5.ellipse(clickedNode.x, clickedNode.y, innerSize);
      }
    });

    // Draw nodes with enhanced styling
    for (let node of nodes) {
      // Calculate pulse effect
      let pulse = Math.sin(p5.frameCount * 0.05 + node.pulsePhase) * 0.5 + 0.5;
      let nodeSizeBase = node.active ? node.size * 2 : node.size;
      let nodeSize = nodeSizeBase + (node.active ? pulse * 5 : pulse * 2);
      
      p5.push();
      p5.translate(node.x, node.y);
      
      // Draw outer glow
      if (node.glow || node.active) {
        p5.noStroke();
        let glowSize = nodeSize * (node.active ? 3 : 2);
        let glowOpacity = node.active ? 50 : 20;
        
        // Multiple layers of glow for depth
        for (let i = 0; i < 3; i++) {
          p5.fill(...node.color, glowOpacity * (3-i)/3);
          p5.ellipse(0, 0, glowSize * (3-i)/2);
        }
      }
      
      // Draw node body
      p5.noStroke();
      p5.fill(...node.color, node.active ? 200 : 150);
      p5.ellipse(0, 0, nodeSize);
      
      // Draw node core
      p5.fill(255, node.active ? 255 : 180);
      p5.ellipse(0, 0, nodeSize * 0.4);
      
      p5.pop();
      
      // Add subtle particle trail
      if (p5.random() > 0.7 && (Math.abs(node.vx) > 0.3 || Math.abs(node.vy) > 0.3)) {
        p5.fill(node.color[0], node.color[1], node.color[2], 40);
        p5.noStroke();
        p5.ellipse(node.x - node.vx * 2, node.y - node.vy * 2, node.size * 0.7);
      }
    }
  };

  const mousePressed = (p5) => {
    // Check if clicked on existing node
    for (let node of nodes) {
      let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
      if (d < node.size * 2) {
        // Add ripple effect
        clickedNodes.current.push({
          x: node.x,
          y: node.y,
          color: [...node.color],
          lifespan: 100 // Controls how long the effect lasts
        });
        
        draggingNode.current = node;
        
        // Make the node momentarily active but don't let it stay
        node.active = true;
        node.glow = true;
        
        // Schedule deactivation
        setTimeout(() => {
          if (nodes.includes(node)) { // Check if node still exists
            node.active = false;
            node.glow = false;
          }
        }, 800);
        
        return;
      }
    }

    // Create new node with fade effect
    const newNodeColor = [
      theme.highlight[0] + p5.random(-30, 30),
      theme.highlight[1] + p5.random(-30, 30),
      theme.highlight[2] + p5.random(-30, 30)
    ];
    
    // Add click ripple effect
    clickedNodes.current.push({
      x: p5.mouseX,
      y: p5.mouseY,
      color: newNodeColor,
      lifespan: 100
    });
    
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        x: p5.mouseX,
        y: p5.mouseY,
        vx: p5.random(-0.8, 0.8),
        vy: p5.random(-0.8, 0.8),
        size: p5.random(4, 8),
        active: true,
        glow: true,
        pulsePhase: p5.random(0, p5.TWO_PI),
        color: newNodeColor,
        fadeTimer: 100, // Will be used to gradually reduce active state
      },
    ]);
    
    // Schedule deactivation for the new node
    const newNodeIndex = nodes.length;
    setTimeout(() => {
      setNodes(prevNodes => {
        if (prevNodes[newNodeIndex]) {
          const updatedNodes = [...prevNodes];
          updatedNodes[newNodeIndex] = {
            ...updatedNodes[newNodeIndex],
            active: false,
            glow: false
          };
          return updatedNodes;
        }
        return prevNodes;
      });
    }, 800);
  };

  const mouseDragged = (p5) => {
    if (draggingNode.current) {
      draggingNode.current.x = p5.mouseX;
      draggingNode.current.y = p5.mouseY;
      // Reset velocity when dragging
      draggingNode.current.vx = 0;
      draggingNode.current.vy = 0;
    }
  };

  const mouseReleased = (p5) => {
    if (draggingNode.current) {
      // Add a ripple effect when releasing a node
      clickedNodes.current.push({
        x: draggingNode.current.x,
        y: draggingNode.current.y,
        color: [...draggingNode.current.color],
        lifespan: 80
      });
      
      // Give the node a slight velocity in the direction it was dragged
      draggingNode.current.vx = p5.random(-0.5, 0.5);
      draggingNode.current.vy = p5.random(-0.5, 0.5);
      draggingNode.current = null;
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: -1 }}>
      {dimensions.width > 0 && (
        <Sketch
          setup={setup}
          draw={draw}
          mousePressed={mousePressed}
          mouseDragged={mouseDragged}
          mouseReleased={mouseReleased}
        />
      )}
    </div>
  );
};

export default NeuralNetwork;
