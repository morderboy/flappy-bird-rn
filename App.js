import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import Bird from './components/Bird'
import Obstacles from './components/Obstacles'

export default function App() {
  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height
  const birdLeft = screenWidth / 2
  const [birdBottom, setBirdBottom]= useState(screenHeight / 2)
  const [obstaclesLeft, setObstaclesLeft]= useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo]= useState(screenWidth + screenWidth/2 + 30)
  const [obstaclesNegHeight, setObstaclesNegHeight]= useState(0)
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo]= useState(0)
  const [isGameOver, setIsGameOver]= useState(false)
  const [score, setScore]= useState(0)
  const gravity = 3
  const birdPadding = 21
  let obstacleWidth = 60
  let obstacleHeight = 300
  let gap = 200
  let gameTimerId
  let obstaclesTimerId
  let obstaclesTimerIdTwo
  
  useEffect(() => {  
    if (birdBottom > 0 && !isGameOver) {
      console.log('gameTimerId')
      gameTimerId = setInterval(() => {
        setBirdBottom((birdBottom) => birdBottom - gravity);
      }, 30);
  
      return () => {
        clearInterval(gameTimerId);
      };
    } else {
      clearInterval(gameTimerId);
    }
  }, [birdBottom, gravity, isGameOver]);
  console.log('birdBottom')
  console.log(birdBottom)
  console.log('gravity')
  console.log(gravity)

  const jump = () => {
    if (!isGameOver && (birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50)
      console.log('jumped')
    }
  }

  useEffect(() => {
    if (obstaclesLeft > -60) {
      obstaclesTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesTimerId)
      }
    } else {
      setScore(score => score +1)
      setObstaclesLeft(screenWidth)
      setObstaclesNegHeight( - Math.random() * 100)
    }
  }, [obstaclesLeft])

  useEffect(() => {
    if (obstaclesLeftTwo > - 60) {
      obstaclesTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5)
      }, 30)
        return () => {
          clearInterval(obstaclesTimerIdTwo)
        }
      } else {
          setScore(score => score +1)
          setObstaclesLeftTwo(screenWidth)
          setObstaclesNegHeightTwo( - Math.random() * 100)
        }
  }, [obstaclesLeftTwo])

  useEffect(() => {
    console.log('obstaclesLeft')
    console.log(obstaclesLeft)
    console.log('screenWidth/2')
    console.log(screenWidth/2)
    console.log('obstaclesLeft > screenWidth/2')
    console.log(obstaclesLeft > screenWidth/2)
    if (
      ((birdBottom < (obstaclesNegHeight + obstacleHeight + birdPadding) ||
      birdBottom > (obstaclesNegHeight + obstacleHeight + gap - birdPadding)) &&
      (obstaclesLeft > screenWidth/2 - birdPadding && obstaclesLeft < screenWidth/2 + birdPadding )
      )
      || 
      ((birdBottom < (obstaclesNegHeightTwo + obstacleHeight + birdPadding) ||
      birdBottom > (obstaclesNegHeightTwo + obstacleHeight + gap - birdPadding)) &&
      (obstaclesLeftTwo > screenWidth/2 - birdPadding && obstaclesLeftTwo < screenWidth/2 + birdPadding )
      )
      ||
      (birdBottom <= 0 || birdBottom >= screenHeight)
      ) 
      {
        clearInterval(gameTimerId);
        clearInterval(obstaclesTimerId);
        clearInterval(obstaclesTimerIdTwo);
        console.log('game over')
        gameOver()
      }
  })

    const gameOver = () => {
      clearInterval(gameTimerId);
      clearInterval(obstaclesTimerId);
      clearInterval(obstaclesTimerIdTwo);
      setIsGameOver(true);
    }

    const handleRestart = () => {
      clearInterval(gameTimerId);
      clearInterval(obstaclesTimerId);
      clearInterval(obstaclesTimerIdTwo);
      setBirdBottom(screenHeight / 2);
      setObstaclesLeft(screenWidth);
      setObstaclesLeftTwo(screenWidth + screenWidth / 2 + 30);
      setObstaclesNegHeight(0);
      setObstaclesNegHeightTwo(0);
      setScore(0);
      setIsGameOver(false);
      gameTimerId = setInterval(() => {
        setBirdBottom((birdBottom) => birdBottom - gravity);
      }, 30);
    }

  return (
    <ImageBackground source={require('./images/background-image.png')} style={styles.background}>
      <TouchableWithoutFeedback onPress={isGameOver ? null : jump}>
        <View style={styles.container}>
          <Bird 
            birdBottom = {birdBottom} 
            birdLeft = {birdLeft}
          />
          <Obstacles 
            obstacleWidth = {obstacleWidth}
            obstacleHeight = {obstacleHeight}
            randomBottom = {obstaclesNegHeight}
            gap = {gap}
            obstaclesLeft = {obstaclesLeft}
          />
          <Obstacles 
            obstacleWidth = {obstacleWidth}
            obstacleHeight = {obstacleHeight}
            randomBottom = {obstaclesNegHeightTwo}
            gap = {gap}
            obstaclesLeft = {obstaclesLeftTwo}
          />

          {isGameOver && (
            <View style={styles.container}>
              <Text style={{
                position: 'absolute',
                left: screenWidth/4,
                bottom: screenHeight/2,
                fontSize: 30
              }}>Game over: {score}</Text>
              <TouchableWithoutFeedback onPress={handleRestart}>
                <View style={stylesRestart.restartButton}>
                  <Text style={stylesRestart.buttonText}>RESTART</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
})

const stylesRestart = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
