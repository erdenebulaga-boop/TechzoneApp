import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';

interface SimpleSliderProps {
  minimumValue: number;
  maximumValue: number;
  value: number;
  step?: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: any;
}

const THUMB_SIZE = 24;

export const SimpleSlider: React.FC<SimpleSliderProps> = ({
  minimumValue,
  maximumValue,
  value,
  step = 1,
  onValueChange,
  minimumTrackTintColor = '#0EA5E9',
  maximumTrackTintColor = '#E5E7EB',
  thumbTintColor = '#0EA5E9',
  style,
}) => {
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(0);
  const trackX = useRef(0);

  const range = maximumValue - minimumValue;
  const ratio = range > 0 ? (value - minimumValue) / range : 0;

  const snapToStep = (val: number) => {
    if (step <= 0) return val;
    const stepped = Math.round((val - minimumValue) / step) * step + minimumValue;
    return Math.max(minimumValue, Math.min(maximumValue, stepped));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        if (trackWidth.current > 0) {
          const newRatio = Math.max(0, Math.min(1, x / trackWidth.current));
          const newValue = minimumValue + newRatio * range;
          onValueChange(snapToStep(newValue));
        }
      },
      onPanResponderMove: (evt) => {
        const pageX = evt.nativeEvent.pageX;
        if (trackWidth.current > 0) {
          const x = pageX - trackX.current;
          const newRatio = Math.max(0, Math.min(1, x / trackWidth.current));
          const newValue = minimumValue + newRatio * range;
          onValueChange(snapToStep(newValue));
        }
      },
    })
  ).current;

  return (
    <View
      style={[styles.container, style]}
      ref={trackRef}
      onLayout={(e) => {
        trackWidth.current = e.nativeEvent.layout.width;
        trackRef.current?.measureInWindow((x) => {
          trackX.current = x;
        });
      }}
      {...panResponder.panHandlers}
    >
      <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: minimumTrackTintColor,
              width: `${ratio * 100}%`,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbTintColor,
            left: `${ratio * 100}%`,
            marginLeft: -THUMB_SIZE / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: (40 - THUMB_SIZE) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default SimpleSlider;
