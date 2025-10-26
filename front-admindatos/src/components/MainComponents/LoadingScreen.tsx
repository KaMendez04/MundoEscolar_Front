import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    onLoadingComplete?: () => void;
    duration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    onLoadingComplete,
    duration = 3000
}) => {
    const [isExiting, setIsExiting] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const contentTimer = setTimeout(() => {
            setShowContent(true);
        }, 300);

        const mainTimer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                onLoadingComplete?.();
            }, 1500);
        }, duration);

        return () => {
            clearTimeout(contentTimer);
            clearTimeout(mainTimer);
            window.removeEventListener('resize', checkMobile);
        };
    }, [onLoadingComplete, duration]);

    // Variantes de animación para el fondo
    const backgroundVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1
        }
    };

    // Variantes para el logo - entrada elegante desde el fondo
    const logoVariants = {
        hidden: {
            opacity: 0,
            y: isMobile ? 60 : 100,
            scale: 0.7,
            filter: "blur(20px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
        },
        floating: {
            y: isMobile ? [-8, 0] : [-12, 0],
            scale: [1, 1.01],
        }
    };

    // Variantes para el texto - entrada suave con blur
    const textVariants = {
        hidden: {
            opacity: 0,
            y: isMobile ? 20 : 30,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
        }
    };

    // Variantes para los dots - entrada escalonada
    const dotsContainerVariants = {
        hidden: {
            opacity: 0,
            y: isMobile ? 10 : 15,
            filter: "blur(4px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
        }
    };

    const dotVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: [0.6, 1, 0.6],
            y: [0, isMobile ? -4 : -8, 0]
        }
    };

    const getBackgroundSize = () => {
        if (isMobile) {
            return { width: '350px', height: '350px' };
        }
        return { width: '600px', height: '600px' };
    };

    const backgroundSize = getBackgroundSize();

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{
                        opacity: 0,
                        scale: 0.98,
                        filter: "blur(4px)",
                        transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 50,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
                    }}
                >
                    {/* Fondo animado */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            variants={backgroundVariants}
                            initial="hidden"
                            animate={showContent ? "visible" : "hidden"}
                            transition={{
                                duration: 2,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            style={{
                                width: backgroundSize.width,
                                height: backgroundSize.height,
                                background: 'radial-gradient(circle, rgba(156, 163, 175, 0.08) 0%, rgba(156, 163, 175, 0.02) 40%, transparent 70%)',
                                borderRadius: '50%',
                            }}
                        >
                            <motion.div
                                animate={{
                                    y: isMobile ? [-8, 0] : [-15, 0],
                                    scale: [1, 1.02],
                                    rotate: [0, isMobile ? 1 : 2],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                }}
                            />
                        </motion.div>
                    </div>

                    <div style={{
                        position: 'relative',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: isMobile ? '0 1rem' : '0',
                    }}>
                        {/* Logo */}
                        <motion.div
                            variants={logoVariants}
                            initial="hidden"
                            animate={showContent ? "visible" : "hidden"}
                            style={{
                                position: 'relative',
                                marginBottom: isMobile ? '0.375rem' : '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: isMobile ? '1rem' : '1.5rem',
                            }}
                        >
                            <motion.div
                                animate={showContent ? logoVariants.floating : {}}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                }}
                            >
                                <img
                                    src="/LogoMundoEscolar.png"
                                    alt="Mundo Escolar Logo"
                                    style={{
                                        width: isMobile ? '160px' : '240px',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))',
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Texto del título */}
                        <motion.div
                            variants={textVariants}
                            initial="hidden"
                            animate={showContent ? "visible" : "hidden"}
                            transition={{
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.4,
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: isMobile ? '0.25rem' : '0.375rem',
                                marginBottom: isMobile ? '1rem' : '1.5rem',
                            }}
                        >
                            <div style={{
                                fontSize: isMobile ? '0.875rem' : '1.125rem',
                                fontWeight: '500',
                                color: '#6b7280',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}>
                                Librería y Papelería
                            </div>
                            <div style={{
                                fontSize: isMobile ? '2rem' : '3rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                letterSpacing: '-0.025em',
                                textAlign: 'center',
                            }}>
                                Mundo Escolar
                            </div>
                        </motion.div>

                        {/* Indicadores de carga animados */}
                        <motion.div
                            variants={dotsContainerVariants}
                            initial="hidden"
                            animate={showContent ? "visible" : "hidden"}
                            transition={{
                                duration: 0.7,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.6,
                                staggerChildren: 0.12,
                            }}
                            style={{
                                display: 'flex',
                                gap: isMobile ? '0.375rem' : '0.5rem',
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    variants={dotVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{
                                        duration: 1.4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.2,
                                    }}
                                    style={{
                                        width: isMobile ? '6px' : '8px',
                                        height: isMobile ? '6px' : '8px',
                                        backgroundColor: '#9ca3af',
                                        borderRadius: '50%',
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;