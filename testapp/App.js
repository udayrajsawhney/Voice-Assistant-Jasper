import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  AppRegistry,
  TouchableHighlight,
  TextInput,
  ScrollView
} from 'react-native';

import io from 'socket.io-client';

// import SocketIO from 'react-native-socketio'

import Voice from 'react-native-voice';
import { Footer,Button, Container, Header, Content, Item, Input, Icon,List, ListItem,  } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends Component {
  render() {
    //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
    let leftSpacer = this.props.direction === 'left' ? null : <View style={{width: 70}}/>;
    let rightSpacer = this.props.direction === 'left' ? <View style={{width: 70}}/> : null;
    let bubbleStyles = this.props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
    let bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;
    return (
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            {leftSpacer}
            <View style={bubbleStyles}>
              <Text style={bubbleTextStyle}>
                {this.props.text}
              </Text>
            </View>
            {rightSpacer}
          </View>
      );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      voiceText: '',
      messages: [{
        text: 'How can I help you',
        direction: 'left'
      },
      {
        text: 'puka',
        direction: 'right'
      }]      
    };
    this.sendMsg = this.sendMsg.bind(this)
    this._startRecognizing = this._startRecognizing.bind(this);
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  
  this.socket = io.connect('http://192.168.43.140:4500', { transports: ['websocket'] });    
    
  
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  componentDidMount() {
    this.socket.on('reply', data => {
      console.log('checking')
      console.log('--->', data.message);
      // console.log(this.state.messages);
      // this.state.messages.push({ text: data.message, direction: 'left' })
      // console.log('fgfht',this.state.messages)
      // console.log('checking2')
      this.setState({ messages: [ ...this.state.messages, { text: data.message, direction: 'left' } ] })
    })
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: '√',
    });
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
      voiceText: e.value[0]
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value,
    });
  }

  async _startRecognizing(e) {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
  }

  sendMsg () {
    this.socket.emit('message', { msg: this.state.voiceText });
    this.setState({messages: [ ...this.state.messages, {
      text: this.state.voiceText,
      direction: 'right'
    } ]})
  }

  render() {
    // let messages = [];
    // this.state.messages.forEach(function(message, index) {
    //   messages.push(
    //       <MessageBubble key={index} direction={message.direction} text={message.text}/>
    //     );
    // });

    return (
      <View style={styles.container}>
      <Container>
        <Text style={styles.welcome}>
          Welcome to React Native Voice!
        </Text>
        <Text style={styles.instructions}>
          Press the button and start speaking.
        </Text>

        {/* msgs view */}

        <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
          {
            this.state.messages.map((message, index) => <MessageBubble key={index} direction={message.direction} text={message.text}/>)
          }
        </ScrollView>
      
        <View style={styles.inputContainer}>          
              <Input  style={styles.placeInput} onSubmitEditing={this.sendMsg} placeholder='Rounded Textbox' onChangeText={(text) => this.setState({voiceText: text})} value={this.state.voiceText}/>    
              <Button style={styles.placeButton} rounded success onSubmitEditing={text => this.sendMsg(text)} onPress={this._startRecognizing} >
                  <Icon name='mic' /> 
              </Button>
          </View>
       
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  inputContainer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 12,
   
  },
  placeInput: {
      width: "90%",
      borderWidth: 2,
      borderColor: '#FF5722',
      borderRadius: 20 ,
      padding: 10,
  },
  placeButton: {
    width: "16%",
    margin: 5
  },

  // msg bubble
  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection:'row',
    flex: 1
},

messageBubbleLeft: {
  backgroundColor: '#d5d8d4',
},

messageBubbleTextLeft: {
  color: 'black'
},

messageBubbleRight: {
  backgroundColor: '#66db30'
},

messageBubbleTextRight: {
  color: 'white'
},

messages: {
  flex: 1
},

});