import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
const RecordView = (props) => {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 650);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  function stopTimer() {
    setIsActive(false);
    setCounter(0);
    setSecond("00");
    setMinute("00");
    clearBlobUrl();
  }

  const { status, startRecording, stopRecording, clearBlobUrl, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
      echoCancellation: true,
    });
  console.log("audio blob", mediaBlobUrl);

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.mediaBlobUrl);
      reader.onload = () =>
        resolve({
          fileName: file.title,
          base64: reader.result,
        });
      reader.onerror = reject;
    });
  const handleRecord = () => {
    if (!isActive) {
      startRecording();
    } else {
      stopRecording();
      setIsActive(!isActive);
    }
    setIsActive(!isActive);
  };
  const onGenerate = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const audioFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });
    const formData = new FormData();

    formData.append("file", audioFile);
    for (var pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    // onSaveAudio(formData);
  };
  return (
    <div>
      <Header />
      <div className="app">
        <div className="audio-section">
          <h2>Speak Your Imagination Here !</h2>
          <div className="audio-display">
            {mediaBlobUrl && <video src={mediaBlobUrl} controls />}
          </div>
          <div className="audio-controls">
            <div className="audio-status">
              <span className="audio-case">{status.toLocaleUpperCase()}</span>
              <span> {minute}</span>
              <span>:</span>
              <span>{second}</span>
            </div>
            <div className="audio-btns">
              <button
                className={
                  isActive ? "btn audio-stop-btn" : "btn audio-start-btn"
                }
                onClick={handleRecord}
              >
                {isActive ? <span>Stop</span> : <span>Start</span>}
              </button>
              <button className="btn audio-clear-btn" onClick={stopTimer}>
                <span>Clear</span>
              </button>
            </div>
            <div className="image-action">
              <h2>Generate Your Awesome Image !</h2>
              <button className="btn image-gen-btn" onClick={onGenerate}>
                <span>Generate Now</span>
              </button>
            </div>
          </div>
        </div>
        <div className="image-section">
          <h2>You Have Generated An Awesome Image</h2>
          <div className="img-display">
            <img src="https://img.freepik.com/free-photo/beautiful-shot-crystal-clear-lake-snowy-mountain-base-during-sunny-day_181624-5459.jpg?w=2000"></img>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecordView;
