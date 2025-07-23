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

// Generate static star field outside the component for SSR/CSR match
const staticStars = Array.from({ length: 80 }).map((_, i) => ({
  left: Math.random() * 100 + '%',
  top: Math.random() * 100 + '%',
  width: Math.random() * 2 + 1 + 'px',
  height: Math.random() * 2 + 1 + 'px',
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
}));

const PageLoader = ({ children, finishLoading }) => {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const particlesRef = useRef([]);
  const connectionsRef = useRef([]);
  const intervalsRef = useRef([]);

  // Initialize Matter.js scene
  useEffect(() => {
    if (!sceneRef.current || !loading) return;

    let cleanup = null;

    const initializeMatterJS = async () => {
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
        engine.world.gravity.y = 0.8;
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
            pixelRatio: Math.min(window.devicePixelRatio, 2)
          }
        });
        renderRef.current = render;

        // Create runner
        const runner = Runner.create();

        // Create walls function
        const createWalls = () => {
          const wallOptions = {
            isStatic: true,
            render: { visible: false }
          };

          const wallThickness = 50;
          return [
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, wallOptions),
            Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, wallOptions),
            Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, wallOptions),
            Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, wallOptions)
          ];
        };

        // Add initial walls
        Composite.add(engine.world, createWalls());

        // Enhanced color palette
        const colors = [
          '#8617C0',
          '#6e11a0',
          '#6366F1',
          '#3B82F6',
          '#EC4899',
          '#F472B6',
        ];

        // Create network node function
        const createNetworkNode = (x, y) => {
          const colorIndex = Math.floor(Math.random() * colors.length);
          const size = 12 + Math.random() * 18;
          const shapeType = Math.random();
          
          let shape;
          const commonOptions = {
            restitution: 0.7,
            friction: 0.002,
            frictionAir: 0.01,
            render: {
              fillStyle: colors[colorIndex],
              opacity: 0.75 + Math.random() * 0.25,
              shadowColor: colors[colorIndex],
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowOffsetY: 0
            }
          };

          if (shapeType < 0.4) {
            shape = Bodies.circle(x, y, size / 2, commonOptions);
          } else if (shapeType < 0.7) {
            shape = Bodies.rectangle(x, y, size, size * 0.8, commonOptions);
          } else {
            shape = Bodies.polygon(x, y, 6, size / 2, commonOptions);
          }

          Body.setVelocity(shape, {
            x: (Math.random() - 0.5) * 1.2,
            y: (Math.random() - 0.5) * 1.2
          });
          
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
        particlesRef.current = particles;

        // Create connections function
        const createConnections = () => {
          if (!loading) return;
          
          // Remove old connections
          connectionsRef.current.forEach(connection => {
            Composite.remove(engine.world, connection);
          });
          connectionsRef.current = [];

          // Create new connections
          const currentParticles = particlesRef.current;
          for (let i = 0; i < currentParticles.length; i++) {
            for (let j = i + 1; j < currentParticles.length; j++) {
              const particleA = currentParticles[i];
              const particleB = currentParticles[j];
              
              if (!particleA.position || !particleB.position) continue;
              
              const distance = Vector.magnitude(
                Vector.sub(particleA.position, particleB.position)
              );
              
              if (distance < 150) {
                const opacity = 1 - (distance / 150);
                
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
                
                connectionsRef.current.push(constraint);
                Composite.add(engine.world, constraint);
              }
            }
          }
        };

        // Setup connection updates
        const connectionInterval = setInterval(createConnections, 1000);
        intervalsRef.current.push(connectionInterval);

        // Add mouse interaction
        const mouse = Mouse.create(render.canvas);
        
        // Disable right-click context menu on canvas
        render.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.1,
            render: {
              visible: false
            }
          }
        });
        Composite.add(engine.world, mouseConstraint);

        // Mouse magnetic effect with improved handling
        let lastMousePosition = { x: 0, y: 0 };
        let isMouseMoving = false;
        let mouseMoveTimeout;
        
        // Track mouse movement
        const handleMouseMove = () => {
          isMouseMoving = true;
          clearTimeout(mouseMoveTimeout);
          mouseMoveTimeout = setTimeout(() => {
            isMouseMoving = false;
          }, 100);
        };
        
        render.canvas.addEventListener('mousemove', handleMouseMove);
        
        Matter.Events.on(engine, 'beforeUpdate', () => {
          if (!loading || !mouse.position.x || !mouse.position.y || !isMouseMoving) return;
          
          // Only apply magnetic effect if mouse has moved significantly
          const mouseMoved = Math.abs(mouse.position.x - lastMousePosition.x) > 3 || 
                           Math.abs(mouse.position.y - lastMousePosition.y) > 3;
          
          if (mouseMoved) {
            lastMousePosition = { x: mouse.position.x, y: mouse.position.y };
            
            particlesRef.current.forEach(particle => {
              if (!particle.position) return;
              
              const mousePos = mouse.position;
              const distanceToMouse = Vector.magnitude(
                Vector.sub(particle.position, mousePos)
              );
              
              if (distanceToMouse < 120 && distanceToMouse > 15) {
                const attractionStrength = 0.0005;
                const force = Vector.mult(
                  Vector.normalise(
                    Vector.sub(mousePos, particle.position)
                  ),
                  attractionStrength * (1 - distanceToMouse / 120)
                );
                Body.applyForce(particle, particle.position, force);
              }
            });
          }
        });

        // Keep mouse in sync
        render.mouse = mouse;

        // Add subtle mouse trail effect
        let trailParticles = [];
        const maxTrailParticles = 3;
        
        Matter.Events.on(mouseConstraint, 'startdrag', () => {
          // Clear existing trail when dragging starts
          trailParticles.forEach(p => {
            if (engine.world.bodies.includes(p)) {
              Composite.remove(engine.world, p);
            }
          });
          trailParticles = [];
        });

        // Optional: Add gentle mouse trail (uncomment if desired)
        /*
        let lastTrailTime = 0;
        Matter.Events.on(engine, 'beforeUpdate', () => {
          if (!loading || !mouse.position.x || !mouse.position.y) return;
          
          const currentTime = Date.now();
          if (currentTime - lastTrailTime > 200 && Math.random() < 0.3) {
            lastTrailTime = currentTime;
            
            const trailParticle = Bodies.circle(
              mouse.position.x + (Math.random() - 0.5) * 10, 
              mouse.position.y + (Math.random() - 0.5) * 10, 
              2 + Math.random() * 3,
              {
                frictionAir: 0.08,
                render: {
                  fillStyle: colors[Math.floor(Math.random() * colors.length)],
                  opacity: 0.6
                }
              }
            );
            
            Body.setVelocity(trailParticle, {
              x: (Math.random() - 0.5) * 1,
              y: (Math.random() - 0.5) * 1
            });
            
            Composite.add(engine.world, trailParticle);
            trailParticles.push(trailParticle);
            
            // Remove trail particles if too many
            if (trailParticles.length > maxTrailParticles) {
              const oldParticle = trailParticles.shift();
              Composite.remove(engine.world, oldParticle);
            }
            
            // Auto-remove after 2 seconds
            setTimeout(() => {
              if (engine.world.bodies.includes(trailParticle)) {
                Composite.remove(engine.world, trailParticle);
                const index = trailParticles.indexOf(trailParticle);
                if (index > -1) trailParticles.splice(index, 1);
              }
            }, 2000);
          }
        });
        */

        // Run the engine
        Runner.run(runner, engine);
        Render.run(render);

        // Add new particles periodically
        const addParticlesInterval = setInterval(() => {
          if (!loading || particlesRef.current.length > 45) return;
          
          const edge = Math.floor(Math.random() * 4);
          let x, y;
          
          switch (edge) {
            case 0: x = Math.random() * window.innerWidth; y = -30; break;
            case 1: x = window.innerWidth + 30; y = Math.random() * window.innerHeight; break;
            case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 30; break;
            case 3: x = -30; y = Math.random() * window.innerHeight; break;
          }
          
          const newParticle = createNetworkNode(x, y);
          Composite.add(engine.world, newParticle);
          particlesRef.current.push(newParticle);
          
          // Remove oldest particle if too many
          if (particlesRef.current.length > 45) {
            const particleToRemove = particlesRef.current.shift();
            Composite.remove(engine.world, particleToRemove);
          }
        }, 800);
        intervalsRef.current.push(addParticlesInterval);

        // Setup cleanup function
        cleanup = () => {
          // Clear timeouts and intervals
          clearTimeout(mouseMoveTimeout);
          intervalsRef.current.forEach(interval => clearInterval(interval));
          intervalsRef.current = [];
          
          // Remove event listeners
          if (render.canvas) {
            render.canvas.removeEventListener('mousemove', handleMouseMove);
            render.canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
          }
          
          // Clear trail particles
          if (trailParticles) {
            trailParticles.forEach(particle => {
              if (engine.world.bodies.includes(particle)) {
                Composite.remove(engine.world, particle);
              }
            });
            trailParticles = [];
          }
          
          // Clear particles and connections
          particlesRef.current.forEach(particle => {
            Composite.remove(engine.world, particle);
          });
          particlesRef.current = [];
          
          connectionsRef.current.forEach(connection => {
            Composite.remove(engine.world, connection);
          });
          connectionsRef.current = [];
          
          // Stop Matter.js
          Render.stop(render);
          Runner.stop(runner);
          Engine.clear(engine);
          
          // Remove canvas
          if (render.canvas && render.canvas.parentNode) {
            render.canvas.parentNode.removeChild(render.canvas);
          }
          
          // Clean textures
          if (render.textures) {
            Object.keys(render.textures).forEach(key => {
              delete render.textures[key];
            });
          }
        };

      } catch (error) {
        console.error("Error initializing Matter.js:", error);
        // Fallback - just complete loading
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            setLoading(false);
            if (finishLoading) finishLoading();
          }, 300);
        }, 1000);
      }
    };

    initializeMatterJS();

    // Return cleanup function
    return cleanup;
  }, [loading, finishLoading]);

  // Handle quotes and progress bar
  useEffect(() => {
    if (!loading) return;

    // Select initial quote
    const initialQuote = aiDataQuotes[Math.floor(Math.random() * aiDataQuotes.length)];
    setQuote(initialQuote);
    
    // Quote rotation
    const quoteRotation = setInterval(() => {
      if (!loading) return;
      setQuoteIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % aiDataQuotes.length;
        setQuote(aiDataQuotes[newIndex]);
        return newIndex;
      });
    }, 3000);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.random() * 4 + 1;
        const newProgress = Math.min(prev + increment, 100);
        return newProgress;
      });
    }, 150);

    // Finish loading timer
    const finishTimer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        if (finishLoading) finishLoading();
      }, 800);
    }, 3500);

    return () => {
      clearInterval(quoteRotation);
      clearInterval(progressInterval);
      clearTimeout(finishTimer);
    };
  }, [loading, finishLoading]);

  // Handle window resize
  useEffect(() => {
    if (!loading) return;

    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (renderRef.current && engineRef.current) {
          // Update renderer dimensions
          renderRef.current.options.width = window.innerWidth;
          renderRef.current.options.height = window.innerHeight;
          renderRef.current.canvas.width = window.innerWidth;
          renderRef.current.canvas.height = window.innerHeight;
          
          // Remove existing walls and add new ones with correct dimensions
          const bodies = engineRef.current.world.bodies.filter(body => 
            body.isStatic && body.render.visible === false
          );
          
          bodies.forEach(wall => {
            Composite.remove(engineRef.current.world, wall);
          });
          
          // Create new walls with updated dimensions
          const wallThickness = 50;
          const wallOptions = {
            isStatic: true,
            render: { visible: false }
          };
          
          const newWalls = [
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, wallOptions),
            Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, wallOptions),
            Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight + wallThickness * 2, wallOptions),
            Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth + wallThickness * 2, wallThickness, wallOptions)
          ];
          
          Composite.add(engineRef.current.world, newWalls);
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      intervalsRef.current.forEach(interval => clearInterval(interval));
      intervalsRef.current = [];
      
      // Clear particles and connections
      if (particlesRef.current) {
        particlesRef.current = [];
      }
      if (connectionsRef.current) {
        connectionsRef.current = [];
      }
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
              {/* Static star field for SSR/CSR match */}
              {staticStars.map((star, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: star.width,
                    height: star.height,
                    left: star.left,
                    top: star.top
                  }}
                  animate={{
                    opacity: [0.1, 0.8, 0.1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: star.delay
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
                style={{ willChange: 'opacity, transform' }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.04, 1],
                }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ 
                  opacity: { duration: 2.8, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
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