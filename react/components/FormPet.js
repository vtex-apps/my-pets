import React, { useState, useEffect } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { Input } from 'vtex.styleguide'
import { Dropdown } from 'vtex.styleguide'
import { Button } from 'vtex.styleguide'
import { Box } from 'vtex.styleguide'
import { Card } from 'vtex.styleguide'
import { Spinner } from 'vtex.styleguide'
import { withApollo, compose, graphql } from 'react-apollo'
import createPetMutation from '../graphql/createPet.gql'
import deletePetMutation from '../graphql/deletePet.gql'
import userProfileQuery from '../graphql/userProfile.gql'
import GET_USER_EMAIL from '../graphql/getUserEmail.gql'
import orderFormQuery from '../graphql/orderForm.gql'
import getTokenQuery from '../graphql/getToken.gql'
import { formattedDate } from '../helpers'
import { Dropzone } from 'vtex.styleguide'
import { ModalDialog } from 'vtex.styleguide'

import PetPlaceholderPicture from './PetPlaceholderPicture'
//import DogIcon from './icons/DogIcon'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import axios from 'axios'
import { useRuntime } from 'vtex.render-runtime'
import './FormPet.css'
import DogIcon from './icons/Dog.svg'
import CatIcon from './icons/Cat.svg'
import BirdIcon from './icons/Bird.svg'
import HamsterIcon from './icons/Hamster.svg'
import RabbitIcon from './icons/Rabbit.svg'
import FishIcon from './icons/Fish.svg'
import { injectIntl, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

export const CSS_HANDLES = [
  "choosePetTypeContainer",
  "choosePetTypeTitleContainer",
  "choosePetTypeTitle",
  "choosePetTypeDescription",
  "overflowHiddenContainer",
  "yellowCurveFormContainer",
  "yellowCurveForm",
  "yellowCurveFormPath",
  "petTypeRow",
  "petTypeCardContainer",
  "petTypeWrapper",
  "petTypeIconContainer",
  "petTypeIcon",
  "petTypeTitleContainer",
  "petTypeTitle",
  "savingModalContainer",
  "savingModalTextContainer",
  "savingModalText",
  "deleteModalContainer",
  "deleteModalTextContainer",
  "deleteModalText",
  "petFormContainer",
  "insertPetDataTitleContainer",
  "insertPetDataTitle",
  "insertPetDataDescription",
  "yellowRotatedCurveContainer",
  "yellowRotatedCurve",
  "yellowRotatedCurvePath",
  "petTypeIconDecorationContainer",
  "petTypeIconDecorationBox",
  "petTypeIconDecoration",
  "innerPetFormContainer",
  "petFormControlType",
  "petFormControlLabelContainer",
  "petFormControlLabel",
  "petFormControlInputContainer",
  "petFormControlName",
  "petFormControlInput",
  "petFormControlBirthDate",
  "petBirthdayInputsContainer",
  "petBirthDateControl",
  "petFormControlBreed",
  "petSterylizedFormControl",
  "petSterylizedInputContainer",
  "petSterylizedLabelContainer",
  "petFormControlWeight",
  "petFormControlQuantity",
  "petImageUploadContainer",
  "petImageUploadDropzone",
  "petFormButtonsContainer",
  "petFormSaveButton",
  "petFormDeleteButton",
  "animalsBoxAndFormWrapper"
]

const FormPet = props => {
  let newPet = {
    animal_date_of_birth: new Date(),
    animal_name: '',
    animal_picture: '',
    picture_url: '',
    email: '',
    animal_type: '',
    breed: '',
    customer_id: '',
    id: null,
    quantity: 0,
    sterylized: false,
    weight: '',
  }
  const [pet, setPet] = useState(props.pet)
  const [loaded, setLoaded] = useState(false)
  const [modalSave, setModalSave] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [file, setFile] = useState(null)
  const [removeLoading, setRemoveLoading] = useState(false)
  const [removeError, setRemoveError] = useState(null)
  const [loadingSave, setLoadingSave] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const { intl } = props

  const renderAnimalOptions = () => {
    let options = [
      { value: 'dog', label: `${intl.formatMessage({ id: "store/mypets.dog" })}` },
      { value: 'cat', label: `${intl.formatMessage({ id: "store/mypets.cat" })}` },
      { value: 'fish', label: `${intl.formatMessage({ id: "store/mypets.fish" })}` },
      { value: 'bird', label: `${intl.formatMessage({ id: "store/mypets.bird" })}` },
      { value: 'rabbit', label: `${intl.formatMessage({ id: "store/mypets.rabbit" })}` },
      { value: 'hamster', label: `${intl.formatMessage({ id: "store/mypets.hamster" })}` },
    ]
    return options
  }

  const renderDayOptions = () => {
    let options = []
    for (let i = 1; i <= 31; i++) {
      // options.push(<option key={i} value={i}>{i}</option>)
      options.push({ value: i, label: i })
    }
    return options
  }

  const renderMonthOptions = () => {
    let options = [
      { value: '1', label: `${intl.formatMessage({ id: "store/mypets.Jan" })}` },
      { value: '2', label: `${intl.formatMessage({ id: "store/mypets.Feb" })}` },
      { value: '3', label: `${intl.formatMessage({ id: "store/mypets.Mar" })}` },
      { value: '4', label: `${intl.formatMessage({ id: "store/mypets.Apr" })}` },
      { value: '5', label: `${intl.formatMessage({ id: "store/mypets.May" })}` },
      { value: '6', label: `${intl.formatMessage({ id: "store/mypets.Jun" })}` },
      { value: '7', label: `${intl.formatMessage({ id: "store/mypets.Jul" })}` },
      { value: '8', label: `${intl.formatMessage({ id: "store/mypets.Aug" })}` },
      { value: '9', label: `${intl.formatMessage({ id: "store/mypets.Sep" })}` },
      { value: '10', label: `${intl.formatMessage({ id: "store/mypets.Oct" })}` },
      { value: '11', label: `${intl.formatMessage({ id: "store/mypets.Nov" })}` },
      { value: '12', label: `${intl.formatMessage({ id: "store/mypets.Dec" })}` },
    ]
    return options
  }

  const renderYearOptions = () => {
    const actualYear = new Date().getFullYear()
    let options = []
    for (let i = actualYear; i >= 2004; i--) {
      options.push({ value: i, label: i })
    }
    return options
  }

  const updatePetState = (pet, event) => ({
    updatePetName: function() {
      let newPet = { ...pet }
      newPet.animal_name = event.target.value
      newPet.updated = true
      setPet(newPet)
    },
    updatePetAnimal: function() {
      let newPet = { ...pet }
      newPet.animal_type = event.target.value
      newPet.updated = true
      setPet(newPet)
    },
    updatePetDayOfBirth: function() {
      let newPet = { ...pet }
      let date = new Date(newPet.animal_date_of_birth)
      date.setDate(event.target.value)
      newPet.animal_date_of_birth = formattedDate(date)
      newPet.updated = true
      setPet(newPet)
    },
    updatePetMonthOfBirth: function() {
      let newPet = { ...pet }
      let date = new Date(newPet.animal_date_of_birth)
      date.setMonth(event.target.value - 1)
      newPet.animal_date_of_birth = formattedDate(date)
      newPet.updated = true
      setPet(newPet)
    },
    updatePetYearOfBirth: function() {
      let newPet = { ...pet }
      let date = new Date(newPet.animal_date_of_birth)
      date.setFullYear(event.target.value)
      newPet.animal_date_of_birth = formattedDate(date)
      newPet.updated = true
      setPet(newPet)
    },
    updatePetSterylization: function() {
      let newPet = { ...pet }
      newPet.sterylized = event.target.checked
      newPet.updated = true
      setPet(newPet)
    },
    updatePetBreed: function() {
      let newPet = { ...pet }
      newPet.breed = event.target.value
      newPet.updated = true
      setPet(newPet)
    },
    updatePetWeight: function() {
      let newPet = { ...pet }
      newPet.weight = event.target.value
      newPet.updated = true
      setPet(newPet)
    },
    updatePetQuantity: function() {
      let newPet = { ...pet }
      newPet.quantity = event.target.value
      newPet.updated = true
      setPet(newPet)
    },
    udpatePetPicture: function() {
      let newPet = { ...pet }
      newPet.animal_picture = event[0].name
      newPet.updated = true
      setPet(newPet)
    },
  })

  const removePet = async pet => {
    setRemoveLoading(true)
    try {
      const response = await props.deletePet({ variables: { id: pet.id } })
      setModalSave(false)
      if (response) {
        props.onDeletePet(pet.id)
      }
    } catch(error) {
      setRemoveError(error)
      setRemoveLoading(false)
    }
}

  const savePetInfo = async e => {
    setLoadingSave(true)
    const userProfileId = props.data.getSession?.profile.email || props.userEmail.profile.email
    setLoaded(false)
    const variables = {
      email: userProfileId,
      animal_date_of_birth: pet.animal_date_of_birth,
      animal_name: pet.animal_name,
      animal_picture: pet.animal_picture,
      animal_type: pet.animal_type,
      breed: pet.breed,
      customer_id: pet.customer_id,
      id: pet.id,
      quantity: pet.quantity > 0 ? pet.quantity : null,
      sterylized: pet.sterylized,
      weight: pet.weight,
    }
    const response = await props.client.mutate({
      mutation: createPetMutation,
      variables: variables,
    })

    if (props.mode == 'edit' || (props.mode == 'create' && file == null)) {
      setLoaded(true)
      setModalSave(false)
      setTimeout(() => {
        props.petReturn(response.data)
      }, 1000)
      setLoadingSave(false)
      return
    }

    let formData = new FormData()
    formData.append('file', file)
    let endpoint = ''
    if (pet.id) {
      endpoint = `api/dataentities/PE/documents/${pet.id}/animal_picture/attachments`
    } else {
      endpoint = `api/dataentities/PE/documents/${response.data.createPet.DocumentId}/animal_picture/attachments`
    }
    const requestOptions = {
      headers: {
        // 'Proxy-Authorization': props.authToken.getToken,
        VtexIdclientAutCookie: props.authToken.getToken,
        'X-Vtex-Proxy-To': endpoint,
        'Content-Type': 'multipart/form-data',
        'X-Vtex-Use-Https': true,
        'Cache-Control': 'no-cache',
      },
    }
    try {
      const result = await axios.post(endpoint, formData, requestOptions)
      let petReturn = { ...response.data }
      petReturn.createPet.animal_picture = file.name
      setLoaded(true)
      setModalSave(false)
      setTimeout(() => {
        props.petReturn(petReturn)
      }, 1000)
      setLoadingSave(false)
    } catch (error) {
      throw new TypeError(error)
    }
  }

  function selectAnimalType(value) {
    let newPet = { ...pet }
    newPet.animal_type = value
    setPet(newPet)
  }

  useEffect(() => {
    if (props.data.loading) return
    if (loaded) return
  }, [props.data.loading])

  function renderAnimalBox() {
    let myPetsCardContainer = document.getElementById('myPetCardsContainer')
    myPetsCardContainer.style.display = 'none'
    return (
      <div className={`${handles.choosePetTypeContainer}`}>
        <div className={`${handles.choosePetTypeTitleContainer}`}>
          <h3 className={`${handles.choosePetTypeTitle}`}>
            <FormattedMessage id="store/mypets.petTypeTitle" />
          </h3>
          <p className={`${handles.choosePetTypeDescription}`}>
            <FormattedMessage id="store/mypets.selectCategory" />
          </p>
        </div>
        <div className={`${handles.overflowHiddenContainer}`}>
          <div className={`${handles.yellowCurveFormContainer}`}>
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className={`${handles.yellowCurveForm}`}>
              <path
                className={`${handles.yellowCurveFormPath}`}
                d="M-26.80,154.44 C239.55,90.28 251.41,90.28 559.53,162.33 L540.91,174.17 L-7.05,176.14 Z"></path>
            </svg>
          </div>
          <div className={`${handles.petTypeRow}`}>
            <div
              className={`${handles.petTypeCardContainer}`}
              key="dog"
              onClick={e => selectAnimalType('dog')}>
              <div className={`${handles.petTypeWrapper}`}>
                <div className={`${handles.petTypeIconContainer}`}>
                  <img src={DogIcon} alt="" className={`${handles.petTypeIcon}`} />
                </div>
                <div className={`${handles.petTypeTitleContainer}`}>
                  <h5 className={`${handles.petTypeTitle}`}>
                    <FormattedMessage id="store/mypets.dog" />
                  </h5>
                </div>
              </div>
            </div>
            <div
              className={`${handles.petTypeCardContainer}`}
              key="cat"
              onClick={e => selectAnimalType('cat')}>
              <div className={`${handles.petTypeWrapper}`}>
                <div className={`${handles.petTypeIconContainer}`}>
                  <img src={CatIcon} alt="" className={`${handles.petTypeIcon}`} />
                </div>
                <div className={`${handles.petTypeTitleContainer}`}>
                  <h5 className={`${handles.petTypeTitle}`}>
                    <FormattedMessage id="store/mypets.cat" />
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div className={`${handles.petTypeRow}`}>
            <div
              className={`${handles.petTypeCardContainer}`}
              key="fish"
              onClick={e => selectAnimalType('fish')}>
              <div className={`${handles.petTypeWrapper}`}>
                <div className={`${handles.petTypeIconContainer}`}>
                  <img src={FishIcon} alt="" className={`${handles.petTypeIcon}`} />
                </div>
                <div className={`${handles.petTypeTitleContainer}`}>
                  <h5 className={`${handles.petTypeTitle}`}>
                    <FormattedMessage id="store/mypets.fish" />
                  </h5>
                </div>
              </div>
            </div>
            <div
              className={`${handles.petTypeCardContainer}`}
              key="bird"
              onClick={e => selectAnimalType('bird')}>
              <div className={`${handles.petTypeWrapper}`}>
                <div className={`${handles.petTypeIconContainer}`}>
                  <img src={BirdIcon} alt="" className={`${handles.petTypeIcon}`} />
                </div>
                <div className={`${handles.petTypeTitleContainer}`}>
                  <h5 className={`${handles.petTypeTitle}`}>
                    <FormattedMessage id="store/mypets.bird" />
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div className={`${handles.petTypeRow}`}>
            <div
              className={`${handles.petTypeCardContainer}`}
              key="rabbit"
              onClick={e => selectAnimalType('rabbit')}>
              <div className={`${handles.petTypeWrapper}`}>
                <div className={`${handles.petTypeIconContainer}`}>
                  <img src={RabbitIcon} alt="" className={`${handles.petTypeIcon}`} />
                </div>
                <div className={`${handles.petTypeTitleContainer}`}>
                  <h5 className={`${handles.petTypeTitle}`}>
                    <FormattedMessage id="store/mypets.rabbit" />
                  </h5>
                </div>
              </div>
            </div>
            <div
              className={`${handles.petTypeCardContainer}`}
              key="hamster"
              onClick={e => selectAnimalType('hamster')}>
              <div className={`${handles.petTypeWrapper}`}>
                <div className={`${handles.petTypeIconContainer}`}>
                  <img src={HamsterIcon} alt="" className={`${handles.petTypeIcon}`} />
                </div>
                <div className={`${handles.petTypeTitleContainer}`}>
                  <h5 className={`${handles.petTypeTitle}`}>
                    <FormattedMessage id="store/mypets.hamster" />
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderSaveDialog() {
    return (
      <ModalDialog
        centered
        loading={loadingSave}
        confirmation={{
          onClick: () => savePetInfo(pet),
          label: `${intl.formatMessage({ id: "store/mypets.save" })}`,
        }}
        cancelation={{
          onClick: () => {
            setModalSave(false)
          },
          label: `${intl.formatMessage({ id: "store/mypets.cancel" })}`,
        }}
        isOpen={modalSave}
        onClose={() => {
          setModalSave(false)
        }}>
        <div className={`${handles.savingModalContainer}`}>
          <div className={`${handles.savingModalTextContainer}`}>
            <p className={`${handles.savingModalText}`}>
              <FormattedMessage id="store/mypets.confirmationSave" />
            </p>
          </div>
        </div>
      </ModalDialog>
    )
  }

  function renderDeleteDialog() {
    return (
      <ModalDialog
        centered
        loading={removeLoading}
        confirmation={{
          onClick: () => removePet(pet),
          label: `${intl.formatMessage({ id: "store/mypets.confirm" })}`,
          isDangerous: true,
        }}
        cancelation={{
          onClick: () => {
            setModalDelete(false)
          },
          label: `${intl.formatMessage({ id: "store/mypets.cancel" })}`,
        }}
        isOpen={modalDelete}
        onClose={() => {
          setModalDelete(false)
        }}>
        <div className={`${handles.deleteModalContainer}`}>
          <div className={`${handles.deleteModalTextContainer}`}>
            <p className={`${handles.deleteModalText}`}>
              <FormattedMessage id={`store/mypets.confirmationDelete`} />
            </p>
          </div>
        </div>
      </ModalDialog>
    )
  }

  function handleImageUpload(files) {
    setFile(files[0])
  }

  function renderAnimalForm() {
    let myPetsCardContainer = document.getElementById('myPetCardsContainer')
    myPetsCardContainer.style.display = 'none'
    function setPetIcon(petType) {
      if (petType === 'dog') {
        return DogIcon
      } else if (petType === 'cat') {
        return CatIcon
      } else if (petType === 'fish') {
        return FishIcon
      } else if (petType === 'bird') {
        return BirdIcon
      } else if (petType === 'rabbit') {
        return RabbitIcon
      } else if (petType === 'hamster') {
        return HamsterIcon
      }
    }
    return (
      <div className={`${handles.petFormContainer}`}>
        <div className={`${handles.insertPetDataTitleContainer}`}>
          <h3 className={`${handles.insertPetDataTitle}`}>
            <FormattedMessage id="store/mypets.insertPetDataTitle" />
          </h3>
          <p className={`${handles.insertPetDataDescription}`}>
            <FormattedMessage id="store/mypets.insertPetDataDescription" />
          </p>
          <div className={`${handles.yellowRotatedCurveContainer}`}>
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className={`${handles.yellowRotatedCurve}`}>
              <path
                className={`${handles.yellowRotatedCurvePath}`}
                d="M-26.80,154.44 C239.55,90.28 251.41,90.28 559.53,162.33 L540.91,174.17 L-7.05,176.14 Z"></path>
            </svg>
          </div>
          <div className={`${handles.petTypeIconDecorationContainer}`}>
            <div className={`${handles.petTypeIconDecorationBox}`}>
              <img
                src={setPetIcon(pet.animal_type)}
                alt=""
                className={`${handles.petTypeIconDecoration}`}
              />
            </div>
          </div>
        </div>
        <div className={`${handles.innerPetFormContainer}`}>
          {props.mode == 'edit' && (
            <div className={`${handles.petFormControlType}`}>
              <div className={`${handles.petFormControlLabelContainer}`}>
                <label className={`${handles.petFormControlLabel}`}>
                  <FormattedMessage id="store/mypets.typeOfAnimal" />
                </label>
              </div>
              <div className={`${handles.petFormControlInputContainer}`}>
                <Dropdown
                  value={pet.animal_type}
                  onChange={e => updatePetState(pet, e).updatePetAnimal()}
                  options={renderAnimalOptions()}
                />
              </div>
            </div>
          )}
          <div className={`${handles.petFormControlName}`}>
            <div className={`${handles.petFormControlLabelContainer}`}>
              <label className={`${handles.petFormControlLabel}`}>
                {intl.formatMessage({ id: "store/mypets.petName" }, { pet: intl.formatMessage({ id: `store/mypets.${pet.animal_type}` }).toLowerCase() })}
              </label>
            </div>
            <div className={`${handles.petFormControlInputContainer}`}>
              <input
                className={`${handles.petFormControlInput}`}
                value={pet.animal_name ? pet.animal_name : ''}
                onChange={e => updatePetState(pet, e).updatePetName()}
              />
            </div>
          </div>
          <div className={`${handles.petFormControlBirthDate}`}>
            <div className={`${handles.petFormControlLabelContainer}`}>
              <label className={`${handles.petFormControlLabel}`}>
              {intl.formatMessage({ id: "store/mypets.birthDate" }, { pet: intl.formatMessage({ id: `store/mypets.${pet.animal_type}` }).toLowerCase() })}
              </label>
            </div>
            <div className={`${handles.petFormControlInputContainer}`}>
              <div className={`${handles.petBirthdayInputsContainer}`}>
                <Dropdown
                  className={`${handles.petBirthDateControl}`}
                  value={
                    pet.animal_date_of_birth ? new Date(pet.animal_date_of_birth).getDate() : ''
                  }
                  onChange={e => updatePetState(pet, e).updatePetDayOfBirth()}
                  options={renderDayOptions()}
                />

                <span>-</span>

                <Dropdown
                  className={`${handles.petBirthDateControl}`}
                  value={
                    pet.animal_date_of_birth
                      ? renderMonthOptions()[new Date(pet.animal_date_of_birth).getMonth()].value
                      : ''
                  }
                  onChange={e => updatePetState(pet, e).updatePetMonthOfBirth()}
                  options={renderMonthOptions()}
                />

                <span>-</span>

                <Dropdown
                  className={`${handles.petBirthDateControl}`}
                  value={
                    pet.animal_date_of_birth ? new Date(pet.animal_date_of_birth).getFullYear() : ''
                  }
                  onChange={e => updatePetState(pet, e).updatePetYearOfBirth()}
                  options={renderYearOptions()}
                />
              </div>
            </div>
          </div>
          <div className={`${handles.petFormControlBreed}`}>
            <div className={`${handles.petFormControlLabelContainer}`}>
              <label className={`${handles.petFormControlLabel}`}>
                <FormattedMessage id="store/mypets.petRace" />
              </label>
            </div>
            <div className={`${handles.petFormControlInputContainer}`}>
              <input
                className={`${handles.petFormControlInput}`}
                value={pet.breed ? pet.breed : ''}
                onChange={e => updatePetState(pet, e).updatePetBreed()}
              />
            </div>
          </div>
          {(pet.animal_type === 'fish' || pet.animal_type === 'bird') ? null : <div className={`${handles.petSterylizedFormControl}`}>
            <div className={`${handles.petSterylizedInputContainer}`}>
              <input
                type="checkbox"
                id="sterylized"
                name="sterylized"
                onChange={e => updatePetState(pet, e).updatePetSterylization()}
                checked={pet.sterylized}
              />
            </div>
            <div className={`${handles.petSterylizedLabelContainer}`}>
              <label htmlFor="sterylized" className={`${handles.petFormControlLabel}`}>
                <FormattedMessage id="store/mypets.sterilized" />
              </label>
            </div>
          </div>}
          {(pet.animal_type == 'dog' || pet.animal_type == 'cat') && (
            <div className={`${handles.petFormControlWeight}`}>
              <div className={`${handles.petFormControlLabelContainer}`}>
                <label className={`${handles.petFormControlLabel}`}>
                  {intl.formatMessage({ id: "store/mypets.weightAmount" }, { pet: pet.animal_type.toLowerCase() })}
                </label>
              </div>
              <div className={`${handles.petFormControlInputContainer}`}>
                <input
                  className={`${handles.petFormControlInput}`}
                  type="number"
                  min="0.1"
                  value={pet.weight ? pet.weight : ''}
                  onChange={e => updatePetState(pet, e).updatePetWeight()}
                />
              </div>
            </div>
          )}
          {(pet.animal_type == 'bird' ||
            pet.animal_type == 'fish' ||
            pet.animal_type == 'rabbit' ||
            pet.animal_type == 'hamster') && (
            <div className={`${handles.petFormControlQuantity}`}>
              <div className={`${handles.petFormControlLabelContainer}`}>
                <label className={`${handles.petFormControlLabel}`}>
                  <FormattedMessage id="store/mypets.quantity" />
                </label>
              </div>
              <div className={`${handles.petFormControlInputContainer}`}>
                <input
                  className={`${handles.petFormControlInput}`}
                  type="number"
                  min="1"
                  value={pet.quantity ? pet.quantity : ''}
                  onChange={e => updatePetState(pet, e).updatePetQuantity()}
                />
              </div>
            </div>
          )}
          {props.mode == 'create' && (
            <div className={`${handles.petImageUploadContainer}`}>
              <div className={`${handles.petFormControlLabelContainer}`}>
                <label className={`${handles.petFormControlLabel}`}>
                  <FormattedMessage id="store/mypets.addPhoto" />
                </label>
              </div>
              <div className={`${handles.petImageUploadDropzone}`}>
                <Dropzone
                  accept=".jpg, .jpeg, .png"
                  onDropAccepted={e => {
                    handleImageUpload(e)
                  }}></Dropzone>
              </div>
            </div>
          )}
          <div className={`${handles.petFormButtonsContainer}`}>
            <button className={`${handles.petFormSaveButton}`} onClick={e => setModalSave(true)}>
              <FormattedMessage id="store/mypets.save" />
            </button>
            {props.mode == 'edit' && (
              <button
                className={`${handles.petFormDeleteButton}`}
                onClick={e => {
                  setModalSave(true)
                  setModalDelete(true)
                }}>
                <FormattedMessage id="store/mypets.eliminate" />
              </button>
            )}
          </div>
        </div>
        {renderSaveDialog()}
        {renderDeleteDialog()}
      </div>
    )
  }

  return (
    <div className={`${handles.animalsBoxAndFormWrapper}`}>
      {!pet.animal_type && renderAnimalBox()}
      {pet.animal_type && renderAnimalForm()}
    </div>
  )
}

const withOrderForm = graphql(orderFormQuery, {
  options: () => ({
    ssr: false,
  }),
})

const withUserProfile = graphql(userProfileQuery, {
  options: () => ({
    ssr: false,
  }),
})

const withUpdatePet = graphql(createPetMutation, {
  name: 'updatePet',
})
const withToken = graphql(getTokenQuery, {
  name: 'authToken',
})
const withDeletePet = graphql(deletePetMutation, {
  name: 'deletePet',
})

const withUserEmail = graphql(GET_USER_EMAIL, {
  name: 'userEmail'
})

export default compose(
  withApollo,
  withToken,
  withUserProfile,
  withUpdatePet,
  withDeletePet,
  withUserEmail,
  injectIntl
)(FormPet)
