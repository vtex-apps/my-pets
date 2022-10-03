import React, { FunctionComponent } from 'react'

import PetPlaceholderPicture from './PetPlaceholderPicture'

import DogIcon from './icons/DogIcon'

const PictureRenderer = (props) => {


  return props.animal_type ? (
    <DogIcon />
  ) : (
    <PetPlaceholderPicture />
  )
}


export default PictureRenderer