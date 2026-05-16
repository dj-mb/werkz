// Shared audio engine. One <audio> element, app-wide play/pause + volume +
// favorites + sleep timer. Persists current station + favorites to
// localStorage. Streams without CORS-friendly headers may not play in the
// browser; we still show buffering/playing UI for the wireframe demo.

function useRadio() {
  const audioRef = React.useRef(null);
  const [currentId, setCurrentId] = React.useState(() => localStorage.getItem('radio.current') || null);
  const [playing, setPlaying] = React.useState(false);
  const [buffering, setBuffering] = React.useState(false);
  const [volume, setVolume] = React.useState(() => {
    const v = parseFloat(localStorage.getItem('radio.volume'));
    return isNaN(v) ? 0.7 : v;
  });
  const [favorites, setFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('radio.favorites') || '[]'); } catch (e) { return []; }
  });
  const [sleepMin, setSleepMin] = React.useState(0); // 0 = off
  const [sleepRemaining, setSleepRemaining] = React.useState(0);

  // Single shared <audio> element.
  React.useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    a.crossOrigin = 'anonymous';
    audioRef.current = a;
    a.addEventListener('playing', () => { setPlaying(true); setBuffering(false); });
    a.addEventListener('pause', () => setPlaying(false));
    a.addEventListener('waiting', () => setBuffering(true));
    a.addEventListener('canplay', () => setBuffering(false));
    a.addEventListener('error', () => { setBuffering(false); setPlaying(false); });
    return () => { a.pause(); a.src = ''; };
  }, []);

  React.useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; localStorage.setItem('radio.volume', String(volume)); }, [volume]);
  React.useEffect(() => { localStorage.setItem('radio.favorites', JSON.stringify(favorites)); }, [favorites]);
  React.useEffect(() => { if (currentId) localStorage.setItem('radio.current', currentId); }, [currentId]);

  // Sleep timer countdown.
  React.useEffect(() => {
    if (!sleepMin) { setSleepRemaining(0); return; }
    setSleepRemaining(sleepMin * 60);
    const t = setInterval(() => {
      setSleepRemaining((s) => {
        if (s <= 1) {
          if (audioRef.current) audioRef.current.pause();
          setSleepMin(0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [sleepMin]);

  const play = React.useCallback((id) => {
    const station = STATIONS.find((s) => s.id === id);
    if (!station) return;
    setCurrentId(id);
    const a = audioRef.current;
    if (!a) return;
    if (station.stream) {
      setBuffering(true);
      a.src = station.stream;
      a.play().catch(() => { setBuffering(false); setPlaying(false); });
    } else {
      // Wireframe demo: simulate playback for stations without working streams.
      a.pause();
      a.removeAttribute('src');
      setBuffering(true);
      setTimeout(() => { setBuffering(false); setPlaying(true); }, 600);
    }
  }, []);

  const pause = React.useCallback(() => {
    const a = audioRef.current;
    if (a) a.pause();
    setPlaying(false);
  }, []);

  const togglePlay = React.useCallback((id) => {
    if (id && id !== currentId) { play(id); return; }
    if (playing) pause(); else if (currentId) play(currentId);
  }, [playing, currentId, play, pause]);

  const toggleFavorite = React.useCallback((id) => {
    setFavorites((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);
  }, []);

  const current = STATIONS.find((s) => s.id === currentId) || null;

  return {
    current, currentId, playing, buffering, volume, setVolume,
    favorites, toggleFavorite,
    sleepMin, setSleepMin, sleepRemaining,
    play, pause, togglePlay,
  };
}

// Mocked "now playing" metadata — varies by station for the wireframe.
const NOW_PLAYING = {
  knkx:    { song: 'Take Five',                  artist: 'Dave Brubeck Quartet' },
  king:    { song: 'Eine kleine Nachtmusik',     artist: 'W. A. Mozart' },
  jazz24:  { song: 'So What',                    artist: 'Miles Davis' },
  movin:   { song: 'Espresso',                   artist: 'Sabrina Carpenter' },
  hot:     { song: 'Not Like Us',                artist: 'Kendrick Lamar' },
  classic: { song: 'Clair de Lune',              artist: 'Claude Debussy' },
  kexp:    { song: 'Stranger',                   artist: 'Yves Tumor' },
  kuow:    { song: 'Morning Edition',            artist: 'NPR · live' },
  kbcs:    { song: 'Walking After Midnight',     artist: 'Patsy Cline' },
  kplu:    { song: 'One More Time',              artist: 'Daft Punk' },
  kzok:    { song: 'Black Dog',                  artist: 'Led Zeppelin' },
  kbks:    { song: 'Watermelon Sugar',           artist: 'Harry Styles' },
};

function getNowPlaying(id) {
  return NOW_PLAYING[id] || { song: '— · —', artist: 'station idle' };
}

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

Object.assign(window, { useRadio, NOW_PLAYING, getNowPlaying, fmtTime });
