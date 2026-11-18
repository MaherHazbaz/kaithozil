import { AppText, PrimaryButton, SecondaryButton, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { PhotoTile } from '../components/PhotoTile';
import { VoiceNoteCard } from '../components/VoiceNoteCard';
import { mediaCopy as copy } from '../copy';
import { MAX_JOB_PHOTOS, type JobPhoto, type PhotoSource, type VoiceNoteState } from '../jobMedia';

export type MediaScreenProps = {
  photos: readonly JobPhoto[];
  voiceNote: VoiceNoteState;
  onBack: () => void;
  onDone?: () => void;
  onRemovePhoto?: (id: string) => void;
  // Capture needs native modules that are not installed yet (expo-image-picker
  // for photos, expo-audio for the voice note), so the route leaves these unset.
  onAddPhoto?: (source: PhotoSource) => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPlayVoiceNote?: () => void;
  onDeleteVoiceNote?: () => void;
};

/** Customer · Photos and voice note (design/source/Media.dc.html). */
export function MediaScreen({
  photos,
  voiceNote,
  onBack,
  onDone,
  onRemovePhoto,
  onAddPhoto,
  onStartRecording,
  onStopRecording,
  onPlayVoiceNote,
  onDeleteVoiceNote,
}: MediaScreenProps) {
  const full = photos.length >= MAX_JOB_PHOTOS;
  // Always three squares: the photos first, then dashed "Add" tiles.
  const tiles = Array.from({ length: MAX_JOB_PHOTOS }, (_, index) => photos[index] ?? null);

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      footer={<PrimaryButton label={copy.done} onPress={onDone} testID="media-done" />}
    >
      <View style={styles.photosHeading}>
        <AppText size={14} weight={800} accessibilityRole="header">
          {copy.photosHeading}
          <AppText weight={500} color={color.muted}>
            {copy.photosHeadingTamil}
          </AppText>
        </AppText>
        <AppText size={12} color={color.muted} testID="media-photo-count">
          {copy.photoCount(photos.length)}
        </AppText>
      </View>

      <View style={styles.grid}>
        {tiles.map((photo, index) => (
          <PhotoTile
            key={photo?.id ?? `empty-${index}`}
            photo={photo}
            position={index + 1}
            onRemove={photo ? () => onRemovePhoto?.(photo.id) : undefined}
            // QUESTION for the owner: the design's "Add" tile does not say
            // camera or gallery. It opens the gallery here.
            onAdd={() => onAddPhoto?.('gallery')}
            testID={`media-photo-${index + 1}`}
          />
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.takePhoto}
            icon="camera"
            disabled={full}
            onPress={() => onAddPhoto?.('camera')}
            testID="media-take-photo"
          />
        </View>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.fromGallery}
            icon="image"
            disabled={full}
            onPress={() => onAddPhoto?.('gallery')}
            testID="media-gallery"
          />
        </View>
      </View>

      <AppText size={12} color={color.muted}>
        {copy.photosHint}
      </AppText>

      <View style={styles.divider} />

      <AppText size={14} weight={800} accessibilityRole="header">
        {copy.voiceHeading}
        <AppText weight={500} color={color.muted}>
          {copy.voiceHeadingTamil}
        </AppText>
      </AppText>

      <VoiceNoteCard
        voiceNote={voiceNote}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPlay={onPlayVoiceNote}
        onDelete={onDeleteVoiceNote}
      />

      <AppText size={12} color={color.muted} align="center">
        {copy.voiceHint}
      </AppText>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  photosHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // CSS `align-items: baseline`: the 14pt heading and 12pt count share a baseline.
    alignItems: 'baseline',
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: color.border,
  },
});
