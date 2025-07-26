import * as React from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import {Freeze} from 'react-freeze';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const uiManager = global?.nativeFabricUIManager ? 'Fabric' : 'Paper';

const startingValue = 0;

export default function BackgroundOrForegroundApp() {
  const [freeze, setFreeze] = React.useState(false);
  const [thing, setThing] = React.useState(startingValue);

  const value = useSharedValue(thing);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginLeft: value.get(),
    };
  });

  function handleMove() {
    const newValue = value.get() === 0 ? 100 : 0;

    value.set(newValue);
    setThing(newValue);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Button title="Toggle" onPress={() => setFreeze(!freeze)} />
      <Button title="Move" onPress={handleMove} />

      <Text>Freeze: {freeze.toString()}</Text>
      <Text>Margin: {thing}</Text>
      <Text>Starting Margin: {startingValue}</Text>
      <Text>UI Manager: {uiManager}</Text>

      <Freeze freeze={freeze}>
        <Animated.View
          style={[
            {width: 200, height: 200, backgroundColor: 'red'},
            animatedStyle,
          ]}
        />
      </Freeze>
    </SafeAreaView>
  );
}
