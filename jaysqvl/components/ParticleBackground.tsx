'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

// Configurable constants - adjust these values to change particle behavior
const CURSOR_REPULSION_STRENGTH = 2.5; // Reasonable repulsion strength
const CURSOR_REPULSION_RADIUS_MULTIPLIER = 0.15; // Percentage of screen size for cursor influence
const PARTICLE_DENSITY = 0.00012; // Particles per pixel of screen area
const MIN_PARTICLES = 60; // Minimum number of particles
const MAX_PARTICLES = 300; // Maximum number of particles
const PARTICLE_RESPAWN_INTERVAL = 10000; // Check for missing particles every 10000ms
const MOMENTUM_RETENTION = 0.6; // How much momentum particles retain after being pushed (0-1)
const DAMPING_FACTOR = 0.98; // Slightly higher damping for more natural movement (was 0.97)
const PARTICLE_REPULSION_RADIUS = 100; // How close particles need to be to repel each other
const PARTICLE_REPULSION_STRENGTH = 0.02; // Strength of particle-to-particle repulsion

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  baseSpeedX: number;
  baseSpeedY: number;
  teleporting?: boolean;
  teleportProgress?: number;
  teleportDestination?: { x: number, y: number };
  offScreen?: boolean;
}

interface RepulsionZone {
  x: number;
  y: number;
  width: number;
  height: number;
  strength: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const repulsionZones = useRef<RepulsionZone[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef<number>(0);
  const isMouseActive = useRef<boolean>(false);
  const particleCountRef = useRef<number>(0);
  const respawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { theme, systemTheme } = useTheme();

  // Determine if dark mode is active
  const isDarkMode = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return currentTheme === 'dark';
  };

  // Get the appropriate RGB values based on theme
  const getThemeRgb = () => {
    return isDarkMode() ? '255, 255, 255' : '10, 10, 12'; // Lighter white in dark mode, darker black in light mode
  };

  // Get appropriate opacity range based on theme
  const getOpacityRange = () => {
    return isDarkMode() 
      ? { min: 0.5, max: 0.9 } // Dark mode opacity range (increased further)
      : { min: 0.6, max: 0.95 }; // Light mode opacity range (increased further)
  };

  // Get connection opacity multiplier based on theme
  const getConnectionOpacity = () => {
    return isDarkMode() ? 0.6 : 0.7; // Increased further for both modes
  };

  // Get particle size range based on theme
  const getParticleSizeRange = () => {
    return isDarkMode()
      ? { min: 1.5, max: 3.0 } // Slightly larger particles in dark mode
      : { min: 1.0, max: 2.5 }; // Original size in light mode
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full width/height
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateRepulsionZones();
      initParticles(); // Initialize particles after updating repulsion zones
    };

