import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { COLORS, HP_WP } from '../../component/theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AudioRecording = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [start, setStart] = useState(false);


  const startRecording = async () => {
    setStart(true);
    try {
      const filePath = `${AudioUtils.DocumentDirectoryPath}/audio.wav`;
      await AudioRecorder.prepareRecordingAtPath(filePath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'wav',
      });
      await AudioRecorder.startRecording();
      console.warn(filePath);
      setIsRecording(true);
      setAudioPath(filePath);
      setStart(false);
    } catch (error) {
      setStart(false);
      console.log('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    await AudioRecorder.stopRecording();
    setIsRecording(false);
    setStart(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.micContainer}
        onLongPress={startRecording}
        onPressOut={stopRecording}
      >
        <FontAwesome5 name="microphone-alt" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

export default AudioRecording;

const styles = StyleSheet.create({
  middleLineContainer: {
    borderRightWidth: 1,
    borderColor: COLORS.gray,
    height: HP_WP.hp(3.5),
    marginHorizontal: 10,
  },
  micContainer: {
    width: HP_WP.wp(12),
    backgroundColor: COLORS.darkRed,
    height: HP_WP.hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});