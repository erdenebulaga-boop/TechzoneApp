import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors } from '../../styles';
import { spinWheelSegments } from '../../data/mockData';

type SpinWheelScreenProps = NativeStackNavigationProp<RootStackParamList, 'SpinWheel'>;

interface Props {
  navigation: SpinWheelScreenProps;
}

const SEGMENT_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
];

export const SpinWheelScreen: React.FC<Props> = ({ navigation }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRemaining, setSpinRemaining] = useState(1);
  const [prizeHistory, setPrizeHistory] = useState<typeof spinWheelSegments>([]);
  const rotateValue = useRef(new Animated.Value(0)).current;

  const handleSpin = () => {
    if (isSpinning || spinRemaining === 0) return;

    setIsSpinning(true);
    const randomPrize = Math.floor(Math.random() * spinWheelSegments.length);
    const randomRotation = Math.random() * 360;
    const finalRotation = 360 * 5 + (360 / spinWheelSegments.length) * randomPrize + randomRotation;

    Animated.timing(rotateValue, {
      toValue: finalRotation,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setIsSpinning(false);
      setSpinRemaining(0);
      
      const prize = spinWheelSegments[randomPrize];
      setPrizeHistory([prize, ...prizeHistory]);

      Alert.alert('Congratulations!', `You won ${prize.points} points!\n${prize.name}`, [
        { text: 'OK', onPress: () => {} },
      ]);
    });
  };

  const spin = rotateValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Spin</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Spin Wheel Container */}
        <View style={styles.wheelContainer}>
          <View style={styles.wheelPointer} />
          <Animated.View
            style={[
              styles.wheel,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            {spinWheelSegments.map((segment, index) => {
              const angle = (index / spinWheelSegments.length) * 360;
              return (
                <View
                  key={index}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                      transform: [
                        { rotate: `${angle}deg` },
                        { translateY: -75 },
                        { rotate: `${90 - angle}deg` },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.segmentPoints}>{segment.points}</Text>
                </View>
              );
            })}
          </Animated.View>
        </View>

        {/* Spin Info */}
        <View style={styles.spinInfo}>
          <Text style={styles.spinRemainingText}>
            {spinRemaining > 0
              ? `${spinRemaining} free spin${spinRemaining !== 1 ? 's' : ''} remaining`
              : 'Next spin in 24 hours'}
          </Text>
        </View>

        {/* Spin Button */}
        <TouchableOpacity
          style={[styles.spinButton, (isSpinning || spinRemaining === 0) && styles.spinButtonDisabled]}
          onPress={handleSpin}
          disabled={isSpinning || spinRemaining === 0}
        >
          <Text style={styles.spinButtonText}>
            {isSpinning ? 'SPINNING...' : 'SPIN!'}
          </Text>
        </TouchableOpacity>

        {/* Prize History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Prize History</Text>
          {prizeHistory.length === 0 ? (
            <Text style={styles.emptyHistory}>No spins yet. Start spinning to win!</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={prizeHistory}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.prizeItem}>
                  <Feather name="gift" size={28} color={colors.loyaltyPrimary} />
                  <View style={styles.prizeDetails}>
                    <Text style={styles.prizeName}>{item.name}</Text>
                    <Text style={styles.prizeTime}>Just now</Text>
                  </View>
                  <Text style={styles.prizePoints}>+{item.points} pts</Text>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    height: 280,
  },
  wheelPointer: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.accent,
    zIndex: 10,
  },
  wheel: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.loyaltyPrimary,
    backgroundColor: '#FFFFFF',
  },
  segment: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  segmentPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  spinInfo: {
    paddingHorizontal: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  spinRemainingText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  spinButton: {
    marginHorizontal: 20,
    backgroundColor: colors.loyaltyPrimary,
    borderRadius: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.loyaltyPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinButtonDisabled: {
    opacity: 0.5,
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  historySection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  emptyHistory: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  prizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.loyaltySecondary,
  },
  prizeIconContainer: {
    marginRight: 12,
  },
  prizeDetails: {
    flex: 1,
  },
  prizeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  prizeTime: {
    fontSize: 12,
    color: '#999999',
  },
  prizePoints: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  bottomSpacer: {
    height: 20,
  },
});
