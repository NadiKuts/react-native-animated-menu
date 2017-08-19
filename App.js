import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  Text,
  Image,
  PanResponder,
  Animated,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Easing
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo';

import resolveAssetSource from 'resolveAssetSource';


const images = [
  {
    url: require('./assets/images/1.jpeg'),
    text: 'MOUNTAINS'
  },
  {
    url: require('./assets/images/2.jpeg'),
    text: 'TRAVEL'
  },
  {
    url: require('./assets/images/3.jpeg'),
    text: 'ROAD'
  },
  {
    url: require('./assets/images/4.jpg'),
    text: 'TRAVEL'
  }
]


export default class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      viewWidth: Dimensions.get('window').width,
      viewHeight: Dimensions.get('window').height,

      imageWidth: Dimensions.get('window').width * 0.8,

      animatedContentScaleX: new Animated.Value(1),
      animatedContentScaleY: new Animated.Value(1),

      animatedTopMenuMargin: new Animated.Value(-Dimensions.get('window').height),

      activeMenuItem: [ [true, false, false], [false,false, false], [false, false,false]],
      imageSizeCoef: 0.8
    };

    this.getImgHeight = this.getImgHeight.bind(this);
    this.openTopMenu = this.openTopMenu.bind(this);
    this.closeTopMenu = this.closeTopMenu.bind(this);
    this.makeActiveItem = this.makeActiveItem.bind(this);
  }

  openTopMenu(){
    Animated.parallel([
      Animated.timing(
        this.state.animatedContentScaleY,
        {
          toValue: 0.8,
          easing: Easing.cubic,
          duration: 500
        }),
        Animated.timing(
          this.state.animatedContentScaleX,
          {
            toValue: 0.8,
            easing: Easing.cubic,
            duration: 500
          }),
          Animated.timing(
            this.state.animatedTopMenuMargin,
            {
              toValue:  20,
              easing: Easing.cubic,
              duration: 500
            })
          ]).start()
        }

        closeTopMenu(){
          Animated.parallel([
            Animated.timing(
              this.state.animatedContentScaleY,
              {
                toValue: 1,
                easing: Easing.cubic,
                duration: 300
              }),
              Animated.timing(
                this.state.animatedContentScaleX,
                {
                  toValue: 1,
                  easing: Easing.cubic,
                  duration: 300
                }),
                Animated.timing(
                  this.state.animatedTopMenuMargin,
                  {
                    toValue:  -Dimensions.get('window').height,
                    easing: Easing.cubic,
                    duration: 300
                  })
                ]).start()
              }

              getImgHeight(img, coef) {
                let source = resolveAssetSource(img);
                const scaleFactor = (source.width / (this.state.viewWidth * this.state.imageSizeCoef ));
                const imageHeight = source.height / scaleFactor;

                return imageHeight;
              }

              getCardContainerHeight(img) {
                let source = resolveAssetSource(img);
                const scaleFactor = (source.width / this.state.viewWidth);
                const imageHeight = source.height / scaleFactor;

                return imageHeight;
              }

              makeActiveItem(row,column){
                let menuItemsTemp = this.state.activeMenuItem;
                for (let i = 0; i < 3; i++){
                  for(let j = 0; j < 3; j++){
                    menuItemsTemp[i][j] = false;
                  }
                }
                menuItemsTemp[row][column] = true;
                this.setState({activeMenuItem: menuItemsTemp});
              }

              renderTopMenu(){
                const rows = 3;
                const colums = 3;

                const menuLabels = [['FEED','TIMELINE','PROFILE'],['LIST','COMPOSE','STATS'],['GALLERY','CAPTURE','DISCOVER']];

                const topMenuItems = [];

                const activeMenuItemStyle = {
                  fontSize: 15,
                  fontFamily: 'sans-serif-medium',
                  color: 'white'
                }
                const menuItemStyle = {
                  fontSize: 14,
                  fontFamily: 'sans-serif-medium',
                  color: '#c4a1fc'
                }
                const menuRowStyle = {
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }

                for (let i = 0; i < rows; i++){
                  let menuRow = [];
                  for(let j = 0; j < colums; j++){
                    menuRow.push(
                      <TouchableHighlight key={j} onPress={() => this.makeActiveItem(i,j)}>
                        <Text style={this.state.activeMenuItem[i][j] ? activeMenuItemStyle : menuItemStyle}>{menuLabels[i][j]}</Text>
                      </TouchableHighlight>
                    )
                  }
                  topMenuItems.push(
                    <View key={i} style={menuRowStyle}>
                      {menuRow}
                    </View>
                  );
                }

                return topMenuItems;
              }

              render() {
                const profileImage = {
                  width: 50,
                  height: 50,
                  borderRadius: 50
                }

                return (
                  <LinearGradient  colors={['#B453FE', '#71A7ED']} style={styles.container}>
                    <Animated.View style={{flex: 1, marginTop: this.state.animatedTopMenuMargin}}>
                      <View style={styles.menuProfileStyle}>
                        <View style={styles.userProfileStyle}>
                          <Image style={profileImage} source={require('./assets/images/1.jpeg')}></Image>
                          <Text style={styles.userLabelStyle}>CARMEN RIVERA</Text>
                        </View>
                        <TouchableOpacity style={{marginRight: 15}} onPress={ ()=> this.closeTopMenu() }>
                          <Icon name='ios-close' size={40} color='white'/>
                        </TouchableOpacity>
                      </View>
                      <View style= {styles.menuContentStyle}>
                        {this.renderTopMenu()}
                        <View style={styles.logoutRowStyle}>
                          <Text style={styles.logoutLabelStyle}>LOGOUT</Text>
                        </View>
                      </View>
                    </Animated.View>

                    <Animated.View style={[styles.mainContentStyle,{transform:[{scaleX: this.state.animatedContentScaleX}]}]}>
                      <Animated.View style={[styles.headerContainerStyle,{transform:[{scaleY: this.state.animatedContentScaleX}]}]}>
                        <TouchableOpacity onPress={ ()=> this.openTopMenu() } >
                          <Icon name='ios-menu' size={27} color='black' style={{marginLeft: 20}} />
                        </TouchableOpacity>
                        <Text style={styles.titleLabelStyle}>GALLERY</Text>
                        <Icon name='ios-search' size={27} color='black'  style={{marginRight: 20}}/>
                      </Animated.View>

                      <Animated.View style={[styles.content, {transform:[{scaleY: this.state.animatedContentScaleY}] } ]}>
                        <ScrollView>
                          {images.map( (image,index) => {
                            return (
                              <Animated.View key={index} style={{ width: this.state.viewWidth, height: this.getCardContainerHeight(image.url), marginBottom: 30 }}>
                                <Animated.View style={[styles.imageContainerStyle, {width: this.state.imageWidth,height: this.getImgHeight(image.url)}]}>
                                  <Text style={styles.imageLabelStyle}>
                                    {image.text}
                                  </Text>
                                  <Icon name='ios-arrow-forward-outline' size={25} color='black' style={{marginBottom: 20, marginRight: 20}} />
                                </Animated.View>
                                <Animated.Image source ={image.url} style={[styles.imageStyle,{width: this.state.imageWidth,height: this.getImgHeight(image.url)}]}>
                                  <LinearGradient colors={['#CDFCDA', '#B5F5E3']} start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                                    style={styles.counterContainerStyle}>
                                    <Text style={styles.counterLabelStyle}>{index + 1}</Text>
                                  </LinearGradient>
                                </Animated.Image>
                              </Animated.View>
                            )
                          }
                        )}
                      </ScrollView>
                    </Animated.View>
                  </Animated.View>
                </LinearGradient>
              );
            }
          }


          const styles = StyleSheet.create({
            container: {
              flex: 1,
              backgroundColor: '#A76BFF'
            },
            content: {
              flex: 5
            },
            menuContentStyle: {
              flex: 4, justifyContent: 'space-around'
            },
            menuProfileStyle: {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            },
            userProfileStyle: {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: 15
            },
            userLabelStyle: {
              fontSize: 14,
              fontFamily: 'sans-serif-medium',
              color: 'white',
              marginLeft: 15
            },
            logoutRowStyle: {
              flex: 1.5,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            },
            logoutLabelStyle: {
              marginLeft: 35,
              fontSize: 14,
              fontFamily: 'sans-serif-medium',
              color: '#c4a1fc'
            },
            mainContentStyle: {
              flex: 1,
              backgroundColor: '#DCE4E7',
            },
            titleLabelStyle: {
              fontSize: 15,
              fontFamily: 'sans-serif-medium',
              color: 'black',
              fontWeight: 'bold'
            },
            headerContainerStyle: {
              flex: 1 ,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            imageContainerStyle: {
              position: 'absolute', top: 60, bottom: 0, left: 55, right: 0,
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            },
            imageLabelStyle: {
              marginBottom: 20,
              marginLeft: 20,
              fontSize: 15,
              fontFamily: 'sans-serif-light',
              color: 'black',
              fontWeight: 'bold'
            },
            imageStyle: {
              position: 'absolute',
              top: 0,
              left: 25,
            },
            counterContainerStyle: {
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            },
            counterLabelStyle: {
              fontSize: 15,
              fontFamily: 'sans-serif-medium',
              color: 'black'
            }
          });
