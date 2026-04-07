import { StyleSheet, Text, View } from 'react-native';

export default function WordDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Word Detail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
