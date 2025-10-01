(function () {
  "use strict";
  // 🎧 muestra y oculta el reproductor
  const toggleAudioBtn = document.getElementById("toggleAudioBtn");
  const audioContainer = document.getElementById("audio");

  toggleAudioBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Evita que el enlace recargue la página

    if (audioContainer.style.display === "none") {
      audioContainer.style.display = "block";
      toggleAudioBtn.textContent = "Ocultar reproductor";
    } else {
      audioContainer.style.display = "none";
      toggleAudioBtn.textContent = "Escuchar en lugar de leer";
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0; // Opcional: reinicia el audio
      }
    }
  });

  // 🎧 Elementos del reproductor
  const audio = document.getElementById("audioPlayer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const muteBtn = document.getElementById("muteBtn");
  const volumeSlider = document.getElementById("volumeSlider");
  const speedSelect = document.getElementById("speedSelect");
  const progressBar = document.getElementById("progressBar");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");
  const canvas = document.getElementById("audioVisualizer");

  // 🎨 Visualizador de audio
  let audioCtx, analyser, source, dataArray, bufferLength;
  if (canvas && audio) {
    const ctx = canvas.getContext("2d");

    function setupVisualizer() {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 256;

      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      draw();
    }

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = "#d9b3ff";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    audio.addEventListener("play", () => {
      if (!audioCtx) setupVisualizer();
      audioCtx.resume();
    });
  }

  // ⏱️ Formatear tiempo
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  }

  // 🎛️ Inicializar controles
  if (audio) {
    audio.addEventListener("loadedmetadata", function () {
      progressBar.max = Math.floor(audio.duration);
      duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", function () {
      progressBar.value = Math.floor(audio.currentTime);
      currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", function () {
      playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    });

    progressBar.addEventListener("input", function () {
      audio.currentTime = progressBar.value;
    });

    playPauseBtn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
      } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      }
    });

    muteBtn.addEventListener("click", function () {
      audio.muted = !audio.muted;
      muteBtn.innerHTML = audio.muted
        ? '<i class="bi bi-volume-mute-fill"></i>'
        : '<i class="bi bi-volume-up-fill"></i>';
    });

    volumeSlider.addEventListener("input", function () {
      audio.volume = volumeSlider.value;
      if (audio.volume === 0) {
        muteBtn.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
      } else if (audio.volume < 0.5) {
        muteBtn.innerHTML = '<i class="bi bi-volume-down-fill"></i>';
      } else {
        muteBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
      }
    });

    speedSelect.addEventListener("change", function () {
      audio.playbackRate = parseFloat(speedSelect.value);
    });
  }
})();
