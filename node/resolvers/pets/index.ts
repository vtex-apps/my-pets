import axios from 'axios'
import getAnimalTypeId from '../../utils'

export const queries = {
  pets: async (_: any, args: any, ctx: any) => {
    const customerId = args.customer_id
    const endpoint = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/PE/search?_where=email=${encodeURIComponent(customerId)}&_fields=_all`
    const requestOptions = {
      headers: {
        'Proxy-Authorization': ctx.vtex.authToken,
        'VtexIdclientAutCookie': ctx.vtex.authToken,
        'X-Vtex-Proxy-To': endpoint,
        'X-Vtex-Use-Https': true,
        'Cache-Control': 'no-cache',
        'REST-Range': 'resources=0-100'
      },
    }
    let pets: any
    try {
      pets = await axios.get(endpoint, requestOptions)

    } catch (error) {
      throw new TypeError(error)
    }

    return pets.data
  },
  pet: async (_: any, args: any, ctx: any) => {
    const pet_id = args.id
    const endpoint = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/PE/documents/${pet_id}?_fields=_all`
    const requestOptions = {
      headers: {
        'Proxy-Authorization': ctx.vtex.authToken,
        'VtexIdclientAutCookie': ctx.vtex.authToken,
        'X-Vtex-Proxy-To': endpoint,
        'X-Vtex-Use-Https': true,
        'Cache-Control': 'no-cache',
      },
    }
    let pet: any
    try {
      pet = await axios.get(endpoint, requestOptions)
    } catch (error) {

      throw new TypeError(error)
    }

    return pet.data
  },
  getToken: async (_: any, args: any, ctx: any) => {
    console.log(args);
    try {
      return ctx.vtex.authToken
    } catch (error) {
      throw new TypeError(error)
    }
  }
}

export const mutations = {
  createPet: async (_: any, args: any, ctx: any) => {
    const {
      animal_date_of_birth,
      animal_name,
      animal_picture,
      animal_type,
      breed,
      customer_id,
      email,
      id,
      quantity,
      sterylized,
      weight
    } = args
    const method = id ? "PATCH" : "POST"
    const endpoint = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/PE/documents/${id ? id : ''}`
    const id_animal = getAnimalTypeId(animal_type);
    const data = {
      id_animal,
      animal_date_of_birth,
      animal_name,
      animal_picture,
      animal_type,
      breed,
      customer_id,
      email,
      id,
      quantity,
      sterylized,
      weight,
    }
    const headers = {
      'Proxy-Authorization': ctx.vtex.authToken,
      'VtexIdclientAutCookie': ctx.vtex.authToken,
      'X-Vtex-Proxy-To': endpoint,
      'X-Vtex-Use-Https': true,
      'Cache-Control': 'no-cache'
    }

    let response: any
    try {
      response = (await axios({
        url: endpoint,
        method,
        data: data,
        headers: headers
      })).data
    } catch (error) {
      throw new TypeError(error)
    }
    response = {
      ...response,
      id_animal,
      animal_date_of_birth,
      animal_name,
      animal_picture,
      animal_type,
      breed,
      customer_id,
      email,
      id,
      quantity,
      sterylized,
      weight
    }
    return response
  },
  deletePet: async (_: any, args: any, ctx: any) => {
    const {
      id
    } = args
    const method = "DELETE"
    const endpoint = `http://${ctx.vtex.account}.myvtex.com/api/dataentities/PE/documents/${id}`
    const headers = {
      'Proxy-Authorization': ctx.vtex.authToken,
      'VtexIdclientAutCookie': ctx.vtex.authToken,
      'X-Vtex-Proxy-To': endpoint,
      'X-Vtex-Use-Https': true,
      'Cache-Control': 'no-cache'
    }
    let response: any
    try {
      response = (await axios({
        url: endpoint,
        method,
        headers: headers
      })).data
    } catch (error) {
      throw new TypeError(error)
    }
    return response
  }
}
