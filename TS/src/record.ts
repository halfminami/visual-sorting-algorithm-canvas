import { videoType } from "./setting.js";

export function canvasRecord(
  c: HTMLCanvasElement,
  startBtn: HTMLButtonElement,
  stopBtn: HTMLButtonElement,
  downloadBtn: HTMLButtonElement,
  videoEl: HTMLVideoElement,
  mes: (str: string) => void = (str: string) => console.log(str)
) {
  const recorder = new MediaRecorder(c.captureStream());
  mes(`record canvas (${videoType})`);
  let chunk: Blob[] = [];

  recorder.addEventListener("dataavailable", (e) => {
    mes("dataavailable event!");
    chunk.push(e.data);
  });

  recorder.addEventListener("start", () => {
    mes("recording video!");
  });

  recorder.addEventListener("stop", () => {
    const videoBlob = new Blob(chunk, { type: videoType });
    const url = window.URL.createObjectURL(videoBlob);
    chunk = [];
    mes(`video recorded! (${videoBlob.size} bytes)`);
    videoEl.src = url;
  });

  startBtn.disabled = false;
  stopBtn.disabled = true;
  downloadBtn.disabled = true;

  startBtn.addEventListener("click", () => {
    recorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    downloadBtn.disabled = true;
  });
  stopBtn.addEventListener("click", () => {
    recorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    downloadBtn.disabled = false;
  });
  downloadBtn.addEventListener("click", () => {
    mes("download!");
    const a = document.createElement("a");
    a.href = videoEl.src;
    a.download = "sortVideo.webm";
    a.click();
    a.remove();
  });
}
