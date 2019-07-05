/* eslint-disable */
import classNames from 'classnames';
import format from 'format-duration';
import jsmediatags from 'jsmediatags';
import { get } from 'lodash';
import * as React from 'react';
import AudioSpectrum from 'react-audio-spectrum';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';

// Components
import Button from '@components/Button';

// Ducks
import { MEDIA_CONTENT_MODAL_ID } from '@views/Media/ducks';

// Services
import { closeModal } from '@services/modals';

// Style
import style from './Audio.scss';

type MediaContentAudioPropTypes = {
  currentTime: number,
  duration: number,
  handleClose: Function,
  handleLoad: Function,
  handleMute: Function,
  handlePlay: Function,
  handleTimeUpdate: Function,
  isMuted: boolean,
  isPlaying: boolean,
  mimetype: string,
  registerAudio: Function,
  tags: {
    artist: string,
    title: string,
  },
  url: string,
};

const MediaContentAudio = ({
  currentTime = 0,
  duration = 0,
  mimetype,
  tags,
  url,
  // Handlers
  handleClose,
  handleLoad,
  handleMute,
  handlePlay,
  handleTimeChange,
  handleTimeUpdate,
  // Registers
  registerAudio,
  // State
  isMuted,
  isPlaying,
}: MediaContentAudioPropTypes): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Header}>
      <div className={style.Icon}>
        <i className="fas fa-music" />
      </div>

      <div className={style.Info}>
        <div className={style.Title}>{get(tags, 'title', 'Untitled')}</div>
        <div className={style.Artist}>{get(tags, 'artist', 'Untitled')}</div>
      </div>
    </div>

    <div className={style.Progress}>
      <div className={style.Spectrum}>
        <AudioSpectrum
          audioId="audio"
          capColor={'red'}
          capHeight={0}
          id="audio-canvas"
          height={64}
          meterWidth={2}
          meterCount={512}
          meterColor={[
            { stop: 0, color: '#ffa882' },
            { stop: 0.5, color: '#ff5980' },
            { stop: 1, color: '#ff5980' },
          ]}
          gap={2}
          width={308}
        />
      </div>

      <div className={style.Bar}>
        <div
          className={style.Value}
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        <input
          className={style.Input}
          max={duration}
          onChange={handleTimeChange}
          type="range"
          value={currentTime}
        />
      </div>

      <div className={style.Duration}>
        <div>{format(currentTime * 1000)}</div>
        <div>{format(duration * 1000)}</div>
      </div>
    </div>

    <div className={style.Actions}>
      <Button
        className={style.Mute}
        icon={classNames('fas', {
          'fa-volume-slash': !!isMuted,
          'fa-volume-up': !isMuted,
        })}
        onClick={handleMute}
      />

      <Button
        className={style.Play}
        icon={classNames('fas', {
          'fa-pause': !!isPlaying,
          'fa-play': !isPlaying,
        })}
        onClick={handlePlay}
      />

      <Button
        className={style.Close}
        icon="far fa-times"
        onClick={handleClose}
      />
    </div>

    <audio
      className={style.Content}
      controls
      id="audio"
      onCanPlay={handleLoad}
      onEnded={handlePlay}
      onTimeUpdate={handleTimeUpdate}
      ref={registerAudio}
    >
      <source src={url} type={mimetype} />
    </audio>
  </div>
);

export default compose(
  connect(
    null,
    { closeModal },
  ),
  withState('currentTime', 'setCurrentTime', false),
  withState('duration', 'setDuration', false),
  withState('isMuted', 'setMuted', false),
  withState('isPlaying', 'setPlaying', false),
  withState('tags', 'setTags', {}),
  withHandlers(() => {
    let $audio;

    return {
      // Handlers
      handleClose: ({ closeModal }): Function => (): void =>
        closeModal(MEDIA_CONTENT_MODAL_ID),
      handleLoad: ({ setDuration }): Function => (
        event: SyntheticEvent,
      ): void => setDuration(event.target.duration),
      handleMute: ({ isMuted, setMuted }): Function => (): void => {
        if ($audio) {
          setMuted(!isMuted);
          $audio.muted = !isMuted;
        }
      },
      handleTimeChange: ({ setCurrentTime }): Function => (
        event: SyntheticEvent,
      ): void => {
        const currentTime: number = event.target.value;
        $audio.currentTime = currentTime;
        setCurrentTime(currentTime);
      },
      handleTimeUpdate: ({ setCurrentTime }): Function => (
        event: SyntheticEvent,
      ): void => setCurrentTime(event.target.currentTime),
      handlePlay: ({ isPlaying, setPlaying }) => (): void => {
        if ($audio) {
          setPlaying(!isPlaying);
          isPlaying ? $audio.pause() : $audio.play();
        }
      },
      // Registers
      registerAudio: (): Function => (node: HTMLElementAudio): void => {
        $audio = node;
      },
    };
  }),
  lifecycle({
    componentDidMount() {
      const { blob, setTags } = this.props;

      if (blob) {
        jsmediatags.read(blob, {
          // eslint-disable-next-line
          onError: console.error,
          onSuccess: ({ tags }) =>
            setTags({
              artist: get(tags, 'artist'),
              title: get(tags, 'title'),
            }),
        });
      }
    },
    componentWillUnmount() {
      const { url } = this.props;
      URL.revokeObjectURL(url);
    },
  }),
)(MediaContentAudio);
