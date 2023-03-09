import React from 'react';
import Svg, {Path} from 'react-native-svg';

const IconClose = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} {...props}>
    <Path d="M0 0h24v24H0V0z" fill="none" />
    <Path
      fill={'#40484C'}
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
    />
  </Svg>
);

export default IconClose;
