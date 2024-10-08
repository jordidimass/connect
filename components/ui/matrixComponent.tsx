"use client";

import { useEffect, useRef, useState } from "react";
import { X, Minus, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";  // Import Next.js router

// MatrixComponent.tsx
export default function MatrixComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const router = useRouter(); // Initialize the router hook
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMatrixAnimating, setIsMatrixAnimating] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [terminalPosition, setTerminalPosition] = useState({ x: 20, y: 20 });
  const [terminalSize, setTerminalSize] = useState({ width: 400, height: 300 });
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);
  const [isResizingTerminal, setIsResizingTerminal] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Wake up...",
    "The Matrix has you...",
    "Follow the white rabbit.",
    "Knock, knock, it's me jordi.",
  ]);
  const [currentTrack, setCurrentTrack] = useState<"clubbed" | "spybreak">("clubbed");

  const tracks = {
    clubbed: {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rob%20Dougan%20-%20Clubbed%20to%20Death%20(The%20Matrix%20Reloaded%20OST)-AgcCQo9iIZ4Quf39BdcSRbyCmwAKKK.mp3",
      title: "Rob Dougan - Clubbed to Death",
    },
    spybreak: {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Propellerheads%20-%20Spybreak!-N6LWOL6ZJDSr5ud3AzpWAU43n7zSFN.mp3",
      title: "Propellerheads - Spybreak!",
    },
  };

  // Handle the exit functionality when "X" is clicked
  const handleExit = () => {
    router.back(); // Navigate back to the previous page
    // Alternatively, to go to the homepage, you could use: router.push('/');
  };

  // Matrix animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+{}[]|;:,.<>?あいうえおかきくけこさしすせそ";
    const fontSize = window.innerWidth < 768 ? 12 : 16;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    function animate() {
      if (isMatrixAnimating) {
        draw();
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    animate();

    const handleResize = () => {
      updateCanvasSize();
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMatrixAnimating]);

  // Audio control effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setAudioProgress((audio.currentTime / audio.duration) * 100);
      setRemainingTime(audio.duration - audio.currentTime);
    };

    const setInitialTime = () => {
      setRemainingTime(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setInitialTime);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setInitialTime);
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const toggleMatrixAnimation = () => {
    setIsMatrixAnimating(!isMatrixAnimating);
  };

  const switchTrack = () => {
    setCurrentTrack(currentTrack === "clubbed" ? "spybreak" : "clubbed");
    if (isAudioPlaying) {
      audioRef.current?.pause();
      audioRef.current?.load();
      audioRef.current?.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Dragging and resizing logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, action: "drag" | "resize") => {
    const rect = terminalRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.type === "mousedown" ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).touches[0].clientX;
    const clientY = e.type === "mousedown" ? (e as React.MouseEvent).clientY : (e as React.TouchEvent).touches[0].clientY;

    if (action === "drag") {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setIsDraggingTerminal(true);
    } else {
      setDragOffset({
        x: rect.width - (clientX - rect.left),
        y: rect.height - (clientY - rect.top),
      });
      setIsResizingTerminal(true);
    }
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    if (isDraggingTerminal) {
      setTerminalPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    } else if (isResizingTerminal) {
      const newWidth = clientX - terminalPosition.x + dragOffset.x;
      const newHeight = clientY - terminalPosition.y + dragOffset.y;
      setTerminalSize({
        width: Math.max(200, newWidth),
        height: Math.max(100, newHeight),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingTerminal(false);
    setIsResizingTerminal(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDraggingTerminal, isResizingTerminal]);

  // Terminal commands handling
  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = terminalInput.trim();
      if (input) {
        setTerminalOutput([...terminalOutput, `> ${terminalInput}`]);
        processCommand(input);
        setTerminalInput("");
      }
    }
  };

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    let newOutput = [...terminalOutput, `> ${command}`];

    switch (lowerCommand) {
      case "help":
        newOutput = [
          ...newOutput,
          "Available commands: help, clear, characters, about-matrix, play-track, pause-track, now-playing, toggle-matrix, switch-track",
        ];
        break;
      case "clear":
        newOutput = [];
        break;
      case "characters":
        newOutput = [
          ...newOutput,
          "ghost (jordi dimas) - The One",
          "Morpheus - Captain of the Nebuchadnezzar",
          "Shinji - Orange Cat",
          "Agent Smith - Sentient program of the Matrix",
          "Cypher - Crew member of the Nebuchadnezzar",
        ];
        break;
      case "about-matrix":
        newOutput = [
          ...newOutput,
          "The Matrix (1999) is a groundbreaking sci-fi action film directed by the Wachowskis.",
          "Set in a dystopian future, it explores the concept of simulated reality.",
          "",
          "In this world, most of humanity is unknowingly trapped inside the Matrix,",
          "a virtual world created by sentient machines to harness human bodies as an energy source.",
        ];
        break;
      case "play-track":
        toggleAudio();
        newOutput = [...newOutput, `Playing: ${tracks[currentTrack].title}`];
        break;
      case "pause-track":
        toggleAudio();
        newOutput = [...newOutput, "Audio paused."];
        break;
      case "now-playing":
        newOutput = [
          ...newOutput,
          `Now playing: ${tracks[currentTrack].title}`,
          `Status: ${isAudioPlaying ? "Playing" : "Paused"}`,
          `Time remaining: ${formatTime(remainingTime)}`,
        ];
        break;
      case "toggle-matrix":
        toggleMatrixAnimation();
        newOutput = [...newOutput, isMatrixAnimating ? "Pausing Matrix animation." : "Resuming Matrix animation."];
        break;
      case "switch-track":
        switchTrack();
        newOutput = [...newOutput, `Switched to ${tracks[currentTrack].title}`];
        break;
      default:
        newOutput = [...newOutput, "Command not recognized. Type 'help' for available commands."];
        break;
    }

    setTerminalOutput(newOutput);
  };

  return (
    <div className="bg-black min-h-screen font-mono text-[#0FFD20] overflow-hidden">
      <style jsx global>{`
        ::selection {
          background-color: #0FFD20;
          color: black;
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        aria-label="Matrix digital rain animation"
      />
      <div
        ref={terminalRef}
        className="absolute bg-black border border-[#0FFD20] shadow-lg"
        style={{
          left: `${terminalPosition.x}px`,
          top: `${terminalPosition.y}px`,
          width: `${terminalSize.width}px`,
          height: `${terminalSize.height}px`,
          boxShadow: "0 0 10px #0FFD20",
        }}
      >
        <div
          className="flex justify-between items-center p-1 border-b border-[#0FFD20] cursor-move"
          onMouseDown={(e) => handleMouseDown(e, "drag")}
          onTouchStart={(e) => handleMouseDown(e, "drag")}
        >
          <span className="text-xs uppercase">TERMINAL</span>
          <div className="flex space-x-1">
            <button className="text-[#0FFD20] hover:text-white" aria-label="Minimize">
              <Minus size={12} />
            </button>
            <button className="text-[#0FFD20] hover:text-white" aria-label="Maximize">
              <Maximize2 size={12} />
            </button>
            <button
              className="text-[#0FFD20] hover:text-white"
              aria-label="Close"
              onClick={handleExit} // Attach the exit functionality to the "X" button
            >
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="p-2 overflow-y-auto" style={{ height: `calc(100% - 25px)` }}>
          {terminalOutput.map((line, index) => (
            <div key={index} className="text-xs">
              {line}
            </div>
          ))}
          <div className="flex items-center text-xs">
            <span className="mr-1">{">"}</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalInput}
              className="bg-transparent border-none outline-none flex-grow"
              aria-label="Terminal input"
            />
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => handleMouseDown(e, "resize")}
          onTouchStart={(e) => handleMouseDown(e, "resize")}
        />
      </div>
      <audio ref={audioRef} src={tracks[currentTrack].src} loop />
      <div className="fixed bottom-0 left-0 w-full h-2 md:h-4 bg-black border-t-2 border-[#0FFD20] z-10">
        <div
          className="h-full bg-[#0FFD20]"
          style={{
            width: `${audioProgress}%`,
            boxShadow: "0 0 10px #0FFD20, 0 0 5px #0FFD20 inset",
          }}
          role="progressbar"
          aria-valuenow={audioProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
}
