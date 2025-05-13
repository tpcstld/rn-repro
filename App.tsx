import * as React from 'react';
import {
  Button,
  findNodeHandle,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
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

function WeirdScrollView() {
  const handlers = useAnimatedScrollHandler({
    onScroll: event => {
      'worklet';
      console.log('htht - scroll - weird', event);
    },
  });

  const ref = React.useRef(null);

  // React.useEffect(() => {
  //   const viewTag = findNodeHandle(ref.current as any);
  //   console.log('htht - going', handlers.workletEventHandler, viewTag);
  //   handlers.workletEventHandler.registerForEvents(viewTag as number);

  //   return () => {
  //     handlers.workletEventHandler.unregisterFromEvents(viewTag);
  //   };
  // }, [handlers.workletEventHandler]);

  return (
    <AnimatedScrollView
      ref={ref}
      contentOffset={{x: 0, y: 234}}
      onScroll={handlers}
    />
  );
}

// function WeirderScrollView() {
//   const ref = React.useRef(null);

//   React.useEffect(() => {
//     const worklet = new WorkletEventHandler(
//       (event: ReanimatedEvent<NativeSyntheticEvent<NativeScrollEvent>>) => {
//         'worklet';
//         console.log('htht - scroll - weirder');
//       },
//       ['onScroll'],
//     );
//     const viewTag = findNodeHandle(ref.current as any);
//     worklet.registerForEvents(viewTag as number);

//     return () => {
//       worklet.unregisterFromEvents(viewTag as number);
//     };
//   }, []);

//   return <ScrollView ref={ref} contentOffset={{x: 0, y: 123}} />;
// }

export default function HomeScreen() {
  const [firstSelected, setFirstSelected] = React.useState(false);

  function toggle() {
    setFirstSelected(prev => !prev);
  }
  // <DebugFastList key={firstSelected ? '1' : '2'} sections={[0]} />
  // <WeirdScrollView key={firstSelected ? '1' : '2'}/>

  return (
    <SafeAreaView>
      <Button onPress={toggle} title="Toggle" />
      <Thing selected={firstSelected} />
      <Thing selected={!firstSelected} />
      <WeirdScrollView key={firstSelected ? '1' : '2'} />
    </SafeAreaView>
  );
}
