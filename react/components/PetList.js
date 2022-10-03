import React from 'react'
import { Box, Button, Card } from 'vtex.styleguide'
import PictureRenderer from './PetImage'
//import handles from '../code-block.global.css'
import { format, parseISO } from 'date-fns'
import './PetList.css'
import { useRuntime } from 'vtex.render-runtime'
import { injectIntl, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'petWrapper',
  'petCard',
  'petNameContainer',
  'petName',
  'petContentWrapper',
  'petImageContainer',
  'petAnimalPicture',
  'petDataContainer',
  'petType',
  'petBirthDate',
  'petBreed',
  'petSterylized',
  'petNotSterylized',
  'petWeight',
  'petWeightNumber',
  'petQuantity',
  'petQuantityNumber',
  'petActionsWrapper',
  'petFormEditButton'
]

const PetList = props => {
  const runtime = useRuntime()
  const formatDate = date => {
    let year = date.substring(0, 4)
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    let formattedDate = `${day}-${month}-${year}`
    return formattedDate
  }
  const handles = useCssHandles(CSS_HANDLES)
  const { intl } = props

  return (
    <div className={`${handles.petWrapper}`}>
      <div className={`${handles.petCard}`}>
        <div className={`${handles.petNameContainer}`}>
          <h4 className={`${handles.petName}`}>{props.pet.animal_name}</h4>
        </div>
        <div className={`${handles.petContentWrapper}`}>
          <div className={`${handles.petImageContainer}`}>
            {props.pet.animal_picture ? (
              <img
                className={`${handles.petAnimalPicture}`}
                src={`https://${runtime.account}.vtexcommercestable.com.br/api/dataentities/PE/documents/${props.pet.id}/animal_picture/attachments/${props.pet?.animal_picture}`}
              />
            ) : (
              <PictureRenderer />
            )}
          </div>
          <div className={`${handles.petDataContainer}`}>
            <p className={`${handles.petType}`}>
              {intl.formatMessage({ id: "store/mypets.myAnimalType" }, { pet: intl.formatMessage({ id: `store/mypets.${props.pet.animal_type.toLowerCase()}` }) })}
            </p>
            <p className={`${handles.petBirthDate}`}>
              {intl.formatMessage({ id: "store/mypets.dateOfBirth" }, { dob: format(parseISO(props.pet.animal_date_of_birth), 'dd/MM/yyyy') })}
            </p>
            {props.pet.breed && <p className={`${handles.petBreed}`}>
              {intl.formatMessage({ id: "store/mypets.race" })}:{' '}{props.pet.breed}
            </p>}
            {
            (props.pet.animal_type === 'fish' || props.pet.animal_type === 'bird')? null :
            props.pet.sterylized ? (
              <p className={`${handles.petSterylized}`}>
                <FormattedMessage id="store/mypets.sterilized" />
              </p>
            ) : (
              <p className={`${handles.petNotSterylized}`}>
                <FormattedMessage id="store/mypets.nonSterilized" />
              </p>
            )}
            {props.pet.weight > 0 && (
              <p className={`${handles.petWeight}`}>
                {intl.formatMessage({ id: "store/mypets.weight" })}:{' '}
                <span className={`${handles.petWeightNumber}`}>{props.pet.weight} kg</span>
              </p>
            )}
            {props.pet.quantity && (
              <h4 className={`${handles.petQuantity}`}>
                {intl.formatMessage({ id: "store/mypets.quantity" })}:{' '}
                <p className={`${handles.petQuantityNumber}`}>{props.pet.quantity}</p>
              </h4>
            )}
          </div>
        </div>
        <div className={`${handles.petActionsWrapper}`}>
          <button
            className={`${handles.petFormEditButton}`}
            onClick={() => props.onUpdatePet(props.pet)}>
            <FormattedMessage id="store/mypets.edit" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(PetList)
