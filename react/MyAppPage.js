import React, {Fragment} from 'react'
// Your component pages
import Home from './Home'
import FormPet from './components/FormPet'
import { Route } from 'vtex.my-account-commons/Router'
import { injectIntl } from 'react-intl'



const MyAppPage = (props) => {
  const { intl } = props;
  return (
  <Fragment>
    <Route path={`/${intl.formatMessage({ id: "store/mypets.animal" })}`} component={Home} />
  </Fragment>
  )
}


export default injectIntl(MyAppPage)
