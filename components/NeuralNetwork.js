"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const NeuralNetwork = () => {
  const [nodes, setNodes] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState([]);
  const numNodes = 20;
  const maxDistance = 150;
  const draggingNode = useRef(null);
  const canvasRef = useRef(null);
  const maxSize = 20;
  const growthIncrement = 1.5;
  
  // Darker colors for better visibility
  const theme = {
    bg: [23, 0, 58],
    bgTo: [52, 0, 110],
    node: [150, 40, 220], // Darker purple for better visibility
    connection: [120, 60, 200],
    explosion: [255, 180, 255],
    mergeEffect: [200, 120, 255],
  };

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
    p5.createCanvas(dimensions.width, dimensions.height).parent(canvasParentRef);
    
    let newNodes = [];
    for (let i = 0; i < numNodes; i++) {
      let sizeCategory = p5.random(100);
      let nodeSize;
      
      if (sizeCategory < 60) {
        nodeSize = p5.random(4, 7);
      } else if (sizeCategory < 85) {
        nodeSize = p5.random(8, 12);
      } else {
        nodeSize = p5.random(13, 18);
      }
      
      newNodes.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-0.5, 0.5),
        vy: p5.random(-0.5, 0.5),
        size: nodeSize,
        active: false,
        color: [theme.node[0], theme.node[1], theme.node[2]],
        opacity: p5.random(180, 230), // Add variable opacity for better depth
        pulseEffect: 0,
        merging: false,
        mergeTimer: 0,
      });
    }
    setNodes(newNodes);
  };

  const draw = (p5) => {
    const bgGradient = p5.drawingContext;
    const gradient = bgGradient.createLinearGradient(0, 0, p5.width, p5.height);
    gradient.addColorStop(0, `rgba(${theme.bg[0]}, ${theme.bg[1]}, ${theme.bg[2]}, 0.95)`);
    gradient.addColorStop(1, `rgba(${theme.bgTo[0]}, ${theme.bgTo[1]}, ${theme.bgTo[2]}, 0.95)`);
    bgGradient.fillStyle = gradient;
    bgGradient.fillRect(0, 0, p5.width, p5.height);
    
    p5.noFill();

    // Check for collisions and merge nodes
    const nodesToMerge = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        // Skip nodes already scheduled for merging
        if (nodeA.merging || nodeB.merging) continue;
        
        // Calculate distance between nodes
        const distance = p5.dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
        
        const sizeRatio = Math.max(nodeA.size, nodeB.size) / Math.min(nodeA.size, nodeB.size);
        // Increase collision threshold for nodes with different sizes
        const adjustedThreshold = (nodeA.size + nodeB.size) * (0.45 + Math.min(0.2, (sizeRatio - 1) * 0.1));
        
        // Check if nodes are colliding
        if (distance < adjustedThreshold) {
          // Higher merge chance for bigger size disparity
          const mergeChance = 0.03 + Math.min(0.05, (sizeRatio - 1) * 0.01);
          
          if (p5.random() < mergeChance) {
            nodesToMerge.push({ nodeA, nodeB });
            nodeA.merging = true;
            nodeB.merging = true;
          }
        }
      }
    }
    
    // Handle node merges
    nodesToMerge.forEach(({ nodeA, nodeB }) => {
      mergeNodes(nodeA, nodeB, p5);
    });

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (draggingNode.current !== node) {
          node.x += node.vx;
          node.y += node.vy;
        }

        if (node.x < 0 || node.x > p5.width) {
          node.vx *= -1;
          node.x = p5.constrain(node.x, 0, p5.width);
        }
        if (node.y < 0 || node.y > p5.height) {
          node.vy *= -1;
          node.y = p5.constrain(node.y, 0, p5.height);
        }

        let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
        node.active = d < 50;
        
        if (node.pulseEffect > 0) {
          node.pulseEffect -= 0.05;
        }

        // Update merge animation
        if (node.mergeTimer > 0) {
          node.mergeTimer -= 1;
        }

        return node;
      })
    );
    
    p5.stroke(theme.connection[0], theme.connection[1], theme.connection[2]);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let d = p5.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        if (d < maxDistance) {
          let alpha = p5.map(d, 0, maxDistance, 200, 30);
          p5.stroke(theme.connection[0], theme.connection[1], theme.connection[2], alpha);
          p5.strokeWeight(0.5);
          p5.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
      }
    }

    setParticles(prevParticles => 
      prevParticles
        .filter(p => p.life > 0)
        .map(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.size *= 0.96;
          p.life -= 2;
          return p;
        })
    );

    for (let p of particles) {
      p5.fill(theme.explosion[0], theme.explosion[1], theme.explosion[2], p.life);
      p5.noStroke();
      p5.ellipse(p.x, p.y, p.size);
    }

    // Draw nodes
    for (let node of nodes) {
      p5.noStroke();
      
      let pulseSize = node.pulseEffect > 0 ? node.pulseEffect * 3 : 0;
      let nodeSize = node.active ? node.size * 1.5 : node.size;
      let displaySize = nodeSize + pulseSize;
      
      // Merge animation effect
      if (node.mergeTimer > 0) {
        const mergeProgress = node.mergeTimer / 30; // Normalize to 0-1
        p5.fill(theme.mergeEffect[0], theme.mergeEffect[1], theme.mergeEffect[2], 60 * mergeProgress);
        p5.ellipse(node.x, node.y, displaySize * (2.5 - mergeProgress));
        
        // Additional merge ring
        p5.stroke(theme.mergeEffect[0], theme.mergeEffect[1], theme.mergeEffect[2], 100 * mergeProgress);
        p5.strokeWeight(1.5);
        p5.noFill();
        p5.ellipse(node.x, node.y, displaySize * (2 - mergeProgress * 0.5));
        p5.noStroke();
      }
      
      if (node.pulseEffect > 0) {
        p5.fill(node.color[0], node.color[1], node.color[2], 40 * node.pulseEffect);
        p5.ellipse(node.x, node.y, displaySize * 2);
        
        p5.fill(node.color[0], node.color[1], node.color[2], 80 * node.pulseEffect);
        p5.ellipse(node.x, node.y, displaySize * 1.5);
      }
      
      // Node body with enhanced visibility
      p5.fill(node.color[0], node.color[1], node.color[2], node.opacity || 200);
      p5.ellipse(node.x, node.y, displaySize);
      
      // Add node border for better definition
      p5.stroke(node.color[0] + 40, node.color[1] + 30, node.color[2] + 30, node.opacity || 220);
      p5.strokeWeight(1);
      p5.noFill();
      p5.ellipse(node.x, node.y, displaySize + 1.5);
      p5.noStroke();
      
      // Node center (brighter)
      p5.fill(255, node.active ? 255 : 210);
      p5.ellipse(node.x, node.y, displaySize * 0.4);
      
      if (node.size > maxSize * 0.6) {
        let progress = (node.size / maxSize) * 100;
        p5.noFill();
        p5.stroke(255, 255, 255, 170);
        p5.strokeWeight(1.5);
        p5.arc(node.x, node.y, displaySize * 1.3, displaySize * 1.3, 0, (progress/100) * p5.TWO_PI);
      }
    }
  };

  // Function to merge two nodes
  const mergeNodes = (nodeA, nodeB, p5) => {
    // Calculate merged node properties
    const totalMass = nodeA.size * nodeA.size + nodeB.size * nodeB.size;
    
    // More consistent merging - use square root of total area (mass)
    const newSize = Math.min(Math.sqrt(totalMass), maxSize * 0.95);
    
    // Weighted position based on node sizes (squared for area/mass)
    const weightA = (nodeA.size * nodeA.size) / totalMass;
    const weightB = (nodeB.size * nodeB.size) / totalMass;
    
    const newX = nodeA.x * weightA + nodeB.x * weightB;
    const newY = nodeA.y * weightA + nodeB.y * weightB;
    
    // Calculate momentum-preserving velocity
    // Smaller nodes should have less impact on the final velocity
    const newVX = (nodeA.vx * weightA + nodeB.vx * weightB) * 0.9;
    const newVY = (nodeA.vy * weightA + nodeB.vy * weightB) * 0.9;
    
    // Create merge effects
    createMergeEffects(nodeA, nodeB, p5);
    
    // Create the new node from the merger
    const mergedNode = {
      x: newX,
      y: newY,
      vx: newVX,
      vy: newVY,
      size: newSize,
      active: true,
      color: [theme.node[0], theme.node[1], theme.node[2]],
      opacity: Math.max(nodeA.opacity || 200, nodeB.opacity || 200),
      pulseEffect: 2,
      merging: false,
      mergeTimer: 30, // Frames of merge animation
    };
    
    // Update the nodes array
    setNodes(prevNodes => {
      const filteredNodes = prevNodes.filter(n => n !== nodeA && n !== nodeB);
      return [...filteredNodes, mergedNode];
    });
  };
  
  // Create visual effects for node merging
  const createMergeEffects = (nodeA, nodeB, p5) => {
    // Calculate distance between nodes
    const distance = p5.dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
    
    // Calculate a weighted midpoint that's closer to the larger node
    const totalSize = nodeA.size + nodeB.size;
    const weightA = nodeA.size / totalSize;
    const weightB = nodeB.size / totalSize;
    
    const midX = nodeA.x * weightA + nodeB.x * weightB;
    const midY = nodeA.y * weightA + nodeB.y * weightB;
    
    // Create more particles for larger nodes
    const numParticles = Math.floor((nodeA.size + nodeB.size) * 0.7);
    const newParticles = [];
    
    // Calculate particle distribution radius based on the larger node
    const effectRadius = Math.max(nodeA.size, nodeB.size) * 0.7 + distance * 0.3;
    
    for (let i = 0; i < numParticles; i++) {
      const angle = p5.random(0, p5.TWO_PI);
      // Create particles in a pattern that covers both nodes
      const particleDistance = p5.random(effectRadius);
      const x = midX + Math.cos(angle) * particleDistance;
      const y = midY + Math.sin(angle) * particleDistance;
      
      newParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * p5.random(0.5, 2),
        vy: Math.sin(angle) * p5.random(0.5, 2),
        size: p5.random(1, 3),
        life: p5.random(70, 150),
        color: [
          p5.random(theme.mergeEffect[0] - 30, theme.mergeEffect[0]),
          p5.random(theme.mergeEffect[1] - 30, theme.mergeEffect[1]),
          p5.random(theme.mergeEffect[2] - 30, theme.mergeEffect[2])
        ]
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const mousePressed = (p5) => {
    let clickedOnNode = false;
    
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      let d = p5.dist(p5.mouseX, p5.mouseY, node.x, node.y);
      
      if (d < node.size * 2) {
        clickedOnNode = true;
        
        if (p5.mouseButton === p5.RIGHT) {
          explodeNode(node, p5);
          return;
        }
        
        if (p5.mouseButton === p5.LEFT) {
          draggingNode.current = node;
          
          node._justClicked = true;
          
          const updatedNodes = [...nodes];
          updatedNodes[i] = node;
          setNodes(updatedNodes);
          
          setTimeout(() => {
            if (node._justClicked) {
              growNode(node, p5);
              node._justClicked = false;
            }
          }, 150);
          return;
        }
      }
    }

    if (!clickedOnNode) {
      let sizeCategory = p5.random(100);
      let nodeSize;
      
      if (sizeCategory < 60) {
        nodeSize = p5.random(4, 7);
      } else if (sizeCategory < 85) {
        nodeSize = p5.random(8, 12);
      } else {
        nodeSize = p5.random(13, 18);
      }
      
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          x: p5.mouseX,
          y: p5.mouseY,
          vx: p5.random(-0.5, 0.5),
          vy: p5.random(-0.5, 0.5),
          size: nodeSize,
          active: true,
          color: [theme.node[0], theme.node[1], theme.node[2]],
          opacity: p5.random(180, 230),
          pulseEffect: 2,
          merging: false,
          mergeTimer: 0
        },
      ]);
    }
  };

  const growNode = (node, p5) => {
    setNodes(prevNodes => 
      prevNodes.map(n => {
        if (n === node) {
          n.pulseEffect = 2;
          
          const newSize = n.size + growthIncrement;
          
          if (newSize >= maxSize) {
            explodeNode(n, p5);
            return {
              ...n,
              size: p5.random(5, 8),
            };
          }
          
          return {
            ...n,
            size: newSize,
          };
        }
        return n;
      })
    );
  };

  const explodeNode = (node, p5) => {
    const numParticles = Math.floor(node.size * 3);
    const newParticles = [];
    
    for (let i = 0; i < numParticles; i++) {
      const angle = p5.random(0, p5.TWO_PI);
      const speed = p5.random(1, 5);
      newParticles.push({
        x: node.x,
        y: node.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: p5.random(1, 3),
        life: p5.random(100, 200),
        color: [
          p5.random(theme.explosion[0] - 20, theme.explosion[0]),
          p5.random(theme.explosion[1] - 20, theme.explosion[1]),
          p5.random(theme.explosion[2] - 20, theme.explosion[2])
        ]
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    const numChildNodes = Math.min(Math.floor(node.size / 3), 5);
    const childNodes = [];
    
    for (let i = 0; i < numChildNodes; i++) {
      const angle = p5.random(0, p5.TWO_PI);
      const distance = p5.random(10, 30);
      
      let childSizeCategory = p5.random(100);
      let childSize;
      
      if (childSizeCategory < 70) {
        childSize = p5.random(3, 6);
      } else {
        childSize = p5.random(6, 9);
      }
      
      childNodes.push({
        x: node.x + Math.cos(angle) * distance,
        y: node.y + Math.sin(angle) * distance,
        vx: Math.cos(angle) * p5.random(0.5, 1.5),
        vy: Math.sin(angle) * p5.random(0.5, 1.5),
        size: childSize,
        active: true,
        color: [theme.node[0], theme.node[1], theme.node[2]],
        opacity: p5.random(180, 230), // Varying opacity
        pulseEffect: 1.5,
        mergeTimer: 0,
      });
    }
    
    setNodes(prevNodes => {
      const filteredNodes = prevNodes.filter(n => n !== node);
      return [...filteredNodes, ...childNodes];
    });
  };

  const mouseDragged = (p5) => {
    if (draggingNode.current) {
      if (draggingNode.current._justClicked) {
        draggingNode.current._justClicked = false;
      }
      
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node === draggingNode.current) {
            return {
              ...node,
              x: p5.mouseX,
              y: p5.mouseY,
              vx: 0,
              vy: 0
            };
          }
          return node;
        })
      );
    }
  };

  const mouseReleased = (p5) => {
    if (draggingNode.current) {
      const mouseSpeed = p5.createVector(p5.movedX, p5.movedY).mag();
      
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node === draggingNode.current) {
            let newVx, newVy;
            
            if (mouseSpeed > 5) {
              newVx = p5.movedX * 0.05;
              newVy = p5.movedY * 0.05;
            } else {
              newVx = Math.random() * 0.8 - 0.4;
              newVy = Math.random() * 0.8 - 0.4;
            }
            
            return {
              ...node,
              vx: newVx,
              vy: newVy
            };
          }
          return node;
        })
      );
      
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