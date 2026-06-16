import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneCall } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

const TestCallWindow = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsCalling(true);
      setCallDuration(0);
      
      // Start Timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      detectVolume();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const endCall = () => {
    setIsCalling(false);
    setIsMuted(false);
    setVolume(0);
    setCallDuration(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !newMuteState;
      });
    }
  };

  const detectVolume = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const update = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      setVolume(average);
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  useEffect(() => {
    return () => {
      endCall();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <Breadcrumb text={"Check the voice tester"} />
      </div>

      <div className="flex-1 bg-[#ffffff] rounded-3xl border border-[#e6e4df] relative flex flex-col items-center justify-center overflow-hidden min-h-[600px] ">
        {/* Voice Orb Area */}
        <div className="relative mb-12 md:mb-20 scale-75 md:scale-100">
          <motion.div
            animate={{
              scale: isCalling ? 1 + volume / 800 : 1,
            }}
            transition={{
              duration: isCalling ? 0.1 : 3,
              repeat: isCalling ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center relative z-10 overflow-hidden"
          >
            <motion.img
              src="/moon.png"
              alt="Voice Orb"
              className="absolute inset-0 w-full h-full object-cover rounded-full "
              animate={
                isCalling
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
           

            <span className="text-[#0e1217] text-lg md:text-xl font-bold relative z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {isCalling ? (isMuted ? "Muted" : "Analyzing...") : "Ready"}
            </span>
          </motion.div>
         
        </div>

        {/* Improved Spiky Waveforms Area */}
        <div className="w-full max-w-5xl h-32 md:h-48 flex items-center justify-center relative mb-12 md:mb-16 px-4">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 150"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <Waveform
              color="#3b6b4f"
              isCalling={isCalling}
              volume={volume}
              multiplier={1.25}
              freq={0.06}
              strokeWidth={2}
            />
            <Waveform
              color="#3B82F6"
              isCalling={isCalling}
              volume={volume}
              multiplier={1.0}
              freq={0.08}
              strokeWidth={1.5}
              opacity={0.5}
            />
            <Waveform
              color="#1E40AF"
              isCalling={isCalling}
              volume={volume}
              multiplier={0.6}
              freq={0.04}
              strokeWidth={1}
              opacity={0.3}
            />
          </svg>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-16">
          <AnimatePresence mode="wait">
            {!isCalling ? (
              <motion.button
                key="start-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={startCall}
                className="group flex items-center gap-3 bg-[#e8ecea]0 hover:bg-green-600 text-black px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95"
              >
                <PhoneCall className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-pulse" />
                Start Test Call
              </motion.button>
            ) : (
              <motion.div
                key="active-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative flex items-center gap-3 md:gap-4 bg-[#ffffff] border border-blue-500/30 px-5 md:px-6 py-3 md:py-4 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.2)]"
              >
                {/* Relocated Timer */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-mono text-sm tracking-widest">
                    {formatTime(callDuration)}
                  </span>
                </div>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full transition-all ${
                    isMuted
                      ? "bg-red-500/20 text-red-500"
                      : "bg-blue-500/10 text-green-400 hover:bg-blue-500/20"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-7 h-7" />
                  ) : (
                    <Mic className="w-7 h-7" />
                  )}
                </button>
                <div className="w-[1px] h-8 bg-blue-500/20 mx-2" />
                <button
                  onClick={endCall}
                  className="p-4 rounded-full bg-red-500 text-[#0e1217] hover:bg-red-600 transition-all shadow-lg shadow-red-500/40 hover:scale-110 active:scale-90"
                >
                  <Phone className="w-7 h-7 rotate-[135deg]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Waveform = ({
  color,
  isCalling,
  volume,
  multiplier,
  freq,
  strokeWidth,
  opacity = 1,
}) => {
  const isVoiceActive = isCalling && volume > 2;
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId;
    const animate = () => {
      setTime((prev) => prev + 0.1);
      frameId = requestAnimationFrame(animate);
    };
    if (isVoiceActive) {
      animate();
    } else {
      setTime(0);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isVoiceActive]);

  const generatePath = () => {
    const points = 100;
    const width = 1000;
    const step = width / points;
    const centerY = 75;
    let d = `M 0 ${centerY}`;

    for (let i = 0; i <= points; i++) {
      const x = i * step;
      // Reduced amplitude logic for a more subtle "normal" look
      const baseAmplitude = isVoiceActive ? volume * multiplier * 0.4 : 0;
      const waveVariation = 0.5 + Math.sin(i * 0.1 + time) * 0.5;
      const amplitude = baseAmplitude * waveVariation;

      const y = centerY + Math.sin(i * freq * 10 + time) * amplitude;

      if (i === 0) continue;
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  return (
    <motion.path
      d={generatePath()}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

export default TestCallWindow;
