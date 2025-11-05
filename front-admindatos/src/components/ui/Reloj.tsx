import React, { useState, useEffect } from 'react';
import { MotionValue, motion, useSpring, useTransform } from 'framer-motion';
import { Sun, Sunrise, Cloud, Moon } from 'lucide-react';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  let y = useTransform(mv, latest => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
}

function Digit({ place, value, height }: DigitProps) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums'
  };

  return (
    <div style={defaultStyle}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

function getTimeOfDay(hours: number) {
  if (hours >= 5 && hours < 7) return { icon: Sunrise, color: 'text-amber-500' };
  if (hours >= 7 && hours < 12) return { icon: Sun, color: 'text-yellow-500' };
  if (hours >= 12 && hours < 18) return { icon: Cloud, color: 'text-slate-400' };
  if (hours >= 18 && hours < 20) return { icon: Cloud, color: 'text-orange-600' };
  if (hours >= 20 && hours < 22) return { icon: Moon, color: 'text-slate-500' };
  return { icon: Moon, color: 'text-slate-600' };
}

interface AnimatedClockProps {
  fontSize?: number;
  className?: string;
}

const AnimatedClock: React.FC<AnimatedClockProps> = ({ fontSize = 16, className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hours12 = hours % 12 || 12;
  const isPM = hours >= 12;

  const height = fontSize + 2;

  const { icon: Icon, color } = getTimeOfDay(hours);

  const formatFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
      
      <div className="flex items-center gap-1 text-[21px] font-bold">
        <div className="flex overflow-hidden">
          <Digit place={10} value={hours12} height={height} />
          <Digit place={1} value={hours12} height={height} />
        </div>

        <span className="opacity-10 animate-pulse" >:</span>

        <div className="flex overflow-hidden">
          <Digit place={10} value={minutes} height={height} />
          <Digit place={1} value={minutes} height={height} />
        </div>

     
    
      </div>

      <span className="text-base font-semibold opacity-70">{isPM ? 'PM' : 'AM'}</span>
      
      <span className="text-sm font-medium opacity-70">{formatFecha(time)}</span>
    </div>
  );
};

export default AnimatedClock;