    // Track mouse position and activity
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isMouseActive.current = true;
    };
    
    // Set mouse as inactive when it leaves the window
    const handleMouseLeave = () => {
      isMouseActive.current = false;
    };

    // Check if a point is inside any repulsion zone
    const isInsideRepulsionZone = (x: number, y: number, padding = 0) => {
      for (const zone of repulsionZones.current) {
        if (
          x >= zone.x - padding && 
          x <= zone.x + zone.width + padding && 
          y >= zone.y - padding && 
          y <= zone.y + zone.height + padding
        ) {
          return true;
        }
      }
      return false;
    };

    // Find a valid teleport destination (not in a repulsion zone)
    const findTeleportDestination = () => {
      // Target the central area of the screen
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3; // 30% of smaller dimension
      
      let x, y;
      let attempts = 0;
      const maxAttempts = 20;
      
      do {
        // Generate position within a circle around the center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
        attempts++;
      } while (isInsideRepulsionZone(x, y, 20) && attempts < maxAttempts);
      
      return { x, y };
    };

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      
      // Calculate particle count based on screen size
      const area = window.innerWidth * window.innerHeight;
      const particleCount = Math.min(
        Math.max(Math.floor(area * PARTICLE_DENSITY), MIN_PARTICLES),
        MAX_PARTICLES
      );
      
      particleCountRef.current = particleCount;
      
      // Create a buffer zone around the edges
      const edgeBuffer = 40;
      
      // Get current theme RGB values
      const themeRgb = getThemeRgb();
      
      // Try to create particles outside repulsion zones
      let attempts = 0;
      const maxAttempts = particleCount * 5;
      
      for (let i = 0; i < particleCount && attempts < maxAttempts; attempts++) {
        // Create particles with a buffer from the edges
        const x = edgeBuffer + Math.random() * (canvas.width - edgeBuffer * 2);
        const y = edgeBuffer + Math.random() * (canvas.height - edgeBuffer * 2);
        
        // Only create particle if it's not inside a repulsion zone
        if (!isInsideRepulsionZone(x, y, 20)) {
          const baseSpeedX = (Math.random() * 0.4 - 0.2) * 0.3;
          const baseSpeedY = (Math.random() * 0.4 - 0.2) * 0.3;
          const opacityRange = getOpacityRange();
          const sizeRange = getParticleSizeRange();
          
          particles.current.push({
            x,
            y,
            size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
            speedX: baseSpeedX,
            speedY: baseSpeedY,
            baseSpeedX,
            baseSpeedY,
            color: `rgba(${themeRgb}, ${Math.random() * (opacityRange.max - opacityRange.min) + opacityRange.min})`,
            teleporting: false,
            offScreen: false
          });
          i++;
        }
      }
      
      // Fill remaining particles if needed
      if (particles.current.length < particleCount) {
        const remaining = particleCount - particles.current.length;
        for (let i = 0; i < remaining; i++) {
          const baseSpeedX = (Math.random() * 0.4 - 0.2) * 0.3;
          const baseSpeedY = (Math.random() * 0.4 - 0.2) * 0.3;
          const opacityRange = getOpacityRange();
          const sizeRange = getParticleSizeRange();
          
          particles.current.push({
            x: edgeBuffer + Math.random() * (canvas.width - edgeBuffer * 2),
            y: edgeBuffer + Math.random() * (canvas.height - edgeBuffer * 2),
            size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
            speedX: baseSpeedX,
            speedY: baseSpeedY,
            baseSpeedX,
            baseSpeedY,
            color: `rgba(${themeRgb}, ${Math.random() * (opacityRange.max - opacityRange.min) + opacityRange.min})`,
            teleporting: false,
            offScreen: false
          });
        }
      }
      
      // Apply initial repulsion to push particles out of repulsion zones
      applyInitialRepulsion();
    };
    
    // Apply strong initial repulsion to push particles out of repulsion zones
    const applyInitialRepulsion = () => {
      // Run multiple iterations to ensure particles move out of repulsion zones
      for (let iteration = 0; iteration < 20; iteration++) {
        let particlesInZones = 0;
        
        // Check each particle
        particles.current.forEach(particle => {
          // Get repulsion forces
          const { forceX, forceY } = getRepulsionForce(particle.x, particle.y);
          
          // If there are repulsion forces, the particle is in or near a zone
          if (Math.abs(forceX) > 0.01 || Math.abs(forceY) > 0.01) {
            particlesInZones++;
            
            // Apply stronger force for initialization
            particle.x += forceX * 5;
            particle.y += forceY * 5;
          }
        });
        
        // If no particles are in zones, we can stop early
        if (particlesInZones === 0) {
          break;
        }
      }
    };

    // Update repulsion zones based on DOM elements
    const updateRepulsionZones = () => {
      repulsionZones.current = [];
      
      // Add navbar as repulsion zone
      const navbar = document.querySelector('nav');
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        repulsionZones.current.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          strength: 2.5
        });
      }
      
      // Try multiple selectors to find the "Jay Esquivel" title
      const navbarTitleSelectors = [
        'a:contains("Jay Esquivel")', 
        'h1:contains("Jay Esquivel")', 
        '.logo', 
        'nav > a:first-child',
        'nav > div > a:first-child',
        'a[href="/"]',
        'a.font-bold',
        'a.text-lg',
        'a.text-xl',
        'a.text-2xl'
      ];
      
      // Custom contains selector implementation
      const findElementWithText = (selector: string, text: string) => {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (el.textContent?.includes(text)) {
            return el;
          }
        }
        return null;
      };
      
      // Try to find the title element
      let navbarTitle = 
        findElementWithText('a', 'Jay Esquivel') || 
        findElementWithText('h1', 'Jay Esquivel') ||
        document.querySelector('nav > a:first-child') ||
        document.querySelector('nav > div > a:first-child') ||
        document.querySelector('a[href="/"]');
      
      // If we found the title element, add it as a repulsion zone
      if (navbarTitle) {
        const rect = navbarTitle.getBoundingClientRect();
        
        // Add padding around the title for better repulsion
        repulsionZones.current.push({
          x: rect.left - 10,
          y: rect.top - 5,
          width: rect.width + 20,
          height: rect.height + 10,
          strength: 3.5 // Even stronger repulsion for the title
        });
      } else {
        // Fallback: add a manual repulsion zone for the top-left area
        repulsionZones.current.push({
          x: 20,
          y: 20,
          width: 200,
          height: 40,
          strength: 3.5
        });
      }
      
      // Add hero text container as repulsion zone
      const heroTextContainer = document.querySelector('.hero-text-container');
      if (heroTextContainer) {
        const rect = heroTextContainer.getBoundingClientRect();
        repulsionZones.current.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          strength: 3
        });
      }
      
      // Add profile picture as repulsion zone
      const profilePic = document.querySelector('.profile-picture-container');
      if (profilePic) {
        const rect = profilePic.getBoundingClientRect();
        repulsionZones.current.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          strength: 3
        });
      }
      
      // Add button as repulsion zone
      const button = document.querySelector('.hero-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        repulsionZones.current.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          strength: 2.5
        });
      }
    };

    // Check if a point is inside or near a repulsion zone
    const getRepulsionForce = (x: number, y: number) => {
      let forceX = 0;
      let forceY = 0;
      const maxDistance = 60;
      
      for (const zone of repulsionZones.current) {
        // Calculate distance to the nearest edge of the zone
        const nearestX = Math.max(zone.x, Math.min(x, zone.x + zone.width));
        const nearestY = Math.max(zone.y, Math.min(y, zone.y + zone.height));
        
        const dx = x - nearestX;
        const dy = y - nearestY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply repulsion force if within maxDistance of the zone
        if (distance < maxDistance) {
          // Inside the zone or very close to it
          if (distance === 0) {
            // Random direction if exactly on the edge, with stronger force
            const angle = Math.random() * Math.PI * 2;
            forceX += Math.cos(angle) * zone.strength * 2;
            forceY += Math.sin(angle) * zone.strength * 2;
          } else {
            // Direction away from nearest point
            const factor = (maxDistance - distance) / maxDistance * zone.strength;
            forceX += (dx / distance) * factor * 1.5;
            forceY += (dy / distance) * factor * 1.5;
          }
        }
      }
      
      return { forceX, forceY };
    };

    // Create a new particle at a random position
    const createNewParticle = () => {
      const edgeBuffer = 40;
      const themeRgb = getThemeRgb();
      const opacityRange = getOpacityRange();
      const sizeRange = getParticleSizeRange();
      
      // Try to find a position not in a repulsion zone
      let x, y;
      let attempts = 0;
      const maxAttempts = 20;
      
      do {
        x = edgeBuffer + Math.random() * (canvas.width - edgeBuffer * 2);
        y = edgeBuffer + Math.random() * (canvas.height - edgeBuffer * 2);
        attempts++;
      } while (isInsideRepulsionZone(x, y, 20) && attempts < maxAttempts);
      
      const baseSpeedX = (Math.random() * 0.4 - 0.2) * 0.3;
      const baseSpeedY = (Math.random() * 0.4 - 0.2) * 0.3;
      
      return {
        x,
        y,
        size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
        speedX: baseSpeedX,
        speedY: baseSpeedY,
        baseSpeedX,
        baseSpeedY,
        color: `rgba(${themeRgb}, ${Math.random() * (opacityRange.max - opacityRange.min) + opacityRange.min})`,
        teleporting: false,
        offScreen: false
      };
    };
    
    // Check and maintain particle count
    const maintainParticleCount = () => {
      // Count visible particles (not completely off screen)
      const visibleParticles = particles.current.filter(p => {
        const farOffScreen = 
          p.x < -100 || 
          p.x > canvas.width + 100 || 
          p.y < -100 || 
          p.y > canvas.height + 100;
        return !farOffScreen;
      });
      
      // If we have fewer visible particles than we should, add more
      if (visibleParticles.length < particleCountRef.current * 0.7) {
        const particlesToAdd = Math.ceil(particleCountRef.current * 0.3);
        
        for (let i = 0; i < particlesToAdd; i++) {
          particles.current.push(createNewParticle());
        }
        
        // Remove particles that are far off screen to keep the total count reasonable
        particles.current = particles.current.filter(p => {
          const farOffScreen = 
            p.x < -100 || 
            p.x > canvas.width + 100 || 
            p.y < -100 || 
            p.y > canvas.height + 100;
          return !farOffScreen || p.teleporting;
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.003;
      
      // Get current theme RGB values
      const themeRgb = getThemeRgb();
      
      // Calculate connection distance based on screen size
      const connectionDistance = Math.min(
        Math.max(window.innerWidth, window.innerHeight) * 0.12,
        120
      );
      
      // Calculate mouse influence radius based on screen size
      const mouseRadius = Math.min(
        Math.max(window.innerWidth, window.innerHeight) * CURSOR_REPULSION_RADIUS_MULTIPLIER,
        180
      );
      
      // Define the completely off-screen threshold (when to teleport back)
      const offScreenThreshold = 20;
      
      // First pass: calculate all forces
      particles.current.forEach((particle, index) => {
        // Skip force calculation for teleporting particles
        if (particle.teleporting) return;
        
        // Store previous speed for momentum calculation
        const prevSpeedX = particle.speedX;
        const prevSpeedY = particle.speedY;
        
        // Reset to base speed for natural movement
        particle.speedX = particle.baseSpeedX;
        particle.speedY = particle.baseSpeedY;
        
        // Add slight wave motion
        particle.speedX += Math.sin(time.current + particle.y * 0.01) * 0.03;
        particle.speedY += Math.cos(time.current + particle.x * 0.01) * 0.03;
        
        // Calculate distance to mouse
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Track if particle was influenced by cursor this frame
        let cursorInfluenced = false;
        
        // Move particles away from mouse when close - with stronger effect
        if (isMouseActive.current && distance < mouseRadius) {
          cursorInfluenced = true;
          const angle = Math.atan2(dy, dx);
          
          // Stronger force with quadratic falloff (more powerful close to cursor)
          const force = Math.pow((mouseRadius - distance) / mouseRadius, 2) * CURSOR_REPULSION_STRENGTH;
          
          // Apply force as acceleration rather than directly setting velocity
          const repulsionX = -Math.cos(angle) * force;
          const repulsionY = -Math.sin(angle) * force;
          
          // Add to current speed instead of replacing it
          particle.speedX += repulsionX;
          particle.speedY += repulsionY;
          
          // Update base speeds to retain some of this momentum
          particle.baseSpeedX = particle.baseSpeedX * (1 - MOMENTUM_RETENTION) + 
                               particle.speedX * MOMENTUM_RETENTION * 0.2;
          particle.baseSpeedY = particle.baseSpeedY * (1 - MOMENTUM_RETENTION) + 
                               particle.speedY * MOMENTUM_RETENTION * 0.2;
        }
        
        // If not influenced by cursor this frame, blend in previous frame's momentum
        if (!cursorInfluenced && (Math.abs(prevSpeedX) > 0.1 || Math.abs(prevSpeedY) > 0.1)) {
          // Retain some momentum from previous frame
          particle.speedX += prevSpeedX * MOMENTUM_RETENTION * 0.5;
          particle.speedY += prevSpeedY * MOMENTUM_RETENTION * 0.5;
        }
        
        // Apply repulsion forces from text and navbar
        const { forceX, forceY } = getRepulsionForce(particle.x, particle.y);
        
        // Apply stronger repulsion if particle is inside a repulsion zone
        const isInRepulsionZone = isInsideRepulsionZone(particle.x, particle.y, 0);
        const repulsionMultiplier = isInRepulsionZone ? 5 : 1; // 5x stronger force if inside
        
        particle.speedX += forceX * repulsionMultiplier;
        particle.speedY += forceY * repulsionMultiplier;
        
        // Apply particle-to-particle repulsion to prevent clumping
        let particleRepulsionX = 0;
        let particleRepulsionY = 0;
        
        for (let j = 0; j < particles.current.length; j++) {
          if (j === index) continue; // Skip self
          
          const otherParticle = particles.current[j];
          if (otherParticle.teleporting) continue; // Skip teleporting particles
          
          const pdx = particle.x - otherParticle.x;
          const pdy = particle.y - otherParticle.y;
          const particleDistance = Math.sqrt(pdx * pdx + pdy * pdy);
          
          // Only apply repulsion if particles are close enough
          if (particleDistance < PARTICLE_REPULSION_RADIUS && particleDistance > 0) {
            // Inverse square law for more natural repulsion
            const repulsionForce = PARTICLE_REPULSION_STRENGTH * (1 - (particleDistance / PARTICLE_REPULSION_RADIUS));
            
            // Normalize direction vector
            particleRepulsionX += (pdx / particleDistance) * repulsionForce;
            particleRepulsionY += (pdy / particleDistance) * repulsionForce;
          }
        }
        
        // Apply particle repulsion forces
        particle.speedX += particleRepulsionX;
        particle.speedY += particleRepulsionY;
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Slow down particles (damping) - slightly higher damping for more natural feel
        particle.speedX *= DAMPING_FACTOR;
        particle.speedY *= DAMPING_FACTOR;
        
        // Simple screen wrapping - if particle goes off one edge, bring it back on the opposite edge
        const buffer = 5; // Small buffer to prevent getting stuck at the edge
        
        if (particle.x < -buffer) {
          particle.x = canvas.width + buffer;
          particle.offScreen = false;
        } else if (particle.x > canvas.width + buffer) {
          particle.x = -buffer;
          particle.offScreen = false;
        }
        
        if (particle.y < -buffer) {
          particle.y = canvas.height + buffer;
          particle.offScreen = false;
        } else if (particle.y > canvas.height + buffer) {
          particle.y = -buffer;
          particle.offScreen = false;
        }
      });
      
      // Second pass: draw particles and connections
      particles.current.forEach((particle, index) => {
        // Handle teleporting particles
        if (particle.teleporting && particle.teleportProgress !== undefined && particle.teleportDestination) {
          // Advance teleport progress
          particle.teleportProgress += 0.05;
          
          // Fade out and in effect
          let opacity = 0;
          if (particle.teleportProgress < 0.5) {
            // Fade out (first half of teleport)
            opacity = 1 - particle.teleportProgress * 2;
          } else {
            // Fade in (second half of teleport)
            opacity = (particle.teleportProgress - 0.5) * 2;
          }
          
          // Update position based on teleport progress
          if (particle.teleportProgress >= 0.5 && particle.teleportProgress < 0.51) {
            // At midpoint, actually move the particle to destination
            particle.x = particle.teleportDestination.x;
            particle.y = particle.teleportDestination.y;
            particle.offScreen = false;
            
            // Apply immediate repulsion if the particle teleported into a repulsion zone
            const { forceX, forceY } = getRepulsionForce(particle.x, particle.y);
            if (Math.abs(forceX) > 0.01 || Math.abs(forceY) > 0.01) {
              particle.x += forceX * 10;
              particle.y += forceY * 10;
            }
          }
          
          // Draw teleporting particle with adjusted opacity
          const baseColor = particle.color.replace(/[\d.]+\)$/, '');
          ctx.fillStyle = `${baseColor}${opacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // End teleport when complete
          if (particle.teleportProgress >= 1) {
            particle.teleporting = false;
            particle.teleportProgress = undefined;
            particle.teleportDestination = undefined;
            // Update particle color to match current theme
            const opacityRange = getOpacityRange();
            particle.color = `rgba(${themeRgb}, ${Math.random() * (opacityRange.max - opacityRange.min) + opacityRange.min})`;
          }
          
          return; // Skip the rest for teleporting particles
        }
        
        // Draw regular particle
        if (!particle.teleporting) {
          // Update particle color to match current theme if needed
          if (!particle.color.includes(themeRgb)) {
            const opacityRange = getOpacityRange();
            particle.color = `rgba(${themeRgb}, ${Math.random() * (opacityRange.max - opacityRange.min) + opacityRange.min})`;
          }
          
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw connections between nearby particles
        // Only draw connections if neither particle is teleporting
        for (let j = index + 1; j < particles.current.length; j++) {
          const otherParticle = particles.current[j];
          
          if (particle.teleporting || otherParticle.teleporting) {
            continue; // Skip connections for teleporting particles
          }
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const connectionOpacityMultiplier = getConnectionOpacity();
            const opacity = connectionOpacityMultiplier * (1 - distance / connectionDistance) + 0.15; // Increased base opacity
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${themeRgb}, ${Math.min(opacity, 0.95)})`; // Higher cap
            ctx.lineWidth = isDarkMode() ? 0.7 : 0.6; // Thicker lines in both modes
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Handle theme changes
    const handleThemeChange = () => {
      // Update particle colors to match the new theme
      const themeRgb = getThemeRgb();
      const opacityRange = getOpacityRange();
      particles.current.forEach(particle => {
        particle.color = `rgba(${themeRgb}, ${Math.random() * (opacityRange.max - opacityRange.min) + opacityRange.min})`;
      });
    };

    // Set up event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('themechange', handleThemeChange);
    
    // Set up particle respawn interval
    respawnIntervalRef.current = setInterval(maintainParticleCount, PARTICLE_RESPAWN_INTERVAL);
    
    // Initialize
    handleResize();
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('themechange', handleThemeChange);
      if (respawnIntervalRef.current) {
        clearInterval(respawnIntervalRef.current);
      }
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme, systemTheme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
} 