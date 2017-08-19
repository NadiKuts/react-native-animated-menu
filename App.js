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
      topViewHeight: Dimensions.get('window').height * 0.4,

      animatedContentScaleX: new Animated.Value(1),
      animatedContentScaleY: new Animated.Value(1),
      animatedContentPosition: new Animated.ValueXY({x: 0, y: 0}),

      animatedTopMenuMargin: new Animated.Value(-Dimensions.get('window').height),

      activeMenuItem: [ [true, false, false], [false,false, false], [false, false,false]],
      isSideMenuOpen: false,
      imageSizeCoef: 0.8
    };

    this.getImgHeight = this.getImgHeight.bind(this);
    this.openTopMenu = this.openTopMenu.bind(this);
    this.closeTopMenu = this.closeTopMenu.bind(this);
    this.makeActiveItem = this.makeActiveItem.bind(this);
  }

  openTopMenu(){
    this.setState({isSideMenuOpen: true})

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
                ]).start( () => {this.setState({isSideMenuOpen: false}) })
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
                    <View key={i} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
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
                    <StatusBar backgroundColor='white'/>

                    {this.state.isSideMenuOpen && (
                      <Animated.View style={{flex: 1, marginTop: this.state.animatedTopMenuMargin}}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 15}}>
                            <Image style={profileImage} source={require('./assets/images/1.jpeg')}></Image>
                            <Text style={{fontSize: 14,fontFamily: 'sans-serif-medium', color: 'white', marginLeft: 15}}>CARMEN RIVERA</Text>
                          </View>
                          <TouchableOpacity style={{marginRight: 15}} onPress={ ()=> this.closeTopMenu() }>
                            <Icon name='ios-close' size={40} color='white'/>
                          </TouchableOpacity>
                        </View>
                        <View style= {{flex: 4, justifyContent: 'space-around'}}>
                          {this.renderTopMenu()}
                          <View style={{flex: 1.5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text style={{marginLeft: 35,fontSize: 14, fontFamily: 'sans-serif-medium', color: '#c4a1fc'}}>LOGOUT</Text>
                          </View>
                        </View>
                      </Animated.View>
                    )}

                    <Animated.View style={{ flex: 1, backgroundColor: '#DCE4E7', transform:[{scaleX: this.state.animatedContentScaleX}]}}>

                      <Animated.View style={{flex: 1 , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',transform:[{scaleY: this.state.animatedContentScaleX}]}}>
                        <TouchableOpacity onPress={ ()=> this.openTopMenu() } >
                          <Icon name='ios-menu' size={27} color='black' style={{marginLeft: 20}} />
                        </TouchableOpacity>
                        <Text style={{fontSize: 15, fontFamily: 'sans-serif-medium', color: 'black', fontWeight: 'bold'}}>GALLERY</Text>
                        <Icon name='ios-search' size={27} color='black'  style={{marginRight: 20}}/>
                      </Animated.View>

                      <Animated.View style={[styles.content, {transform:[{scaleY: this.state.animatedContentScaleY}] } ]}>
                        <ScrollView>
                          {images.map( (image,index) => {
                            return (
                              <Animated.View key={index} style={{ width: this.state.viewWidth, height: this.getCardContainerHeight(image.url), marginBottom: 30 }}>
                                <Animated.View style={{
                                  position: 'absolute', top: 60, bottom: 0, left: 55, right: 0,
                                  backgroundColor: '#FFFFFF',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-end',
                                  width: this.state.imageWidth,
                                  height: this.getImgHeight(image.url)}}>
                                  <Text style={{marginBottom: 20, marginLeft: 20, fontSize: 15, fontFamily: 'sans-serif-light', color: 'black',  fontWeight: 'bold' }}>
                                    {image.text}
                                  </Text>
                                  <Icon name='ios-arrow-forward-outline' size={25} color='black' style={{marginBottom: 20, marginRight: 20}} />
                                </Animated.View>
                                <Animated.Image source ={image.url} style={{
                                  position: 'absolute', top: 0, left: 25,
                                  width: this.state.imageWidth,
                                  height: this.getImgHeight(image.url) }}>
                                  <LinearGradient colors={['#CDFCDA', '#B5F5E3']} start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                                     style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{ fontSize: 15, fontFamily: 'sans-serif-medium', color: 'black'}}>{index + 1}</Text>
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
            header: {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            },
            headerText: {
              fontSize: 25,
              fontFamily: 'sans-serif-light',
              color: 'black',
            },
            content: {
              flex: 5
            }
          });
