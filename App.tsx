import * as React from 'react';
import {Button, SafeAreaView, ScrollView, View} from 'react-native';
import Reanimated, {
  LayoutAnimation,
  LayoutAnimationsValues,
  useAnimatedScrollHandler,
  withSpring,
} from 'react-native-reanimated';

const AnimatedScrollView = Reanimated.createAnimatedComponent(ScrollView);

const BAR_SPRING_PHYSICS = {
  mass: 10,
  damping: 100,
  stiffness: 200,
};

interface ThingProps {
  selected: boolean;
}

function Thing({selected}: ThingProps) {
  const height = selected ? 40 : 8;
  const style = React.useMemo(
    () => ({
      backgroundColor: 'black',
      width: 50,
      height,
      marginTop: 50 + (height / 2) * -1,
    }),
    [height],
  );
  const layout = React.useCallback(
    (values: LayoutAnimationsValues): LayoutAnimation => {
      'worklet';
      return {
        animations: {
          originY: withSpring(values.targetOriginY, BAR_SPRING_PHYSICS),
          originX: withSpring(values.targetOriginX, BAR_SPRING_PHYSICS),
          height: withSpring(values.targetHeight, BAR_SPRING_PHYSICS),
        },
        initialValues: {
          height: values.currentHeight,
          originY: values.currentOriginY,
          originX: values.currentOriginX,
        },
      };
    },
    [],
  );

  return (
    <View
      style={{
        backgroundColor: selected ? 'blue' : 'red',
        width: '100%',
        height: 100,
      }}>
      <Reanimated.View style={style} layout={layout} />
    </View>
  );
}

function WeirdScrollView({foo}: {foo?: string}) {
  const handlers = useAnimatedScrollHandler({
    onScroll: () => {
      'worklet';
    },
  });

  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.scrollTo({
      x: 0,
      y: 234,
    });
  }, [foo]);

  return (
    <AnimatedScrollView
      ref={ref}
      contentOffset={{x: 0, y: 234}}
      onScroll={handlers}>
      <View style={{backgroundColor: 'black', width: 10, height: 2000}} />
    </AnimatedScrollView>
  );
}

const uiManager = global?.nativeFabricUIManager ? 'Fabric' : 'Paper';

export default function HomeScreen() {
  const [selected, setSelected] = React.useState(false);

  function toggle() {
    setSelected(prev => !prev);
  }

  // Pass key to WeirdScrollView: breaks
  // Pass foo to WeirdScrollView: works
  return (
    <SafeAreaView>
      <Button onPress={toggle} title={`Toggle (${uiManager})`} />
      <Thing selected={selected} />
      <WeirdScrollView key={selected ? '1' : '2'} />
    </SafeAreaView>
  );
}
