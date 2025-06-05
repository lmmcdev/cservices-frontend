import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  Menu,
  MenuItem,
} from '@mui/material';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AudioVisualizer from './audioVisualizer'; // Ajusta la ruta si está en otra carpeta

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00b8a3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function TicketAudio({ audioUrl, title = 'Audio', status }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Detener la animación del visualizador cuando termina el audio
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleEnded = () => setIsPlaying(false);

    audioEl.addEventListener('ended', handleEnded);
    return () => {
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, []);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // rango 0.0–1.0
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [volumeHover, setVolumeHover] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Formatea segundos a mm:ss
  const formatTime = (sec) => {
    if (isNaN(sec)) return '00:00';
    const min = Math.floor(sec / 60);
    const secPart = Math.floor(sec % 60);
    return `${min.toString().padStart(2, '0')}:${secPart
      .toString()
      .padStart(2, '0')}`;
  };

  // Registrar duración y tiempo actual
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const onLoadedMetadata = () => setDuration(audioEl.duration);
    const onTimeUpdate = () => setCurrentTime(audioEl.currentTime);
    audioEl.addEventListener('loadedmetadata', onLoadedMetadata);
    audioEl.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audioEl.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioEl.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioUrl]);

  // Play / Pause
  const togglePlayPause = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      audioEl.play();
      setIsPlaying(true);
    }
  };

  // Retroceder 10s
  const handleReplay10 = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.currentTime = Math.max(0, audioEl.currentTime - 10);
  };

  // Avanzar 10s
  const handleForward10 = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.currentTime = Math.min(audioEl.duration, audioEl.currentTime + 10);
  };

  // Cambiar posición con slider
  const handleSeek = (event, value) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.currentTime = value;
    setCurrentTime(value);
  };

  // Silenciar / desilenciar
  const toggleMute = () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.muted = !audioEl.muted;
    setIsMuted(audioEl.muted);
  };

  // Cambiar volumen desde slider emergente
  const handleVolumeChange = (event, value) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const newVol = value / 100; // 0–100 → 0.0–1.0
    audioEl.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      audioEl.muted = true;
      setIsMuted(true);
    } else {
      audioEl.muted = false;
      setIsMuted(false);
    }
  };

  // Abrir menú
  const openMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Cerrar menú
  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  // Descargar audio
  const downloadAudio = async () => {
   try {
     const response = await fetch(audioUrl);
     const blob = await response.blob();
     const urlBlob = URL.createObjectURL(blob);

     const link = document.createElement('a');
     link.href = urlBlob;
     link.download = audioUrl.split('/').pop() || 'audio.mp3';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     URL.revokeObjectURL(urlBlob);
     closeMenu();
   } catch (err) {
     console.error('Error descargando el audio:', err);
     // Si falla, abrimos en una pestaña nueva como respaldo
     window.open(audioUrl, '_blank');
     closeMenu();
   }
 };

  // Copiar link al portapapeles
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(audioUrl);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    closeMenu();
  };

  //const [heights, setHeights] = useState([8, 8, 8, 8, 8]);

  // Fallback original si no hay audioUrl
  if (!audioUrl) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: '20px 25px 25px 30px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 24,
                borderRadius: 10,
                backgroundColor: statusColors[status]?.text || '#00a1ff',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: statusColors[status]?.text || '#00a1ff',
              }}
            >
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No audio file available.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Reproductor personalizado
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        {/* Título y barras animadas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          {/* Título a la izquierda */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 24,
                borderRadius: 10,
                backgroundColor: statusColors[status]?.text || '#00a1ff',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: statusColors[status]?.text || '#00a1ff',
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Onda animada a la derecha */}
  <AudioVisualizer isPlaying={isPlaying} />
