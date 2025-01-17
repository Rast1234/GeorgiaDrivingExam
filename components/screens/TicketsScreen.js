import {useEffect, useState, React} from 'react';
import {View, ScrollView} from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {Answers} from '../Answers';
import Description from '../Description';
import DynamicImage from '../DynamicImage';
import {styles} from '../styles/styles.js';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Favorites from '../Favorites';
import useAsyncStorage from '../functions/useAsyncStorage';

export function TicketsScreen({route, navigation}) {
  const tickets = route.params.tickets;
  const start = route.params.start;
  const updatePosition = route.params.updatePosition;

  const [currentTicket, setCurrentTicket] = useState(start);
  const [ansPicked, setAnsPicked] = useState(null);
  let ticket = tickets[currentTicket];

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setText('');
  };
  const dialogSetTicket = () => {
    if (hasErrors()) {
      return;
    } else if (text !== '') {
      setCurrentTicket(text - 1);
    }
    hideDialog();
  };
  const [text, setText] = useState('');
  const hasErrors = () => {
    return (
      (text !== '' && Number(text) < 1) ||
      text > Number(tickets.length) ||
      /\D+/.test(text)
    );
  };

  const [position, setPosition] = updatePosition ? useAsyncStorage('position', 0) : [0, (_) => {}];

  const nextTicket = () => {
    setAnsPicked(null);
    if (currentTicket === tickets.length - 1) {
      return;
    } else {
      setCurrentTicket(i => i + 1);
    }
  };

  const prevTicket = () => {
    setAnsPicked(null);
    if (currentTicket === 0) {
      return;
    } else {
      setCurrentTicket(i => i - 1);
    }
  };

  const theme = useTheme();

  useEffect(() => {
    setPosition(tickets[currentTicket].num-1);

    navigation.setOptions({
      headerTitle: '№' + tickets[currentTicket].num,
      right: (
        <>
          <Favorites examTicketId={ticket.examTicketId} />
          <Description description={ticket.description} />
        </>
      ),
    });
  }, [currentTicket, navigation, ticket.description, tickets]);

  const gesture = Gesture.Pan()
    .onFinalize(e => {
      if (e.velocityX < -1000 && e.translationX < -120) {
        nextTicket();
      }
      if (e.velocityX > 1000 && e.translationX > 120) {
        prevTicket();
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingBottom: 10,
          backgroundColor: theme.colors.background,
        }}>
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
          {ticket.imgsrc && (
            //Question image
            <DynamicImage
              source={ticket.imgsrc}
              padding={10}
              style={styles.image}
            />
          )}
          <Text style={styles.question}>{ticket.question}</Text>
          <Answers
            answers={ticket.answers}
            rightAnswer={ticket.rightAnswer}
            ansPicked={ansPicked}
            setAnsPicked={setAnsPicked}
          />
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button onPress={showDialog} style={{marginLeft: '10%'}}>
            {tickets[currentTicket].num + '/' + tickets.length}
          </Button>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Введите номер билета:</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  autoFocus={true}
                  inputMode="numeric"
                  onSubmitEditing={dialogSetTicket}
                  value={text}
                  onChangeText={t => setText(t)}
                />
                <HelperText type="error" visible={hasErrors()}>
                  Enter number between 1-{tickets.length}
                </HelperText>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={dialogSetTicket}>Готово</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Button
            mode="contained"
            onPress={nextTicket}
            style={{marginRight: '6%'}}>
            Следующий билет
          </Button>
        </View>
      </View>
    </GestureDetector>
  );
}
