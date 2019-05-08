# NativeScript Particle Emitter

[![Build Status](https://travis-ci.com/vakrilov/nativescript-particle-emitter.svg?branch=master)](https://travis-ci.com/vakrilov/nativescript-particle-emitter)

Particle emitter component for NativeScript.

![demo gif](https://media.giphy.com/media/KEkN5nXA79XJfG4QFQ/giphy.gif)

## Installation

Describe your plugin installation steps. Ideally it would be something like:

```javascript
tns plugin add nativescript-particle-emitter
```

## Usage 

Add your particle emitter Page from XML:
	
```XML
<Page xmlns="http://schemas.nativescript.org/tns.xsd"
  xmlns:pe="nativescript-particle-emitter">
  <GridLayout>
    <pe:ParticleEmitter isEmitting="true" />
  </GridLayout>
</Page>
```

or you can choose to pass in some configuration:

```XML
<Page xmlns="http://schemas.nativescript.org/tns.xsd"
  xmlns:pe="nativescript-particle-emitter">
  <GridLayout>
    <pe:ParticleEmitter
      isEmitting="true"
      showDebug="true"
      emitOriginX="150"
      emitOriginY="200" 
      emitOriginWidth="100"
      emitOriginHeight="100"
      particleDuration="1000"
      emitCount="4" 
      emitInterval="60"  
      emitDistance="120"  
      emitDistanceVariation="50"  
      emitAngle="90"  
      emitAngleVariation="45" 
      colorPalette="red, green, #0000FF" />
  </GridLayout>
</Page>
```

## Properties
    
| Property | Default | Description |
| --- | --- | --- |
| isEmitting | false | Controls wether the emitter is emitting |
| showDebug | false | Shows debug helpers |
| emitInterval | 50 | The interval used for emitting in milliseconds |
| emitCount | 5 | The number of particles on each emit |
| particleDuration | 800 | Lifespan of the particles in milliseconds |
| emitDistance | 80 | The base distance the particles will travel |
| emitDistanceVariation | 40 | Distance variation. Each particle will travel a random number in the range `[distance - variation, distance + variation]` |
| emitAngle | 0 | The angle (in degrees) at which particles are emitted |
| emitAngleVariation | 180 | Angle variation. Each particle will be emitted at a random angle in the range `[angle - variation, angle + variation]`  |
| emitOriginX | 0 | The X coordinate of the center of the emit box |
| emitOriginY | 0 | The X coordinate of the center of the emit box |
| emitOriginWidth | 1 | The width of the emit box |
| emitOriginHeight | 1 | The Height of the emit box |
| colorPalette | "blue" | The color palette used for particles. Colors should be comma-separated when defined in XML (ex. `"red, green, blue"`) |
    
## License

MIT License
