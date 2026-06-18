import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneCall, Loader2, Volume2, Waves } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Vapi from '@vapi-ai/web';

const TestCallWindow = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'connecting', 'connected'
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);

  const timerRef = useRef(null);
  const chatScrollRef = useRef(null);
  const vapiRef = useRef(null);
  const listenersRegisteredRef = useRef(false);

  if (!vapiRef.current) {
    vapiRef.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || "a78bff84-96a1-4416-babd-1c737d6fbc0a");
  }
  const vapi = vapiRef.current;

  // Fetch agents from Agent Management endpoint
  const { data: responseData, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await axiosSecure.get('/business-owner/ai-training/');
      return res.data;
    }
  });

  const agents = responseData?.data || [];

  useEffect(() => {
    const onCallStart = () => {
      setIsCalling(true);
      setCallStatus('connected');
      setMessages([]);
      
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
      timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    };

    const onCallEnd = () => {
      setIsCalling(false);
      setCallStatus('idle');
      setVolume(0);
      setAiSpeaking(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    const onVolumeLevel = (level) => {
      setVolume(level);
    };

    const onMessage = (message) => {
      if (message.type === 'bot-message') {
         setAiSpeaking(true);
      }
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setMessages(prev => {
          // Strict deduplication check (ignores trailing spaces)
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.text.trim() === message.transcript.trim() && lastMsg.role === message.role) {
            return prev; // Ignore duplicate
          }
          
          // Append to previous message if same role, to avoid broken sentence bubbles
          if (lastMsg && lastMsg.role === message.role) {
            const newPrev = [...prev];
            newPrev[newPrev.length - 1] = {
              ...lastMsg,
              text: lastMsg.text.trim() + " " + message.transcript.trim()
            };
            return newPrev;
          }

          return [...prev, {
            id: Date.now() + Math.random(),
            role: message.role, // 'user' or 'assistant'
            text: message.transcript.trim()
          }];
        });
      }
    };

    const onError = (e) => {
      console.error("Vapi Error:", e);
      let errorMsg = "Unknown error";
      if (e?.error?.message?.message) errorMsg = e.error.message.message;
      else if (e?.error?.message) errorMsg = JSON.stringify(e.error.message);
      else if (typeof e === 'string') errorMsg = e;
      
      if (errorMsg.includes("Couldn't Get Assistant") || errorMsg.includes("Bad Request")) {
        toast.error(`Call failed: Vapi doesn't recognize this Agent ID. Make sure your backend returns a valid 'vapiAssistantId'.`, { duration: 6000 });
      } else {
        toast.error(`Call failed: ${errorMsg}`);
      }
      
      setIsCalling(false);
      setCallStatus('idle');
      if (timerRef.current) clearInterval(timerRef.current);
    };

    // Register Event Listeners exactly once
    if (!listenersRegisteredRef.current) {
      listenersRegisteredRef.current = true;
      vapi.on('call-start', onCallStart);
      vapi.on('call-end', onCallEnd);
      vapi.on('volume-level', onVolumeLevel);
      vapi.on('message', onMessage);
      vapi.on('error', onError);
    }

    return () => {
      // In Strict Mode, we don't aggressively remove listeners because Vapi SDK sometimes fails to re-attach them.
      // The `listenersRegisteredRef` ensures they are only attached once in the entire lifecycle.
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCall = async () => {
    if (!selectedAgent) {
      toast.error("Please select an agent first.");
      return;
    }

    try {
      setCallStatus('connecting');
      const agentId = selectedAgent.vapiAssistantId || selectedAgent.vapiAgentId || selectedAgent.agentId || selectedAgent.vapi_agent_id || selectedAgent.id;
      
      if (!agentId) {
        toast.error("Invalid Agent ID. Cannot start call.");
        setCallStatus('idle');
        return;
      }
      console.log("Starting call with Agent ID:", agentId);
      
      // Request microphone permissions before starting
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the call with Vapi using the selected agent's ID
      await vapi.start(agentId);
      
    } catch (err) {
      console.error("Error starting call:", err);
      toast.error("Microphone access denied or failed to connect to AI.");
      setCallStatus('idle');
    }
  };

  const endCall = () => {
    vapi.stop();
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <Breadcrumb text={"AI Voice Tester"} />
      </div>

      <div className={`flex-1 relative flex ${isCalling ? 'flex-col lg:flex-row' : 'flex-col'} overflow-hidden min-h-[600px] rounded-[32px] bg-gradient-to-br from-[#ffffff] to-[#f8f9fa] border border-[#e6e4df] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500`}>
        
        {/* Left Side: Voice Orb Area */}
        <div className={`relative flex flex-col items-center justify-center ${isCalling ? 'w-full lg:w-[60%]' : 'w-full'} h-full transition-all duration-500`}>
          
          {/* Header Section / Dropdown */}
          <div className="absolute top-0 w-full p-8 flex flex-col items-center z-20">
          <AnimatePresence>
            {!isCalling && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="w-full max-w-md bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e6e4df]/60 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#184a36]/10 flex items-center justify-center">
                    <Waves className="w-5 h-5 text-[#184a36]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0e1217]">Select Your AI Agent</h2>
                </div>
                
                {isLoadingAgents ? (
                  <div className="flex justify-center p-4 text-[#9fa5ac]">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : agents.length === 0 ? (
                  <div className="text-center text-red-500 text-sm p-4 bg-red-50 rounded-xl font-medium border border-red-100">
                    No agents found. Please create one in Agent Management.
                  </div>
                ) : (
                  <select 
                    value={selectedAgent?.id || ""}
                    onChange={(e) => {
                      const agent = agents.find(a => a.id === e.target.value);
                      setSelectedAgent(agent);
                    }}
                    className="w-full px-5 py-4 rounded-2xl border border-[#e6e4df] bg-[#fbfaf6] hover:bg-white focus:outline-none focus:border-[#205943] focus:ring-2 focus:ring-[#205943]/20 transition-all text-[15px] font-medium appearance-none cursor-pointer shadow-sm"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  >
                    <option value="" disabled>Choose an AI Assistant...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.agentName} {agent.status !== 'active' ? `(${agent.status})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCalling && (
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-center mt-4"
               >
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#e6e4df] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-sm font-semibold text-[#0e1217]">
                      {formatTime(callDuration)}
                    </span>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Central Visualizer Area */}
          <div className="relative flex flex-col items-center justify-center w-full mt-10 z-10">
          
          <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
            {/* Pulsing Glow Rings */}
            {callStatus === 'connected' && (
              <>
                <motion.div 
                  className="absolute inset-0 bg-[#10b981] rounded-full blur-3xl opacity-20"
                  animate={{ scale: 1 + volume * 1.5, opacity: 0.1 + volume * 0.3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.div 
                  className="absolute inset-4 bg-[#047857] rounded-full opacity-10"
                  animate={{ scale: 1 + volume * 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </>
            )}

            {/* Main Center Avatar/Orb */}
            <motion.div
              animate={{ 
                scale: callStatus === 'connected' ? 1 + Math.min(volume * 0.2, 0.5) : 1,
                boxShadow: callStatus === 'connected' 
                  ? `0 0 0 ${Math.min(volume * 20, 40)}px rgba(16, 185, 129, 0.2)`
                  : '0 10px 30px rgba(0,0,0,0.05)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative z-20 w-40 h-40 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden ${
                callStatus === 'connected' 
                  ? 'bg-gradient-to-tr from-[#184a36] to-[#205943] text-white shadow-2xl' 
                  : 'bg-white border-2 border-[#e6e4df] text-[#9fa5ac]'
              }`}
            >
              {callStatus === 'connecting' ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-[#205943]" />
                  <span className="text-sm font-medium text-[#205943]">Connecting...</span>
                </div>
              ) : callStatus === 'connected' ? (
                <div className="flex flex-col items-center gap-2">
                  <Volume2 className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium opacity-90 tracking-wide">
                    {aiSpeaking ? "Speaking..." : "Listening..."}
                  </span>
                </div>
              ) : (
                <Mic className="w-12 h-12 opacity-50" />
              )}
            </motion.div>
          </div>

          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-8 w-full flex justify-center z-20">
          <AnimatePresence mode="wait">
            {!isCalling && callStatus !== 'connecting' ? (
              <motion.button
                key="start-btn"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                disabled={!selectedAgent}
                onClick={startCall}
                className={`group flex items-center gap-3 px-10 py-5 rounded-[24px] font-bold text-[17px] transition-all shadow-xl ${
                  selectedAgent 
                    ? 'bg-[#184a36] text-white hover:bg-[#103a29] hover:shadow-[0_10px_40px_rgba(24,74,54,0.4)] hover:-translate-y-1 active:scale-95' 
                    : 'bg-[#e6e4df]/60 text-[#9fa5ac] cursor-not-allowed border border-[#e6e4df]'
                }`}
              >
                <PhoneCall className={`w-6 h-6 ${selectedAgent ? 'group-hover:animate-pulse' : ''}`} />
                {selectedAgent ? "Start Voice Test" : "Select Agent to Call"}
              </motion.button>
            ) : (
              <motion.div
                key="active-controls"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                className="flex items-center gap-4 bg-white/90 backdrop-blur-xl border border-[#e6e4df] p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              >
                <button
                  onClick={toggleMute}
                  className={`w-14 h-14 flex items-center justify-center rounded-full transition-all ${
                    isMuted
                      ? "bg-amber-100 text-amber-600 border border-amber-200"
                      : "bg-[#fbfaf6] text-[#6b7280] hover:bg-[#e6e4df] border border-[#e6e4df]"
                  }`}
                  title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                
                <div className="w-[1px] h-8 bg-[#e6e4df]" />
                
                <button
                  onClick={endCall}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95"
                  title="End Call"
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Chat Transcript */}
        <AnimatePresence>
          {isCalling && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '40%' }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:flex w-full lg:w-[40%] h-full border-l border-[#e6e4df] bg-white/60 backdrop-blur-md flex-col z-10 shadow-[-10px_0_30px_rgb(0,0,0,0.02)]"
            >
              <div className="p-6 border-b border-[#e6e4df] bg-white/50">
                <h3 className="text-lg font-bold text-[#0e1217] flex items-center gap-2">
                  <Waves className="w-5 h-5 text-[#184a36]" />
                  Live Transcript
                </h3>
              </div>
              
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#9fa5ac] text-sm italic">
                    Start speaking to see the transcript...
                  </div>
                ) : (
                  messages.map(msg => (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-[#184a36] text-white self-end rounded-br-sm' 
                          : 'bg-[#fbfaf6] border border-[#e6e4df] text-[#0e1217] self-start rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TestCallWindow;
