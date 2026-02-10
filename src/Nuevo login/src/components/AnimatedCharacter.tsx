import { motion } from 'motion/react';

interface AnimatedCharacterProps {
  focusedField: 'email' | 'password' | null;
  showPassword: boolean;
}

export function AnimatedCharacter({ focusedField, showPassword }: AnimatedCharacterProps) {
  return (
    <motion.div 
      className="relative w-32 h-36"
      animate={{
        y: [0, -4, 0],
        rotate: focusedField === 'email' ? [0, -3, 3, -3, 3, 0] : 0,
      }}
      transition={{
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 2, repeat: focusedField === 'email' ? Infinity : 0, ease: "easeInOut" }
      }}
    >
      <svg width="128" height="144" viewBox="0 0 128 144" fill="none">
        {/* Cuerpo del pingüino - forma ovalada */}
        <motion.ellipse
          cx="64"
          cy="70"
          rx="35"
          ry="45"
          fill="#0c4a6e"
          stroke="#0c4a6e"
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />

        {/* Barriga blanca */}
        <motion.ellipse
          cx="64"
          cy="75"
          rx="22"
          ry="32"
          fill="#e0f2fe"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        />

        {/* Cara blanca */}
        <motion.ellipse
          cx="64"
          cy="48"
          rx="25"
          ry="22"
          fill="#e0f2fe"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
        />

        {/* Ojos */}
        {showPassword && focusedField === 'password' ? (
          // Aletas tapando los ojos
          <>
            <motion.ellipse
              cx="52"
              cy="48"
              rx="12"
              ry="8"
              fill="#0c4a6e"
              stroke="#0c4a6e"
              strokeWidth="2.5"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <motion.ellipse
              cx="76"
              cy="48"
              rx="12"
              ry="8"
              fill="#0c4a6e"
              stroke="#0c4a6e"
              strokeWidth="2.5"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </>
        ) : (
          // Ojos normales - estilo Hora de Aventura
          <motion.g
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          >
            <motion.g
              animate={{
                x: focusedField === 'email' ? [0, -2, 2, -2, 2, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: focusedField === 'email' ? Infinity : 0,
                repeatDelay: 0.5,
                ease: "easeInOut"
              }}
            >
              {/* Ojo izquierdo */}
              <ellipse cx="52" cy="48" rx="6" ry="8" fill="#0c4a6e" />
              <circle cx="54" cy="46" r="2" fill="white" />
              
              {/* Ojo derecho */}
              <ellipse cx="76" cy="48" rx="6" ry="8" fill="#0c4a6e" />
              <circle cx="78" cy="46" r="2" fill="white" />
            </motion.g>
          </motion.g>
        )}

        {/* Pico naranja */}
        <motion.path
          d="M 64 54 L 72 58 L 64 60 Z"
          fill="#fb923c"
          stroke="#ea580c"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: focusedField === 'email' ? [0, -5, 5, 0] : 0,
          }}
          transition={{ 
            scale: { delay: 0.2, type: "spring" },
            rotate: { duration: 0.5, repeat: focusedField === 'email' ? Infinity : 0, repeatDelay: 1.5 }
          }}
          style={{ transformOrigin: "64px 57px" }}
        />

        {/* Aletas/Alas */}
        <motion.ellipse
          cx="32"
          cy="70"
          rx="8"
          ry="25"
          fill="#0c4a6e"
          stroke="#0c4a6e"
          strokeWidth="2.5"
          initial={{ rotate: 0 }}
          animate={{
            rotate: focusedField === 'email' ? [0, -15, 15, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: focusedField === 'email' ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "32px 70px" }}
        />
        <motion.ellipse
          cx="96"
          cy="70"
          rx="8"
          ry="25"
          fill="#0c4a6e"
          stroke="#0c4a6e"
          strokeWidth="2.5"
          initial={{ rotate: 0 }}
          animate={{
            rotate: focusedField === 'email' ? [0, 15, -15, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: focusedField === 'email' ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "96px 70px" }}
        />

        {/* Patas naranjas */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, type: "spring" }}
        >
          {/* Pata izquierda */}
          <ellipse cx="52" cy="118" rx="10" ry="6" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
          {/* Dedos */}
          <line x1="52" y1="118" x2="48" y2="124" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="52" y1="118" x2="52" y2="125" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="52" y1="118" x2="56" y2="124" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          
          {/* Pata derecha */}
          <ellipse cx="76" cy="118" rx="10" ry="6" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
          {/* Dedos */}
          <line x1="76" y1="118" x2="72" y2="124" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="118" x2="76" y2="125" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="118" x2="80" y2="124" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Mejillas rosadas */}
        <motion.circle
          cx="38"
          cy="55"
          r="5"
          fill="#fda4af"
          opacity="0.5"
          animate={{
            opacity: focusedField ? [0.5, 0.7, 0.5] : 0.5,
            scale: focusedField === 'email' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="90"
          cy="55"
          r="5"
          fill="#fda4af"
          opacity="0.5"
          animate={{
            opacity: focusedField ? [0.5, 0.7, 0.5] : 0.5,
            scale: focusedField === 'email' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
}