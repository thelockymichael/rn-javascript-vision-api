import axios from 'axios'
import {useState, useEffect} from 'react'
import {appIdentifier} from '../config/environment'

const apiUrl = 'http://media.mw.metropolia.fi/wbma/'

const useLoadMedia = (filter, userId) => {
  const [mediaArray, setMediaArray] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadMedia = async () => {
    setIsRefreshing(true)
    try {
      // const response = await fetch(apiUrl + 'media');
      const response = await fetch(apiUrl + 'tags/' + appIdentifier)
      const json = await response.json()
      let media = await Promise.all(json.map(async (item) => {
        const resp2 = await fetch(apiUrl + 'media/' + item.file_id)
        const json2 = await resp2.json()

        const respFav = await fetch(apiUrl + 'favourites/file/' + item.file_id)
        const jsonFav = await respFav.json()


        const allData = JSON.parse(json2.description)
        const detectedText = allData.detectedText

        const result = {
          ...json2,
          description: detectedText,
          favourites: jsonFav,
        }


        return result
      }))

      switch (filter) {
        case 'ALL':
          setMediaArray(media)
          break
        case 'EDITABLE':
          media = media.filter((item) => {
            return item.user_id == userId
          })
          setMediaArray(media)
          break
        case 'FAVOURITES':
          media = media.filter((item) => {
            if (Array.isArray(item.favourites) || item.favourites.length) {
              const isFavourite = item.favourites.some((item) => {
                return item.user_id === userId
              })

              if (isFavourite) {
                return item
              }
            }
          })


          setMediaArray(media)
      }
    } catch (error) {
      throw new Error(error)
    }

    setIsRefreshing(false)
  }

  useEffect(() => {
    loadMedia()
  }, [])

  return {
    mediaArray,
    loadMedia,
    isRefreshing,
  }
}

const postLogIn = async (userCreds) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(userCreds),
  }
  try {
    const response = await fetch(apiUrl + 'login', options)
    const userData = await response.json()
    if (response.ok) {
      return userData
    } else {
      throw new Error(userData.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

const postRegistration = async (newUser) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newUser),
  }
  try {
    const response = await fetch(apiUrl + 'users', options)

    const result = await response.json()
    console.log('wassup02', result)
    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

const checkToken = async (token) => {
  const options = {
    method: 'GET',
    headers: {'x-access-token': token},
  }
  try {
    const response = await fetch(apiUrl + 'users/user', options)
    const userData = await response.json()
    if (response.ok) {
      return userData
    } else {
      throw new Error(userData.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

const getAvatar = async () => {
  try {
    const response = await fetch(apiUrl + 'tags/avatar_6')
    const avatarImages = await response.json()
    if (response.ok) {
      return avatarImages
    } else {
      throw new Error(avatarImages.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

const checkAvailable = async (username) => {
  try {
    const response = await fetch(apiUrl + 'users/username/' + username)
    const resultData = await response.json()
    if (response.ok) {
      if (resultData.available) {
        return null
      } else {
        return 'Username ' + username + ' is not available.'
      }
    } else {
      throw new Error(resultData.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

const upload = async (fd, token) => {
  const options = {
    method: 'POST',
    headers: {'x-access-token': token},
    data: fd,
    url: apiUrl + 'media',
  }

  try {
    const response = await axios(options)

    return response.data
  } catch (e) {
    throw new Error(e.message)
  }
}


// Update a file
const updateFile = async (fileId, fileInfo, token) => {
  const moreData = {
    description: 'This is the actual description',
    detectedText: fileInfo.description,
  }
  const description = JSON.stringify(moreData)

  const newFileInfo = {...fileInfo, description}


  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(
      newFileInfo,
    ),
  }
  try {
    const response = await fetch(apiUrl + 'media/' + fileId, options)
    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

// Delete a file
const deleteFile = async (fileId, token) => {
  const options = {
    method: 'DELETE',
    headers: {
      'x-access-token': token,
    },
  }
  try {
    const response = await fetch(apiUrl + 'media/' + fileId, options)
    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
  // http://media.mw.metropolia.fi/wbma/docs/#api-Media-DeleteMediaFile
}

const postTag = async (tag, token) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(tag),
  }
  try {
    const response = await fetch(apiUrl + 'tags', options)
    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
  // http://media.mw.metropolia.fi/wbma/docs/#api-Tag-PostTag
}

const allFavourites = async (token) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }

  try {
    const response = await fetch(apiUrl + 'favourites', options)
    const json = await response.json()
    const media = await Promise.all(json.map(async (item) => {
      const resp2 = await fetch(apiUrl + 'media/' + item.file_id)
      const json2 = await resp2.json()

      const allData = JSON.parse(json2.description)
      const detectedText = allData.detectedText


      const result = {
        ...json2,
        description: detectedText,
      }
      return result
    }))

    return media
  } catch (err) {
    throw new Error(err)
  }
}

const favourite = async (token, fileId) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(fileId),
  }

  try {
    const response = await fetch(apiUrl + 'favourites', options)
    const result = await response.json()


    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (err) {
    throw new Error(err)
  }
}

const deleteFavourite = async (token, fileId) => {
  const options = {
    method: 'DELETE',
    headers: {
      'x-access-token': token,
    },
  }

  try {
    const response = await fetch(apiUrl + 'favourites/file/' + fileId, options)
    const result = await response.json()


    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (err) {
    throw new Error(err)
  }
}


// get user info
const getUser = async (id, token) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }
  try {
    const response = await fetch(apiUrl + 'users/' + id, options)
    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
  // http://media.mw.metropolia.fi/wbma/docs/#api-Tag-PostTag
}

const updateUserInfo = async (userData, token) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(userData),
  }
  try {
    const response = await fetch(apiUrl + 'users', options)
    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      throw new Error(result.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

export {
  useLoadMedia,
  postLogIn,
  checkToken,
  postRegistration,
  getAvatar,
  checkAvailable,
  upload,
  updateFile,
  deleteFile,
  postTag,
  favourite,
  deleteFavourite,
  allFavourites,
  getUser,
  updateUserInfo,
  appIdentifier,
}
