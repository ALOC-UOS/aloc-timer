'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';

const CountdownTimer = () => {
  const [time, setTime] = useState(1200); // 20 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [colorIntensity, setColorIntensity] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = useCallback((frequency: number, duration: number) => {
    if (!isSoundOn) return;
    const audioContext = new (window.AudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [isSoundOn]);

  const playTickSound = useCallback(() => playSound(1000, 0.1), [playSound]);
  const playAlarmSound = useCallback(() => {
    playSound(1000, 0.1);
    setTimeout(() => playSound(1000, 0.1), 100);
    setTimeout(() => playSound(1000, 0.1), 200);
  }, [playSound]);


  useEffect(() => {
    let interval = undefined;
    if (isActive && time > 0) { // 타이머 작동 중
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (isActive && time === 0 && isAlarmActive) { // 시간이 다 되었는데 알람을 끄지 않을 경우
      setIsAlarmActive(true);
      // setIsActive(false); // Set to maximum red
      alarmIntervalRef.current = setInterval(playAlarmSound, 1000);
    }

    // Play Sound
    if (time <= 5 && time > 0 && isActive) { // 5초 전부터 약하게 알람
      playTickSound();
    } else if (isActive && time === 0 && !isAlarmActive) { // 시간이 다 되었다는 강한 알람
      playAlarmSound();
    }
    
    // Calculate color intensity
    if (time <= 5 && time > 0) { // 5초 전부터 색 변함
      setColorIntensity((5 - time) / 5);
    } else if (time == 0 && isActive) {
      setColorIntensity(0.9); // 시간은 다 됐으나 알람을 안끔
    }
    else {
      setColorIntensity(0);
    }

    return () => clearInterval(interval);
  }, [isActive, time, playTickSound, playAlarmSound, isAlarmActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (isActive && time == 0) {
      resetTimer();
    }
  };

  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
    setColorIntensity(0);
    setIsAlarmActive(true);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTime = (minutes: number) => {
    setTime((prevTime) => prevTime + minutes * 60);
    if (isAlarmActive) {
      setIsAlarmActive(true);
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    }
    setColorIntensity(0);
  };

  // const bgStyle = {
  //   '--color-intensity': colorIntensity,
  // } as React.CSSProperties;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300 bg-gray-100"
      style={{
        backgroundColor: colorIntensity > 0 
          ? `rgb(${Math.round(243 + (12 * colorIntensity))}, ${Math.round(243 - (243 * colorIntensity))}, ${Math.round(243 - (243 * colorIntensity))})` 
          : 'rgb(243, 244, 246)' // Tailwind's gray-100
      }}
    >
      <div 
        className="p-10 bg-white bg-opacity-80 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${1 - colorIntensity * 0.5})`
        }}
      >
        <h1 
          className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          style={{
            color: colorIntensity > 0 ? `rgb(${Math.round(0 * (1 - colorIntensity))}, ${Math.round(0 * (1 - colorIntensity))}, ${Math.round(255 * (1 - colorIntensity))})` : undefined
          }}
        >
          Countdown Timer
        </h1>
        <div 
          className="text-8xl font-bold mb-10 text-center transition-colors duration-300 text-black"
        >
          {formatTime(time)}
        </div>
        <div className="flex justify-center space-x-4 mb-4">
        <button
            className={`px-8 py-3 rounded-full text-white font-semibold transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isActive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500'
            }`}
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          {[1, 10, 20, 30].map((min) => (
            <button
              key={min}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              onClick={() => addTime(min)}
            >
              +{min} min
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            className={`p-2 rounded-full ${isSoundOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'} text-white transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400`}
            onClick={() => setIsSoundOn(!isSoundOn)}
            aria-label={isSoundOn ? "Mute sound" : "Unmute sound"}
          >
            {isSoundOn ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;