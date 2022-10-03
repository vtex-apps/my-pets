import React, { useEffect, useState, Fragment } from 'react'
import { withApollo, compose, graphql } from 'react-apollo'
import FormPet from './components/FormPet'
import PetList from './components/PetList'
import petsQuery from './graphql/pets.gql'
import createPetMutation from './graphql/createPet.gql'
import removePetMutation from './graphql/deletePet.gql'
import orderFormQuery from './graphql/orderForm.gql'
import userProfileQuery from './graphql/userProfile.gql'
import GET_USER_EMAIL from './graphql/getUserEmail.gql'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import PawPrint from './components/icons/pawprint.png'

//import './code-block.global.css'
import './Home.css'

const CSS_HANDLES = [
  'noPetsContainer',
  'yellowCurveContainer',
  'yellowCurve',
  'yellowCurvePath',
  'noPetsYellowContainer',
  'noPetsImageContainer',
  'noPetsImage',
  'noPetsFirstParagraph',
  'noPetsSecondParagraph',
  'myPetsContainer',
  'myPetsTitle',
  'myPetsListContainer',
  'addPetButtonContainer',
  'addPetButton',
  'myPetCardsContainer'
]

const Home = props => {
  const [loaded, setLoaded] = useState(false)
  const [isVisibleList, setIsVisibleList] = useState(false)
  const [isNewPet, setIsNewPet] = useState({
    isVisible: false,
    pet: {
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
    },
  })

  const [isUpdatePet, setIsUpdatePet] = useState({
    isVisible: false,
    pet: {},
  })
  const [pets, setPets] = useState(null)
  const handles = useCssHandles(CSS_HANDLES)

  const getPets = async () => {
    const userProfileId = props.data.getSession?.profile.email || props.userEmail?.profile.email
    if (userProfileId) {
      const response = await props.client.query({
        query: petsQuery,
        variables: {
          customerId: userProfileId,
        },
        fetchPolicy: 'network-only'
      })
      setPets(response.data.pets)
      setIsVisibleList(true)
      setLoaded(true)
    }
  }

  const onDeletePet = id => {
    let newPetList = [...pets]
    newPetList = newPetList.filter(pet => {
      return pet.id != id
    })
    setPets(newPetList)
    setIsUpdatePet({ isVisible: false })
    setIsVisibleList(true)
  }

  const handleUpdatePet = pet => {
    setIsVisibleList(false)
    setIsUpdatePet({ pet, isVisible: true })
  }

  const onUpdatePet = pet => {
    setIsUpdatePet({ pet, isVisible: false })
    setIsVisibleList(true)
    const newPetList = [...pets]
    let foundIndex = newPetList.findIndex(lPet => lPet.id == pet.createPet.id)
    newPetList[foundIndex] = pet.createPet
    setPets(newPetList)
  }

  const onCreatePet = pet => {
    setIsNewPet({ ...isNewPet, isVisible: false })
    setIsVisibleList(true)
    pet.createPet.id = pet.createPet.DocumentId
    const newPetList = [...pets]
    newPetList.push(pet.createPet)
    setPets(newPetList)
  }

  const handleCreatePet = () => {
    setIsVisibleList(false)
    setIsNewPet({ ...isNewPet, isVisible: true })
  }
  useEffect(() => {
    if (props.data.loading || props.userEmail.loading) return
    if (loaded) return
    getPets()
  }, [props.data, props.userEmail, loaded])

  function addStylePetsCardContainer() {
        let myPetsCardContainer = document.getElementById('myPetCardsContainer')
    if (screen.width < 768) {
      myPetsCardContainer.style.display = 'block'
    } else {
      myPetsCardContainer.style.display = 'flex'
    }
    return true;
  }

  return (
    <div className={`${handles.myPetsContainer}`}>
      <h2 className={`${handles.myPetsTitle}`}>
        <FormattedMessage id="store/mypets.homeTitle"/>
      </h2>
      <div className={`${handles.myPetsListContainer}`}>
        {isVisibleList && pets && pets.length == 0 && (
          <div className={`${handles.noPetsContainer}`}>
            <div className={`${handles.yellowCurveContainer}`}>
              <svg
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
                className={`${handles.yellowCurve}`}>
                <path
                  className={`${handles.yellowCurvePath}`}
                  d="M-26.80,154.44 C239.55,90.28 251.41,90.28 559.53,162.33 L540.91,174.17 L-7.05,176.14 Z"></path>
              </svg>
            </div>
            <div className={`${handles.noPetsYellowContainer}`}>
              <div className={`${handles.noPetsImageContainer}`}>
                <img className={`${handles.noPetsImage}`} src={PawPrint} alt="" />
              </div>
              <p className={`${handles.noPetsFirstParagraph}`}>
                <FormattedMessage id="store/mypets.noPetsTitle" />
              </p>
              <p className={`${handles.noPetsSecondParagraph}`}>
                <FormattedMessage id="store/mypets.noPetsSubtitle" />
              </p>
            </div>
          </div>
        )}
        {isVisibleList && (
          <div className={`${handles.addPetButtonContainer}`}>
            {/* <p className="my-pet-new-form" onClick={(e) => setNewFormPet(e)}>+ Adicionar Animal</p> */}
            <button className={`${handles.addPetButton}`} onClick={() => handleCreatePet()}>
              <FormattedMessage id="store/mypets.addPets" />
            </button>
          </div>
        )}
      </div>
      <div id="myPetCardsContainer" className={`${handles.myPetCardsContainer}`}>
        {isVisibleList &&
          loaded &&
          pets &&
          pets.length > 0 &&
          addStylePetsCardContainer() &&
          pets.map(pet => {
            return <PetList key={pet.id} pet={pet} onUpdatePet={handleUpdatePet} />
          })
        }
        {!loaded &&
          (<Spinner />)}
      </div>
      {isNewPet.isVisible == true && (
        <FormPet mode="create" petReturn={onCreatePet} pet={isNewPet.pet} />
      )}
      {isUpdatePet.isVisible == true && (
        <FormPet
          mode="edit"
          onDeletePet={onDeletePet}
          petReturn={onUpdatePet}
          pet={isUpdatePet.pet}
        />
      )}
    </div>
  )
}

const withUserProfile = graphql(userProfileQuery, {
  options: () => ({
    ssr: false,
  }),
})

const withUpdatePet = graphql(createPetMutation, {
  name: 'updatePet',
})

const withRemovePet = graphql(removePetMutation, {
  name: 'removePet',
})

const withUserEmail = graphql(GET_USER_EMAIL, {
  name: 'userEmail'
})

export default compose(
  withApollo,
  withUpdatePet,
  withUserProfile,
  withRemovePet,
  withUserEmail
)(Home)
