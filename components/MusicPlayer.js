import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/MusicPlayer.module.css";
import { BsArrowLeftCircle } from "react-icons/bs";
import { BsArrowRightCircle } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";

const MusicPlayer = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currTime, setCurrTime] = useState(0);

  const musicPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const seconds = Math.max(musicPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [musicPlayer?.current?.loadedmetadata, musicPlayer?.current?.readyState]);

  const secondsToMins = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const returnMins = mins < 10 ? `0${mins}` : `${mins}`;
    const secs = Math.floor(seconds - mins * 60);
    const returnedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return returnMins + ":" + returnedSecs;
  };

  const togglePlayPause = () => {
    const val = isPlay;
    setIsPlay(!val);

    if (!val) {
      musicPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      musicPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = musicPlayer.current.currentTime;
    setCurrTime(progressBar.current.value);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    musicPlayer.current.currentTime = progressBar.current.value;
    setCurrTime(progressBar.current.value);
  };

  const backTen = () => {
    progressBar.current.value = Number(progressBar.current.value - 10);
    changeRange();
  };
  const forwardTen = () => {
    progressBar.current.value = Number(progressBar.current.value) + 10;
    changeRange();
  };

  const restartMusic = () => {
    progressBar.current.value = 0;
    changeRange();
  }

  return (
    <div className={styles.musicplayer}>
      <audio
        ref={musicPlayer}
        src="/sample_music.mp3" //CHANGE the audio file name for a different track
        preload="metadata"
      ></audio>

      <button className={styles.skip} onClick={backTen}>
        <BsArrowLeftCircle />
      </button>

      <button className={styles.playback} onClick={togglePlayPause}>
        {isPlay &&
        progressBar.current.value != Math.floor(progressBar.current.max) ? (
          <FaPause />
        ) : (
          <FaPlay />
        )}
      </button>

      <button className={styles.skip} onClick={forwardTen}>
        <BsArrowRightCircle />
      </button>

      <div className={styles.timer}>{secondsToMins(currTime)}</div>
      <div>
        <input
          type="range"
          className={styles.progressbar}
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
      </div>

      <div className={styles.duration}>
        {duration && !isNaN(duration) && secondsToMins(duration)}
      </div>

      <button className={styles.restart} onClick={restartMusic}>
        <MdRestartAlt />
      </button>
    </div>
  );
};

export { MusicPlayer };
