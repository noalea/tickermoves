import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

const styles = StyleSheet.create({
  component: {
    borderRadius: 10,
    borderWidth: 4,
    padding: 20,
    width: '90%',
    marginLeft: '5%',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -10,
    marginBottom: 10,
  },
  tickers: {
    textTransform: 'uppercase',
  },
  link: {
    marginTop: -10,
    color: Colors.links,
  },
});

export default styles;
