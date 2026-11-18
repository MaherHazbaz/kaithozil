import { AppText, Gradient, Icon, Tappable, color, radius, shadow } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { mediaCopy as copy } from '../copy';
import { formatClipLength, useElapsedSeconds } from '../hooks/useElapsedSeconds';
import { MAX_VOICE_NOTE_SECONDS, type VoiceNoteState } from '../jobMedia';

export type VoiceNoteCardProps = {
  voiceNote: VoiceNoteState;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPlay?: () => void;
  onDelete?: () => void;
};

/** The voice-note card on Media.dc.html: idle, recording or recorded. */
export function VoiceNoteCard({
  voiceNote,
  onStartRecording,
  onStopRecording,
  onPlay,
  onDelete,
}: VoiceNoteCardProps) {
  return (
    <View style={styles.card}>
      {voiceNote.status === 'idle' ? <IdlePanel onStart={onStartRecording} /> : null}
      {voiceNote.status === 'recording' ? <RecordingPanel onStop={onStopRecording} /> : null}
      {voiceNote.status === 'recorded' ? (
        <RecordedPanel
          durationSeconds={voiceNote.durationSeconds}
          onPlay={onPlay}
          onRecordAgain={onStartRecording}
          onDelete={onDelete}
        />
      ) : null}
    </View>
  );
}

function IdlePanel({ onStart }: { onStart?: () => void }) {
  return (
    <>
      <Tappable
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={copy.startRecording}
        style={styles.recordButton}
        testID="media-record"
      >
        <Gradient name="goldButton" style={styles.recordFill}>
          <Icon name="mic" size={34} color={color.purpleDeep} />
        </Gradient>
      </Tappable>
      <AppText size={14} weight={700}>
        {copy.tapToRecord}
      </AppText>
    </>
  );
}

function RecordingPanel({ onStop }: { onStop?: () => void }) {
  // Mounted only while recording, so the clock starts at 0:00 each time. At
  // the limit it stops the recording, as "up to 60 seconds" promises.
  const seconds = useElapsedSeconds(MAX_VOICE_NOTE_SECONDS, onStop);
  return (
    <>
      <View style={styles.timerRow}>
        <View style={styles.recordingDot} />
        {/* Tabular figures keep the timer from shifting as the digits change. */}
        <AppText size={22} weight={800} style={styles.tabular} testID="media-timer">
          {formatClipLength(seconds)}
        </AppText>
      </View>
      <AppText size={12} color={color.muted}>
        {copy.recordingLimit}
      </AppText>
      <Tappable
        onPress={onStop}
        accessibilityRole="button"
        accessibilityLabel={copy.stop}
        style={styles.stopButton}
        testID="media-stop"
      >
        <Icon name="stop" size={16} color={color.white} />
        <AppText size={14} weight={700} color={color.white}>
          {copy.stop}
        </AppText>
      </Tappable>
    </>
  );
}

// The design's static waveform: 20 bars, heights in points.
const WAVE_BARS = [10, 18, 26, 14, 30, 22, 12, 28, 16, 24, 10, 20, 30, 14, 22, 18, 12, 26, 16, 10];

function RecordedPanel({
  durationSeconds,
  onPlay,
  onRecordAgain,
  onDelete,
}: {
  durationSeconds: number;
  onPlay?: () => void;
  onRecordAgain?: () => void;
  onDelete?: () => void;
}) {
  return (
    <>
      <View style={styles.playerRow}>
        <Tappable
          onPress={onPlay}
          accessibilityRole="button"
          accessibilityLabel={copy.play}
          style={styles.playButton}
          testID="media-play"
        >
          <Gradient name="button" style={styles.playFill}>
            <Icon name="play" size={20} color={color.white} />
          </Gradient>
        </Tappable>
        <View
          style={styles.wave}
          // Decoration only; the length beside it is what a listener needs.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {WAVE_BARS.map((height, index) => (
            <View key={index} style={[styles.bar, { height }]} />
          ))}
        </View>
        <AppText size={13} weight={700} color={color.muted} style={styles.tabular}>
          {formatClipLength(durationSeconds)}
        </AppText>
      </View>
      <View style={styles.actions}>
        <Tappable
          onPress={onRecordAgain}
          accessibilityRole="button"
          accessibilityLabel={copy.recordAgain}
          style={styles.action}
          testID="media-record-again"
        >
          <Icon name="rotateCcw" size={16} color={color.purple} />
          <AppText size={13} weight={700} color={color.purple}>
            {copy.recordAgain}
          </AppText>
        </Tappable>
        <Tappable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={copy.deleteRecording}
          style={styles.action}
          testID="media-delete"
        >
          <Icon name="trash" size={16} color={color.ink} />
          <AppText size={13} weight={700}>
            {copy.deleteRecording}
          </AppText>
        </Tappable>
      </View>
    </>
  );
}

const RECORD_SIZE = 80;
const PLAY_SIZE = 48;
const DOT_SIZE = 12;
const BAR_WIDTH = 4;

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.card,
    padding: 18,
    alignItems: 'center',
    gap: 12,
    boxShadow: shadow.card,
  },
  // Shadow on the outer view, gradient clipped to the circle inside it.
  recordButton: {
    width: RECORD_SIZE,
    height: RECORD_SIZE,
    borderRadius: RECORD_SIZE / 2,
    boxShadow: shadow.goldButton,
  },
  recordFill: {
    flex: 1,
    borderRadius: RECORD_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: color.recording,
  },
  tabular: { fontVariant: ['tabular-nums'] },
  stopButton: {
    height: 48,
    paddingHorizontal: 20,
    // 24 in the design = half the height: a pill.
    borderRadius: radius.pill,
    backgroundColor: color.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: PLAY_SIZE,
    height: PLAY_SIZE,
    borderRadius: PLAY_SIZE / 2,
    boxShadow: shadow.button,
  },
  playFill: {
    flex: 1,
    borderRadius: PLAY_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    flexGrow: 1,
    flexShrink: 1,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    overflow: 'hidden',
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    backgroundColor: color.purple,
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
    height: 44,
    borderRadius: radius.compactButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