</Box>

        {/* Barra de controles */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {/* Replay 10s */}
          <IconButton onClick={handleReplay10} size="small">
            <Replay10Icon sx={{ color: '#68748a' }} fontSize="small" />
          </IconButton>

          {/* Play/Pause */}
          <IconButton onClick={togglePlayPause} size="small">
            {isPlaying ? (
              <PauseCircleFilledIcon sx={{ color: '#111629', fontSize: 30 }} />
            ) : (
              <PlayCircleFilledIcon sx={{ color: '#111629', fontSize: 30 }} />
            )}
          </IconButton>

          {/* Forward 10s */}
          <IconButton onClick={handleForward10} size="small">
            <Forward10Icon sx={{ color: '#68748a' }} fontSize="small" />
          </IconButton>

          {/* Separador vertical */}
          <Box
            sx={{
              width: '1px',
              height: 24,
              bgcolor: '#eff1f6',
              mx: 1.5,
            }}
          />

          {/* Tiempo combinado */}
          <Typography
            variant="body2"
            sx={{ minWidth: '70px', textAlign: 'center', mr: 1, whiteSpace: 'nowrap'}}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>

          {/* Contenedor del slider de progreso con animación de flex */}
          <Box
            sx={{
              mx: 1,
              flex: volumeHover ? '1 1 50%' : '1 1 80%',
              transition: 'flex 0.3s ease',
              boxShadow: 'none',
              borderRadius: 0,
            }}
          >
            {/* Box intermedio para centrar y ajustar altura */}
            <Box
              sx={{
                ml: '20px',
                mr: '2px',
                display: 'flex',
                alignItems: 'center',
                height: '24px', // altura fija para alinear con el volumen
              }}
            >
              <Slider
                size="small"
                value={currentTime}
                max={duration}
                onChange={handleSeek}
                sx={{
                  width: '100%',
                  '&.MuiSlider-root': {
                    height: '24px',  // FORZAMOS altura del slider
                    padding: 0,      // Sin padding vertical extra
                  },
                  '& .MuiSlider-rail': {
                    bgcolor: '#E6E6E6',
                    height: 5, // mismo height que el slider de volumen
                  },
                  '& .MuiSlider-track': {
                    bgcolor: '#00a1ff',
                    height: 5,
                  },
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    bgcolor: '#00a1ff',
                    // Ya no necesitamos mt, el thumb se centra solo
                    '&:hover': { boxShadow: 'none' },
                    '&.Mui-active': { boxShadow: 'none' },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Volumen + slider de volumen (en flujo para hacer shrink) */}
          <Box
            onMouseEnter={() => setVolumeHover(true)}
            onMouseLeave={() => setVolumeHover(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 1,
              // Al hacer hover, fondo gris muy claro (#FAFAFA) y bordes ovalados:
              bgcolor: volumeHover ? '#FAFAFB' : 'transparent',
              borderRadius: volumeHover ? '999px' : 0,
              transition: 'background 0.2s ease, width 0.3s ease, padding 0.2s ease',
              // Espacio interno horizontal para separar ícono y slider del borde
              px: volumeHover ? '8px' : 0,
              // Altura fija para centrar el slider y el ícono verticalmente
              height: '36px',
            }}
          >
            {/* Contenedor del slider de volumen en flujo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: volumeHover ? '50px' : '0px',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                mr: volumeHover ? 1 : 0,
                // Sin color de fondo aquí (lo hereda el padre)
                bgcolor: 'transparent',
                boxShadow: 0,
                // Bordes ovalados para que encaje con el padre
                borderRadius: '999px',
                py: 0,
                // Ocupa toda la altura (36px) del padre
                height: '100%',
              }}
            >
              <Slider
                size="small"
                orientation="horizontal"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                sx={{
                  width: 'calc(100% - 8px)',
                  ml: '4px',
                  '&.MuiSlider-root': {
                    height: '100%',  // ocupa el alto completo (36px) del padre
                    padding: 0,      // sin padding interno
                  },
                  '& .MuiSlider-rail': {
                    bgcolor: '#E0E0E0',
                    height: 5,
                    borderRadius: 2,
                  },
                  '& .MuiSlider-track': {
                    bgcolor: '#68748A',
                    height: 5,
                    borderRadius: 2,
                  },
                  '& .MuiSlider-thumb': {
                    width: 4,
                    height: 12,
                    bgcolor: '#000000',
                    borderRadius: 2,   // bordes ligeramente redondeados
                    '&:hover': { boxShadow: 'none' },
                    '&.Mui-active': { boxShadow: 'none' },
                  },
                }}
              />
            </Box>

            {/* Icono de volumen */}
            <IconButton
              onClick={toggleMute}
              size="small"
              disableRipple
              sx={{
                p: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {isMuted || volume === 0 ? (
                <VolumeOffIcon sx={{ color: '#68748A', fontSize: 22 }} />
              ) : (
                <VolumeUpIcon sx={{ color: '#68748A', fontSize: 22 }} />
              )}
            </IconButton>

          </Box>

          {/* Menú de tres puntos */}
          <IconButton onClick={openMenu} size="small" sx={{ ml: 1 }}>
            <MoreVertIcon sx={{ color: '#68748a' }} fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={downloadAudio}>
              <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
              Download
            </MenuItem>
            <MenuItem onClick={copyLink}>
              <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
              Copy Link
            </MenuItem>
          </Menu>
        </Box>

        {/* Elemento de audio o mensaje de “no soportado” */}
        {audioError ? (
          <Typography color="error">
            Your browser does not support the audio element.
          </Typography>
        ) : (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            style={{ display: 'none' }}
            onError={() => setAudioError(true)}
          />
        )} 
      </CardContent>
    </Card>
  );
}
