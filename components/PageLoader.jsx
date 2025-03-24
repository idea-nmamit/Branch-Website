"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Matter from 'matter-js';

const aiDataQuotes = [
  "Where data flows, intelligence grows.",
  "In the dance of algorithms, insights emerge.",
  "The future is written in code, shaped by data.",
  "Neural networks: mimicking minds, surpassing limits.",
  "From data points to decision points.",
  "AI doesn't replace human intelligence; it amplifies it.",
  "Data is the new oil, AI is the new electricity.",
  "Behind every great model is a mountain of clean data.",
  "Machine learning: teaching computers to see patterns humans miss.",
  "Data science turns information into transformation."
];

const PageLoader = ({ children, finishLoading }) => {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

  // Initialize Matter.js scene
  useEffect(() => {
    if (!sceneRef.current) return;

    try {
      // Module aliases
      const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Body = Matter.Body,
            Vector = Matter.Vector,
            Constraint = Matter.Constraint;

      // Create engine
      const engine = Engine.create();
      engineRef.current = engine;

      // Create renderer
      const render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false,
          background: 'transparent',
          pixelRatio: Math.min(window.devicePixelRatio, 2) // Limit pixel ratio for performance
        }
      });
      renderRef.current = render;

      // Create runner
      const runner = Runner.create();

      // Create walls
      const wallOptions = {
        isStatic: true,
        render: {
          visible: false
        }
      };

      const wallThickness = 50;
      Composite.add(engine.world, [
        // Bottom wall
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, wallOptions),
        // Left wall
        Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, wallOptions),
        // Right wall
        Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, wallOptions),
        // Top wall
        Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, wallOptions)
      ]);

      // Enhanced color palette with glowing effect
      const colors = [
        '#8617C0', // Purple from site
        '#6e11a0', // Darker purple from site
        '#6366F1', // Indigo
        '#3B82F6', // Blue
        '#EC4899', // Pink
        '#F472B6', // Lighter pink
      ];

      // Connection lines between nodes
      const connections = [];
      
      // Create nodes and connection lines to simulate neural network
      const createNetworkNode = (x, y) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        const size = 12 + Math.random() * 18;
        const shapeType = Math.random();
        
        let shape;
        const commonOptions = {
          restitution: 0.7,
          friction: 0.002,
          frictionAir: 0.01, // Add air friction for more controlled movement
          render: {
            fillStyle: colors[colorIndex],
            opacity: 0.75 + Math.random() * 0.25,
            // Add glow effect
            shadowColor: colors[colorIndex],
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        };

        if (shapeType < 0.4) {
          // Circle (neurons)
          shape = Bodies.circle(x, y, size / 2, commonOptions);
        } else if (shapeType < 0.7) {
          // Rectangle (data points)
          shape = Bodies.rectangle(x, y, size, size * 0.8, commonOptions);
        } else {
          // Hexagon (nodes)
          shape = Bodies.polygon(x, y, 6, size / 2, commonOptions);
        }

        // Add initial velocity but don't let it glide as much
        Body.setVelocity(shape, {
          x: (Math.random() - 0.5) * 1.2,
          y: (Math.random() - 0.5) * 1.2
        });
        
        // Reduce angular velocity
        Body.setAngularVelocity(shape, (Math.random() - 0.5) * 0.03);
        
        return shape;
      };

      // Create initial particles
      const particles = [];
      for (let i = 0; i < 35; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particles.push(createNetworkNode(x, y));
      }
      Composite.add(engine.world, particles);

      // Create dynamic connections between nearby particles
      const createConnections = () => {
        // Remove old connections
        connections.forEach(connection => {
          Composite.remove(engine.world, connection);
        });
        connections.length = 0;

        // Create new connections between particles that are close to each other
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const particleA = particles[i];
            const particleB = particles[j];
            
            const distance = Vector.magnitude(
              Vector.sub(particleA.position, particleB.position)
            );
            
            if (distance < 150) { // Only connect if within range
              const opacity = 1 - (distance / 150); // Fade with distance
              
              // Create a visual line constraint
              const constraint = Constraint.create({
                bodyA: particleA,
                bodyB: particleB,
                stiffness: 0.001,
                damping: 0.1,
                render: {
                  type: 'line',
                  strokeStyle: `rgba(138, 43, 226, ${opacity * 0.7})`,
                  lineWidth: 1,
                  anchors: false
                }
              });
              
              connections.push(constraint);
              Composite.add(engine.world, constraint);
            }
          }
        }
      };

      // Periodically update connections
      const connectionInterval = setInterval(createConnections, 1000);

      // Add mouse interaction with improved glow effect
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: true,
            strokeStyle: 'rgba(255, 255, 255, 0.2)',
            lineWidth: 1
          }
        }
      });
      Composite.add(engine.world, mouseConstraint);

      // Add magnetic effect to mouse
      Matter.Events.on(engine, 'beforeUpdate', () => {
        if (mouse.position.x && mouse.position.y) {
          particles.forEach(particle => {
            const mousePos = mouse.position;
            const distanceToMouse = Vector.magnitude(
              Vector.sub(particle.position, mousePos)
            );
            
            if (distanceToMouse < 200) {
              const force = Vector.mult(
                Vector.normalise(
                  Vector.sub(mousePos, particle.position)
                ),
                0.2 * (1 - distanceToMouse / 200)
              );
              Body.applyForce(particle, particle.position, force);
            }
          });
        }
      });

      // Create particle trail effect
      Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
        if (Math.random() < 0.1) { // Only spawn occasionally for performance
          const newParticle = Bodies.circle(
            mouse.position.x, 
            mouse.position.y, 
            2 + Math.random() * 5,
            {
              frictionAir: 0.05,
              render: {
                fillStyle: colors[Math.floor(Math.random() * colors.length)],
                opacity: 0.7,
                shadowColor: '#EC4899',
                shadowBlur: 10
              }
            }
          );
          
          Body.setVelocity(newParticle, {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          });
          
          Composite.add(engine.world, newParticle);
          
          // Remove the particle after a short time
          setTimeout(() => {
            Composite.remove(engine.world, newParticle);
          }, 1000);
        }
      });

      // Keep the mouse in sync with rendering
      render.mouse = mouse;

      // Run the engine
      Runner.run(runner, engine);
      Render.run(render);

      // Periodically add new elements but with more control for aesthetics
      const addNewParticles = setInterval(() => {
        if (!loading) return;
        
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (edge) {
          case 0: // top
            x = Math.random() * window.innerWidth;
            y = -30;
            break;
          case 1: // right
            x = window.innerWidth + 30;
            y = Math.random() * window.innerHeight;
            break;
          case 2: // bottom
            x = Math.random() * window.innerWidth;
            y = window.innerHeight + 30;
            break;
          case 3: // left
            x = -30;
            y = Math.random() * window.innerHeight;
            break;
        }
        
        const newParticle = createNetworkNode(x, y);
        Composite.add(engine.world, newParticle);
        particles.push(newParticle);
        
        // Remove a particle if there are too many
        if (particles.length > 45) {
          const particleToRemove = particles.shift();
          Composite.remove(engine.world, particleToRemove);
        }
      }, 800);

      // Clean up
      return () => {
        clearInterval(addNewParticles);
        clearInterval(connectionInterval);
        
        // Clear all particles to prevent memory leaks
        particles.forEach(particle => {
          Composite.remove(engine.world, particle);
        });
        
        connections.forEach(connection => {
          Composite.remove(engine.world, connection);
        });
        
        // Properly stop and clean up Matter.js
        Render.stop(render);
        Runner.stop(runner);
        Engine.clear(engine);
        
        // Remove the canvas
        if (render.canvas && render.canvas.parentNode) {
          render.canvas.parentNode.removeChild(render.canvas);
        }
        
        // Clean texture references
        if (render.textures) {
          Object.keys(render.textures).forEach(key => {
            delete render.textures[key];
          });
        }
      };
    } catch (error) {
      console.error("Error initializing Matter.js:", error);
      // Fallback to complete loading without Matter.js
      setTimeout(() => {
        setProgress(100);
        setLoading(false);
        if (finishLoading) finishLoading();
      }, 1000);
    }
  }, [loading, finishLoading]);

  // Handle quotes and progress bar
  useEffect(() => {
    // Select initial quote
    const initialQuote = aiDataQuotes[Math.floor(Math.random() * aiDataQuotes.length)];
    setQuote(initialQuote);
    
    // Quote rotation
    const quoteRotation = setInterval(() => {
      setQuoteIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % aiDataQuotes.length;
        setQuote(aiDataQuotes[newIndex]);
        return newIndex;
      });
    }, 3000);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (Math.random() * 4) + 1;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);

    // Finish loading
    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        if (finishLoading) finishLoading();
      }, 800);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearInterval(quoteRotation);
      clearTimeout(timer);
    };
  }, [finishLoading]);

  // Handle window resize with improved debounce
  useEffect(() => {
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (renderRef.current) {
          renderRef.current.options.width = window.innerWidth;
          renderRef.current.options.height = window.innerHeight;
          renderRef.current.canvas.width = window.innerWidth;
          renderRef.current.canvas.height = window.innerHeight;
          
          // Also update boundaries if the engine exists
          if (engineRef.current && engineRef.current.world.bodies) {
            const bodies = engineRef.current.world.bodies;
            const wallThickness = 50;
            
            // Find and update walls
            bodies.forEach(body => {
              if (body.isStatic && body.render.visible === false) {
                Composite.remove(engineRef.current.world, body);
              }
            });
            
            // Re-add walls with new dimensions
            Composite.add(engineRef.current.world, [
              // Bottom wall
              Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, {
                isStatic: true,
                render: { visible: false }
              }),
              // Left wall
              Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, {
                isStatic: true,
                render: { visible: false }
              }),
              // Right wall
              Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, {
                isStatic: true,
                render: { visible: false }
              }),
              // Top wall
              Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, {
                isStatic: true,
                render: { visible: false }
              })
            ]);
          }
        }
      }, 250); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.5, 
                ease: "easeInOut",
                when: "afterChildren" 
              }
            }}
            transition={{ 
              duration: 0.7, 
              ease: "easeInOut" 
            }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            {/* Enhanced background with animated gradient */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#17003A] to-[#34006e]"
              animate={{
                background: [
                  'linear-gradient(to bottom right, #17003A, #34006e)',
                  'linear-gradient(to bottom right, #1c0048, #3a0082)',
                  'linear-gradient(to bottom right, #17003A, #34006e)'
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            
            {/* Particle background effect */}
            <div className="absolute inset-0 opacity-20">
              {/* Dynamic star field effect instead of grid */}
              {Array.from({ length: 80 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%'
                  }}
                  animate={{
                    opacity: [0.1, 0.8, 0.1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            
            {/* Matter.js canvas with error fallback */}
            <div ref={sceneRef} className="absolute inset-0 z-10">
              {/* Fallback content if Matter.js fails to load */}
            </div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
              {/* Logo animation with enhanced glow effect */}
              <motion.div 
                className="relative w-52 h-20 sm:w-64 sm:h-24 md:w-96 md:h-40 mb-8"
                animate={{ 
                  scale: [1, 1.05, 1],
                  filter: [
                    'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))',
                    'drop-shadow(0 0 15px rgba(236, 72, 153, 0.5))',
                    'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/Logo-Light.png"
                  alt="IDEA"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              
              {/* Quote animation with subtle floating effect */}
              <div className="w-full max-w-xl px-4 mb-8 h-24 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quote}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      textShadow: ['0 0 8px rgba(138, 43, 226, 0.5)', '0 0 15px rgba(138, 43, 226, 0.7)', '0 0 8px rgba(138, 43, 226, 0.5)']
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.5,
                      textShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="text-white text-xl md:text-2xl text-center font-light italic px-4"
                  >
                    "{quote}"
                  </motion.p>
                </AnimatePresence>
              </div>
              
              {/* Enhanced progress bar with animated gradient */}
              <div className="w-full max-w-md px-8 mb-2">
                <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #8617C0, #EC4899, #8617C0)',
                      backgroundSize: '200% 100%'
                    }}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${progress}%`,
                      backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                    }}
                    transition={{ 
                      width: { ease: "easeOut" },
                      backgroundPosition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default PageLoader;